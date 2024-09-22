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
import { AlbumDocument } from '@app/modules/albums/entities/album.entity';
import { ArtistsService } from '@app/modules/artists/artists.service';
import { CreateSongDto } from '@app/modules/songs/dto/create-song.dto';
import { SongsService } from '@app/modules/songs/songs.service';
import { WritersService } from '@app/modules/writers/writers.service';
import { IPlay } from '@app/types';
import { EAlbumType } from '@app/types/enums/album';
import { ICsvRecord } from '@app/types/interfaces/csv';

interface ParsedRecord {
  songTitle: string;
  artistField: string;
  writerField: string;
  albumTitle: string;
  year: number;
}

interface ResolvedEntities {
  mainArtistIds: string[];
  featuringArtistIds: string[];
  writerIds: string[];
  album: AlbumDocument;
}

interface ILogRecord {
  albumTitle: string;
  album: AlbumDocument;
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
  private readonly featuringPrefixes = ['featuring ', 'feat. '];

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
  private albumCache = new Map<string, AlbumDocument>();

  constructor(
    private readonly albumsService: AlbumsService,
    private readonly artistsService: ArtistsService,
    private readonly songsService: SongsService,
    private readonly writersService: WritersService,
  ) {}

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
            (record) => this.processRecord(record),
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

  private async processRecord(record: ICsvRecord): Promise<void> {
    try {
      const parsedRecord = this.parseRecord(record);
      const resolvedEntities = await this.resolveEntities(parsedRecord);
      const plays = this.extractPlays(record);

      const songId = await this.findOrCreateSong({
        songTitle: parsedRecord.songTitle,
        mainArtistIds: resolvedEntities.mainArtistIds,
        featuringArtistIds: resolvedEntities.featuringArtistIds,
        writerIds: resolvedEntities.writerIds,
        album: resolvedEntities.album,
        year: parsedRecord.year,
        plays,
      });

      await this.addSongToAlbum(resolvedEntities.album, songId);
      this.logRecordDetails({
        albumTitle: parsedRecord.albumTitle,
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
      // Optionally rethrow to be handled by subscriber
      // throw error;
    }
  }

  private parseRecord(record: ICsvRecord): ParsedRecord {
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

  private async resolveEntities(
    parsedRecord: ParsedRecord,
  ): Promise<ResolvedEntities> {
    const { artistField, writerField, albumTitle, year } = parsedRecord;

    const { mainArtists, featuringArtists } = this.parseArtists(artistField);
    const mainArtistIds = await this.resolveArtists(mainArtists);
    const featuringArtistIds = await this.resolveArtists(featuringArtists);
    const writerIds = await this.resolveWriters(writerField);
    const album = await this.resolveAlbum(albumTitle, mainArtistIds, year);

    return {
      mainArtistIds,
      featuringArtistIds,
      writerIds,
      album,
    };
  }

  private parseArtists(artistField: string): {
    mainArtists: string[];
    featuringArtists: string[];
  } {
    const mainArtists: string[] = [];
    const featuringArtists: string[] = [];

    // Normalize the artist field by replacing line breaks with spaces
    let normalizedField = artistField.replace(/\r?\n/g, ' ').trim();

    // Remove leading 'and ' or '& ' if present
    normalizedField = normalizedField.replace(/^(and |& )/i, '').trim();

    // Regular expression to match 'featuring' keywords
    const featuringRegex = new RegExp(this.featuringPrefixes.join('|'), 'i');

    // Split the field into main and featuring parts
    const [mainPart, featuringPart] = normalizedField.split(featuringRegex);

    // Process main artists
    if (mainPart) {
      mainArtists.push(...this.splitArtistNames(mainPart));
    }

    // Process featuring artists
    if (featuringPart) {
      featuringArtists.push(...this.splitArtistNames(featuringPart));
    }

    this.logger.debug(
      `Parsed Artists - Main: [${mainArtists.join(', ')}], Featuring: [${featuringArtists.join(', ')}]`,
    );

    return { mainArtists, featuringArtists };
  }

  private splitArtistNames(names: string): string[] {
    // Split on commas, ' and ', '&', and multiple spaces
    return names
      .split(/,| and | & |&/i)
      .map((name) => name.trim())
      .map((name) => this.normalizeName(name))
      .filter((name) => name.length > 0);
  }

  private async resolveArtists(artistNames: string[]): Promise<string[]> {
    const artistIds: string[] = [];
    for (const name of artistNames) {
      const id = await this.findOrCreateArtist(name);
      artistIds.push(id);
    }
    return artistIds;
  }

  private async resolveWriters(writerField: string): Promise<string[]> {
    const writerNames = writerField
      .split(/[\r?\n,]+/)
      .map((name) => name.trim())
      .map((name) => this.normalizeName(name))
      .filter(Boolean);

    const writerIds: string[] = [];
    for (const name of writerNames) {
      const id = await this.findOrCreateWriter(name);
      writerIds.push(id);
    }
    return writerIds;
  }

  private async resolveAlbum(
    title: string,
    artistIds: string[],
    year: number,
  ): Promise<AlbumDocument> {
    const albumTitle = title
      .split(/\r?\n/)
      .map((part) => part.trim())
      .join(this.albumTitleSeparator);
    const normalizedTitle = this.normalizeAlbumTitle(albumTitle);
    return this.findOrCreateAlbum(normalizedTitle, year, artistIds);
  }

  private normalizeAlbumTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    return this.albumTitleMap[lowerTitle] || title;
  }

  private normalizeName(name: string): string {
    return name.replace(/\[\w\]/g, '').trim();
  }

  private async findOrCreateEntity<T extends { id: string }>(
    name: string,
    cache: Map<string, string>,
    service: {
      findOneByName: (name: string) => Promise<T>;
      create: (dto: any) => Promise<T>;
    },
    entityName: string,
  ): Promise<string> {
    if (cache.has(name)) {
      return cache.get(name);
    }
    try {
      const entity = await service.findOneByName(name);
      cache.set(name, entity.id);
      return entity.id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.debug(
          `${entityName} not found. Creating new ${entityName}: ${name}`,
        );
        const newEntity = await service.create({ name });
        cache.set(name, newEntity.id);
        return newEntity.id;
      }
      this.logger.error(
        `Error finding or creating ${entityName} "${name}": ${error.message}`,
        error.stack,
      );
      // Optionally rethrow to be handled by subscriber
      // throw error;
    }
  }

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

  private async findOrCreateAlbum(
    title: string,
    year: number,
    artistIds: string[],
  ): Promise<AlbumDocument> {
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
      // Optionally rethrow to be handled by subscriber
      // throw error;
    }
  }

  private async findOrCreateSong(data: {
    songTitle: string;
    mainArtistIds: string[];
    featuringArtistIds: string[];
    writerIds: string[];
    album: AlbumDocument;
    year: number;
    plays: IPlay[];
  }): Promise<string> {
    const {
      songTitle,
      mainArtistIds: artistIds,
      featuringArtistIds,
      writerIds,
      album,
      year,
      plays,
    } = data;
    try {
      const existingSong = await this.songsService.findOneByTitleArtistsAndYear(
        songTitle,
        artistIds,
        year,
      );
      this.logger.debug(
        `Found existing song: "${songTitle}" [ID: ${existingSong.id}]`,
      );
      return existingSong.id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.debug(`Song not found. Creating new song: "${songTitle}"`);
        const createSongDto: CreateSongDto = {
          title: songTitle,
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
        `Error finding or creating song "${songTitle}": ${error.message}`,
        error.stack,
      );
      // Optionally rethrow to be handled by subscriber
      // throw error;
    }
  }

  private extractPlays(record: ICsvRecord): IPlay[] {
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

  private async addSongToAlbum(
    album: AlbumDocument,
    songId: string,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(songId)) {
      this.logger.error(`Invalid song ID: "${songId}"`);
      throw new BadRequestException('Invalid song ID.');
    }

    const songObjectId = new Types.ObjectId(songId);

    // Check if the song already exists using .some() and .equals()
    const songExists = album.songIds.some((id) => id.equals(songObjectId));
    if (songExists) {
      this.logger.debug(
        `Song ID "${songId}" already exists in album "${album.title}". Skipping.`,
      );
      return;
    }

    // Add the song to the album's songs array
    album.songIds.push(songObjectId);

    try {
      // Save the updated album document
      await album.save();

      this.logger.debug(
        `Added song ID "${songId}" to album "${album.title}" [ID: ${album.id}]`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to add song ID "${songId}" to album "${album.title}" [ID: ${album.id}]: ${error.message}`,
        error.stack,
      );
      throw new Error('Failed to add song to album.');
    }
  }

  private logRecordDetails(data: ILogRecord): void {
    const {
      album,
      songTitle,
      mainArtistIds,
      featuringArtistIds,
      writerIds,
      albumTitle,
      year,
      plays,
    } = data;

    this.logger.log('--- Record Details ---');
    this.logger.log(`Album Title: ${albumTitle}`);
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
