import { Injectable } from '@nestjs/common';

import { DATABASE } from '../../config';
import { ESortOrder } from '../../types';
import { CreateSongDto, UpdateSongDto } from './dto';
import { SongsRepository } from './songs.repository';

@Injectable()
export class SongsService {
  private populateFields = [
    DATABASE.mongodb.collections.populates.artists,
    DATABASE.mongodb.collections.populates.featuringArtists,
    DATABASE.mongodb.collections.populates.writers,
    DATABASE.mongodb.collections.populates.albums,
  ];

  constructor(private readonly songsRepository: SongsRepository) {}

  /**
   * Creates a new song.
   *
   * @param createSongDto The create song DTO.
   *
   * @returns A promise that resolves to the document for the newly created song.
   */
  async create(createSongDto: CreateSongDto) {
    return this.songsRepository.create(createSongDto);
  }

  /**
   * Finds all songs.
   *
   * @returns A promise that resolves to the documents for all songs.
   */
  async findAll() {
    return this.songsRepository.find({}, {}, { populate: this.populateFields });
  }

  /**
   * Finds songs paginated.
   *
   * @param page The page to retrieve.
   * @param limit The number of items per page.
   * @param sort The sort order.
   * @param field The field to sort by.
   * @param search The search query.
   *
   * @returns A promise that resolves to the paginated result.
   */
  findPaginated(
    page: number,
    limit: number,
    sort: ESortOrder,
    field: string,
    search?: string,
  ) {
    const filter = search ? { title: { $regex: search, $options: 'i' } } : {};
    return this.songsRepository.findPaginated(
      filter,
      {},
      { populate: this.populateFields },
      page,
      limit,
      sort,
      field,
    );
  }

  /**
   * Finds songs by year, paginated.
   *
   * @param year The year to filter by.
   * @param page The page to retrieve.
   * @param limit The number of items per page.
   * @param sort The sort order.
   * @param field The field to sort by.
   * @param search The search query.
   *
   * @returns A promise that resolves to the paginated result.
   */
  async findByYear(
    year: number,
    page: number,
    limit: number,
    sort: ESortOrder,
    field: string,
    search?: string,
  ) {
    const filter = search ? { title: { $regex: search, $options: 'i' } } : {};
    return this.songsRepository.findPaginated(
      { year, ...filter },
      {},
      { populate: this.populateFields },
      page,
      limit,
      sort,
      field,
    );
  }

  /**
   * Finds songs by album ID, paginated.
   *
   * @param albumId The ID of the album to filter by.
   * @param page The page to retrieve.
   * @param limit The number of items per page.
   * @param sort The sort order.
   * @param field The field to sort by.
   * @param search The search query.
   *
   * @returns A promise that resolves to the paginated result.
   */
  async findByAlbumId(
    albumId: string,
    page: number,
    limit: number,
    sort: ESortOrder,
    field: string,
    search?: string,
  ) {
    const filter = search ? { title: { $regex: search, $options: 'i' } } : {};
    return this.songsRepository.findPaginated(
      { albumIds: albumId, ...filter },
      {},
      { populate: this.populateFields },
      page,
      limit,
      sort,
      field,
    );
  }

  /**
   * Finds the most popular songs, paginated.
   *
   * @param date The month to filter by.
   * @param page The page to retrieve.
   * @param limit The number of items per page.
   * @param sort The sort order.
   * @param field The field to sort by.
   * @param search The search query.
   *
   * @returns A promise that resolves to the paginated result.
   */
  async findMostPopular(
    date: Date,
    page: number,
    limit: number,
    sort: ESortOrder = ESortOrder.DESC,
    field: string = 'totalPlays',
    search?: string,
  ) {
    const filter = search ? { title: { $regex: search, $options: 'i' } } : {};
    return this.songsRepository.findMostPopular(
      { ...filter },
      {},
      { populate: this.populateFields },
      date,
      page,
      limit,
      sort,
      field,
    );
  }

  /**
   * Finds one song by ID.
   *
   * @param id The ID of the song to find.
   *
   * @returns A promise that resolves to the found song.
   */
  async findOne(id: string) {
    return this.songsRepository.findOne(
      { _id: id },
      {},
      { populate: this.populateFields },
    );
  }

  /**
   * Finds one song by title, artists, and year.
   *
   * @param title The title of the song to find.
   * @param artistIds The IDs of the artists on the song to find.
   * @param year The year the song to find was released.
   *
   * @returns A promise that resolves to the found song.
   */
  async findOneByTitleArtistsAndYear(
    title: string,
    artistIds: string[],
    year: number,
  ) {
    return this.songsRepository.findOne({ title, artistIds, year }, {}, {});
  }

  /**
   * Updates a song by ID.
   *
   * @param id The ID of the song to update.
   * @param updateSongDto The data to update the song with.
   *
   * @returns A promise that resolves to the updated song.
   */
  async update(id: string, updateSongDto: UpdateSongDto) {
    return this.songsRepository.findOneAndUpdate({ _id: id }, updateSongDto);
  }

  /**
   * Removes a song by ID.
   *
   * @param id The ID of the song to remove.
   *
   * @returns A promise that resolves to the removed song.
   */
  async remove(id: string) {
    return this.songsRepository.findOneAndDelete({ _id: id });
  }
}
