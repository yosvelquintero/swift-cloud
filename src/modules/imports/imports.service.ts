import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { parse } from 'fast-csv';
import * as fs from 'fs';
import { Types } from 'mongoose';
import { Observable } from 'rxjs';
import { finalize, mergeMap } from 'rxjs/operators';

import { AlbumsService } from '@app/modules/albums/albums.service';
import { CreateAlbumDto } from '@app/modules/albums/dto';
import { TAlbumDocument } from '@app/modules/albums/entities/album.entity';
import { ArtistsService } from '@app/modules/artists/artists.service';
import { CreateSongDto } from '@app/modules/songs/dto/create-song.dto';
import { SongsService } from '@app/modules/songs/songs.service';
import { WritersService } from '@app/modules/writers/writers.service';
import { IPlay } from '@app/types';
import { EAlbumType } from '@app/types/enums/album';
import { ICsvRecord } from '@app/types/interfaces/csv';

interface IParsedRecord {
  songTitle: string;
  artistField: string;
  writerField: string;
  albumTitle: string;
  year: number;
}

interface IResolvedEntities {
  mainArtistIds: string[];
  featuringArtistIds: string[];
  writerIds: string[];
  album: TAlbumDocument;
}

interface ILogRecord {
  title: string;
  album: TAlbumDocument;
  songTitle: string;
  mainArtistIds: string[];
  featuringArtistIds: string[];
  writerIds: string[];
  year: number;
  plays: IPlay[];
}

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);

  private readonly concurrencyLimit = 10;
  private readonly csvParseOptions = {
    headers: true,
    ignoreEmpty: true,
    quote: '"',
    escape: '"',
    delimiter: ',',
    trim: true,
  };
  private readonly albumTitleSeparator = ' - ';
  private readonly albumTitleMap: Record<string, EAlbumType> = {
    none: EAlbumType.SINGLE,
    'none[a]': EAlbumType.REMIX,
    'none[b]': EAlbumType.PROMO,
    'none[c]': EAlbumType.LIVE,
    'none[d]': EAlbumType.SOUNDTRACK,
    'none[e]': EAlbumType.STANDARD,
    'none[f]': EAlbumType.OTHER,
  };

  private artistCache = new Map<string, string>();
  private writerCache = new Map<string, string>();
  private albumCache = new Map<string, TAlbumDocument>();

  constructor(
    private readonly albumsService: AlbumsService,
    private readonly artistsService: ArtistsService,
    private readonly songsService: SongsService,
    private readonly writersService: WritersService,
  ) {}

  /**
   * Import song data from a CSV file.
   *
   * @param filePath The path to the CSV file.
   *
   * @returns A promise that resolves when the import is complete or rejects
   * if an error occurs.
   */
  async importFromCsv(filePath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const csvStream = fs
        .createReadStream(filePath)
        .pipe(parse<ICsvRecord, ICsvRecord>(this.csvParseOptions));

      const data$ = new Observable<ICsvRecord>((subscriber) => {
        csvStream.on('data', (data: ICsvRecord) => subscriber.next(data));
        csvStream.on('error', (error) => subscriber.error(error));
        csvStream.on('end', () => subscriber.complete());
      });

      data$
        .pipe(
          mergeMap(
            (record) => this.processCsvRecord(record),
            this.concurrencyLimit,
          ),
          finalize(() => {
            this.logger.log('Import completed successfully.');
            resolve();
          }),
        )
        .subscribe({
          error: (error) => {
            this.logger.error(
              `Import failed due to error: ${error.message}`,
              error.stack,
            );
            reject(error);
          },
        });
    });
  }

  /**
   * Process a single CSV record.
   *
   * @param record The record to process.
   *
   * @returns A promise that resolves when the record is processed or rejects
   * if an error occurs.
   */
  private async processCsvRecord(record: ICsvRecord): Promise<void> {
    try {
      const parsedRecord = this.extractRecordDetails(record);
      const resolvedEntities = await this.fetchAndResolveEntities(parsedRecord);
      const plays = this.parsePlayCounts(record);

      const songId = await this.ensureSongExists({
        title: parsedRecord.songTitle,
        artistIds: resolvedEntities.mainArtistIds,
        featuringArtistIds: resolvedEntities.featuringArtistIds,
        writerIds: resolvedEntities.writerIds,
        album: resolvedEntities.album,
        year: parsedRecord.year,
        plays,
      });

      await this.appendSongToAlbum(resolvedEntities.album, songId);
      this.logRecordInfo({
        title: parsedRecord.albumTitle,
        album: resolvedEntities.album,
        songTitle: parsedRecord.songTitle,
        mainArtistIds: resolvedEntities.mainArtistIds,
        featuringArtistIds: resolvedEntities.featuringArtistIds,
        writerIds: resolvedEntities.writerIds,
        year: parsedRecord.year,
        plays,
      });
    } catch (error) {
      this.logger.error(
        `Error processing record: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Extracts the relevant details from a CSV record.
   *
   * @param record The CSV record to extract from.
   *
   * @returns An object containing the extracted details: song title, artist field, writer field, album title, and year.
   * @throws {Error} If the year value is invalid.
   */
  private extractRecordDetails(record: ICsvRecord): IParsedRecord {
    const {
      Song: songTitle,
      Artist: artistField,
      Writer: writerField,
      Album: albumTitle,
      Year: yearStr,
    } = record;

    const year = parseInt(yearStr, 10);
    if (isNaN(year)) {
      throw new Error(`Invalid year value: ${yearStr}`);
    }

    return {
      songTitle,
      artistField,
      writerField,
      albumTitle,
      year,
    };
  }

  /**
   * Fetches and resolves the entities for a parsed record:
   * artists, writers, and album.
   *
   * @param parsedRecord The parsed record to fetch and resolve the entities for.
   *
   * @returns An object containing the resolved entities: main artist IDs, featuring artist IDs, writer IDs, and album.
   */
  private async fetchAndResolveEntities(
    parsedRecord: IParsedRecord,
  ): Promise<IResolvedEntities> {
    const { artistField, writerField, albumTitle, year } = parsedRecord;

    const { mainArtists, featuringArtists } =
      this.splitMainAndFeaturingArtists(artistField);
    const mainArtistIds = await this.findOrCreateArtists(mainArtists);
    const featuringArtistIds = await this.findOrCreateArtists(featuringArtists);
    const writerIds = await this.findOrCreateWriters(writerField);
    const album = await this.findOrCreateAlbum(albumTitle, mainArtistIds, year);

    return {
      mainArtistIds,
      featuringArtistIds,
      writerIds,
      album,
    };
  }

  private async findOrCreateArtists(artistNames: string[]): Promise<string[]> {
    const artistIds: string[] = [];
    for (const name of artistNames) {
      const id = await this.findOrCreateArtist(name);
      artistIds.push(id);
    }
    return artistIds;
  }

  /**
   * Finds or creates the writers for a given writer field.
   *
   * @param writerField The writer field to find or create the writers for.
   * @returns An array of writer IDs.
   */
  private async findOrCreateWriters(writerField: string): Promise<string[]> {
    const writerNames = writerField
      .split(/[\r?\n,]+/)
      .map((str) => str.trim())
      .filter(Boolean);

    const writerIds: string[] = [];
    for (const name of writerNames) {
      const id = await this.findOrCreateWriter(name);
      writerIds.push(id);
    }
    return writerIds;
  }

  /**
   * Finds or creates an album for a given title, artist IDs, and year.
   *
   * @param title The title of the album.
   * @param artistIds The IDs of the artists on the album.
   * @param year The year the album was released.
   *
   * @returns The document for the album.
   */
  private async findOrCreateAlbum(
    title: string,
    artistIds: string[],
    year: number,
  ): Promise<TAlbumDocument> {
    const albumTitle = title
      .split(/\r?\n/)
      .map((str) => str.trim())
      .join(this.albumTitleSeparator);
    const normalizedString = this.removeFootnotesFromString(albumTitle);
    const normalizedTitle = this.normalizeAlbumTitle(normalizedString);
    return this.getOrCreateAlbum(normalizedTitle, year, artistIds);
  }

  /**
   * Finds or creates an entity by name.
   *
   * @param name The name of the entity to find or create.
   * @param cache A cache to store the results of this function in, so that it
   *     can be reused across multiple calls.
   * @param service The service to use to find or create the entity. This should
   *     have a `findOneByName` method that takes a name and returns a promise
   *     that resolves to the entity if it exists, and a `create` method that
   *     takes a DTO and returns a promise that resolves to the newly-created
   *     entity.
   * @param entityName The name of the entity being found or created. This is
   *     used for logging and caching purposes.
   *
   * @returns A promise that resolves to the ID of the entity.
   */
  private async findOrCreateEntity<T extends { id: string }>(
    name: string,
    cache: Map<string, string>,
    service: {
      findOneByName: (name: string) => Promise<T>;
      create: (dto: any) => Promise<T>;
    },
    entityName: string,
  ): Promise<string> {
    const cacheKey = `${entityName}|${name}`;
    name = this.removeFootnotesFromString(name);

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    try {
      const entity = await service.findOneByName(name);

      cache.set(cacheKey, entity.id);
      return entity.id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.debug(
          `${entityName} not found. Creating new ${entityName}: ${name}`,
        );

        const newEntity = await service.create({ name });
        cache.set(cacheKey, newEntity.id);
        return newEntity.id;
      }

      this.logger.error(
        `Error finding or creating ${entityName} "${name}": ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Finds or creates an artist by name.
   *
   * @param name The name of the artist to find or create.
   *
   * @returns A promise that resolves to the ID of the artist.
   */
  private async findOrCreateArtist(name: string): Promise<string> {
    return this.findOrCreateEntity(
      name,
      this.artistCache,
      {
        findOneByName: this.artistsService.findOneByName.bind(
          this.artistsService,
        ),
        create: this.artistsService.create.bind(this.artistsService),
      },
      'Artist',
    );
  }

  /**
   * Finds or creates a writer by name.
   *
   * @param name The name of the writer to find or create.
   *
   * @returns A promise that resolves to the ID of the writer.
   */
  private async findOrCreateWriter(name: string): Promise<string> {
    return this.findOrCreateEntity(
      name,
      this.writerCache,
      {
        findOneByName: this.writersService.findOneByName.bind(
          this.writersService,
        ),
        create: this.writersService.create.bind(this.writersService),
      },
      'Writer',
    );
  }

  /**
   * Finds or creates an album for a given title, artists, and year.
   *
   * @param title The title of the album.
   * @param year The year the album was released.
   * @param artistIds The IDs of the artists on the album.
   *
   * @returns A promise that resolves to the document for the album.
   */
  private async getOrCreateAlbum(
    title: string,
    year: number,
    artistIds: string[],
  ): Promise<TAlbumDocument> {
    if (this.albumCache.has(title)) {
      return this.albumCache.get(title);
    }
    try {
      const existingAlbum =
        await this.albumsService.findOneByTitleArtistsAndYear(
          title,
          artistIds,
          year,
        );
      this.logger.debug(
        `Found existing album: "${title}" (${year}) [ID: ${existingAlbum.id}]`,
      );
      this.albumCache.set(title, existingAlbum);
      return existingAlbum;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.debug(
          `Album not found. Creating new album: "${title}" (${year})`,
        );
        const createAlbumDto: CreateAlbumDto = {
          title,
          artistIds,
          year,
        };
        const newAlbum = await this.albumsService.create(createAlbumDto);
        this.albumCache.set(title, newAlbum);
        return newAlbum;
      }
      this.logger.error(
        `Error finding or creating album "${title}": ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Finds or creates a song with the given title, artists, featuring artists,
   * writers, album, year, and plays.
   *
   * @param data The data to create the song with.
   *
   * @returns A promise that resolves to the ID of the created song.
   */
  private async ensureSongExists(data: {
    title: string;
    artistIds: string[];
    featuringArtistIds: string[];
    writerIds: string[];
    album: TAlbumDocument;
    year: number;
    plays: IPlay[];
  }): Promise<string> {
    const { artistIds, featuringArtistIds, writerIds, album, year, plays } =
      data;
    const str = this.removeFootnotesFromString(data.title);
    const title = this.removeExtraSpaceBeforeQuestionMark(str);
    try {
      const existingSong = await this.songsService.findOneByTitleArtistsAndYear(
        title,
        artistIds,
        year,
      );
      this.logger.debug(
        `Found existing song: "${title}" [ID: ${existingSong.id}]`,
      );
      return existingSong.id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.debug(`Song not found. Creating new song: "${title}"`);
        const createSongDto: CreateSongDto = {
          title,
          albumIds: album.id ? [album.id] : [],
          artistIds,
          featuringArtistIds,
          writerIds,
          year,
          plays,
        };
        const newSong = await this.songsService.create(createSongDto);
        return newSong.id;
      }
      this.logger.error(
        `Error finding or creating song "${title}": ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Appends a song to an album by adding its ID to the album's `songIds` array.
   *
   * @param album The album to which the song should be appended.
   * @param songId The ID of the song to be appended.
   *
   * @throws {BadRequestException} If the `songId` is invalid.
   */
  private async appendSongToAlbum(
    album: TAlbumDocument,
    songId: string,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(songId)) {
      this.logger.error(`Invalid song ID: "${songId}"`);
      throw new BadRequestException('Invalid song ID.');
    }

    const songObjectId = new Types.ObjectId(songId);
    const songExists = album.songIds.some((id) => id.equals(songObjectId));
    if (songExists) {
      this.logger.debug(
        `Song ID "${songId}" already exists in album "${album.title}". Skipping.`,
      );
      return;
    }

    album.songIds.push(songObjectId);

    try {
      await album.save();

      this.logger.debug(
        `Added song ID "${songId}" to album "${album.title}" [ID: ${album.id}]`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to add song ID "${songId}" to album "${album.title}" [ID: ${album.id}]: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Parses play counts from a CSV record.
   *
   * The function iterates through the record's key-value pairs, looking for
   * keys that start with 'Plays - ' and attempting to parse the corresponding
   * value as a number. If the value is a valid number, the function creates a
   * new `IPlay` object using the current year and the parsed month name, and
   * adds it to the `plays` array. If the value is not a valid number, a warning
   * is logged. If the month name is invalid, a warning is also logged.
   *
   * @param record The CSV record to parse.
   *
   * @returns The array of parsed play counts.
   */
  private parsePlayCounts(record: ICsvRecord): IPlay[] {
    const plays: IPlay[] = [];
    const currentYear = new Date().getFullYear();

    for (const [key, value] of Object.entries(record)) {
      if (key.startsWith('Plays - ')) {
        const monthName = key.replace('Plays - ', '').trim();
        const count = parseInt(value, 10);

        if (isNaN(count)) {
          this.logger.warn(`Invalid play count for "${monthName}": ${value}`);
          continue;
        }

        const monthDate = new Date(`${monthName} 1, ${currentYear}`);
        if (isNaN(monthDate.getTime())) {
          this.logger.warn(`Invalid month name: "${monthName}"`);
          continue;
        }

        plays.push({ month: monthDate, count });
      }
    }

    return plays;
  }

  /**
   * Splits a string containing artist names into main and featuring artists.
   *
   * The function takes a string containing artist names, normalizes it by
   * replacing line breaks with spaces, removes leading 'and ' or '& ', and then
   * splits the string into main and featuring parts using regular expressions.
   * The main and featuring parts are then split into individual artist names,
   * and the function returns an object with two arrays: `mainArtists` and
   * `featuringArtists`.
   *
   * @param artistField The string containing artist names.
   *
   * @returns An object with two arrays: `mainArtists` and `featuringArtists`.
   */
  private splitMainAndFeaturingArtists(artistField: string): {
    mainArtists: string[];
    featuringArtists: string[];
  } {
    const mainArtists: string[] = [];
    const featuringArtists: string[] = [];
    const featuringPrefixes = ['featuring', 'feat.', 'ft.'];

    // Normalize the artist field by replacing line breaks with spaces
    let normalizedField = artistField.replace(/\r?\n/g, ' ').trim();

    // Remove leading 'and ' or '& ' if present
    normalizedField = normalizedField.replace(/^(and |& )/i, '').trim();

    // Regular expression to match 'featuring' keywords
    const featuringRegex = new RegExp(featuringPrefixes.join('|'), 'i');

    // Split the field into main and featuring parts
    const [mainPart, featuringPart] = normalizedField.split(featuringRegex);

    // Process main artists
    if (mainPart) {
      mainArtists.push(...this.splitArtistNames(mainPart));
    }

    // Process featuring artists
    if (featuringPart) {
      featuringArtists.push(
        ...this.cleanFeaturingArtistNames(this.splitArtistNames(featuringPart)),
      );
    }

    this.logger.debug(
      `Parsed Artists - Main: [${mainArtists.join(', ')}], Featuring: [${featuringArtists.join(', ')}]`,
    );

    return { mainArtists, featuringArtists };
  }

  /**
   * Splits a string containing multiple artist names into an array of
   * individual artist names.
   *
   * @param names The string containing multiple artist names.
   *
   * @returns An array of individual artist names.
   */
  private splitArtistNames(names: string): string[] {
    // Split on commas, ' and ', '&', and multiple spaces
    return names
      .split(/,| and | & |&/i)
      .map((str) => str.trim())
      .filter((str) => str.length > 0);
  }

  /**
   * Normalizes an album title by replacing it with a standardized title
   * if it exists in the album title map.
   *
   * @param title The album title to normalize.
   *
   * @returns The normalized album title.
   */
  private normalizeAlbumTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    return this.albumTitleMap[lowerTitle] || title;
  }

  /**
   * Removes footnotes (i.e. [a], [b], [c], etc.) from a given string.
   *
   * @param str The string to remove footnotes from.
   *
   * @returns The string with footnotes removed.
   */
  private removeFootnotesFromString(str: string): string {
    return str.replace(/\[\w\]/g, '').trim();
  }

  /**
   * Removes extra spaces before question marks in a given string.
   *
   * @param str The string to remove extra spaces from.
   *
   * @returns The string with extra spaces before question marks removed.
   */
  private removeExtraSpaceBeforeQuestionMark(str: string): string {
    return str.replace(/ +\?/g, '?');
  }

  /**
   * Cleans featuring artist names by removing the "of" part and
   * any extra text that might be present.
   *
   * @param artists The featuring artists to clean.
   *
   * @returns The cleaned featuring artist names.
   */
  private cleanFeaturingArtistNames(artists: string[]): string[] {
    return artists.map((artist) => {
      // Regular expression to match the artist's name before "of"
      // or the end of the string
      const artistNameRegex = /^([\w\s'-]+?)\s*(?:of\s+.*|$)/i;
      const match = artistNameRegex.exec(artist);

      if (match) {
        return match[1].trim();
      }

      return artist.trim();
    });
  }

  /**
   * Logs the details of a single record to the console.
   *
   * @param data The data to log.
   */
  private logRecordInfo(data: ILogRecord): void {
    const {
      album,
      songTitle,
      mainArtistIds,
      featuringArtistIds,
      writerIds,
      title,
      year,
      plays,
    } = data;

    this.logger.log('--- Record Details ---');
    this.logger.log(`Album Title: ${title}`);
    this.logger.log(
      `Album Songs: ${album.songIds.map((id) => id.toString()).join(', ')}`,
    );
    this.logger.log(`Song Title: ${songTitle}`);
    this.logger.log(`Main Artist IDs: ${mainArtistIds.join(', ')}`);
    this.logger.log(`Featuring Artist IDs: ${featuringArtistIds.join(', ')}`);
    this.logger.log(`Writer IDs: ${writerIds.join(', ')}`);
    this.logger.log(`Year: ${year}`);
    this.logger.log(`Plays: ${JSON.stringify(plays, null, 2)}`);
    this.logger.log('--- End of Record ---');
  }
}
