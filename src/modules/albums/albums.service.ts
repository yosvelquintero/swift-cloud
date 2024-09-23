import { Injectable } from '@nestjs/common';

import { DATABASE } from '@app/config';
import { ESortOrder } from '@app/types';

import { AlbumsRepository } from './albums.repository';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';

@Injectable()
export class AlbumsService {
  private populateFields = [
    DATABASE.mongodb.collections.populates.artists,
    DATABASE.mongodb.collections.populates.songs,
  ];

  constructor(private readonly albumsRepository: AlbumsRepository) {}

  /**
   * Creates a new album.
   *
   * @param createAlbumDto The create album DTO.
   *
   * @returns A promise that resolves to the document for the newly created album.
   */
  create(createAlbumDto: CreateAlbumDto) {
    return this.albumsRepository.create(createAlbumDto);
  }

  /**
   * Finds all albums.
   *
   * @returns A promise that resolves to the documents for all albums.
   */
  findAll() {
    return this.albumsRepository.find(
      {},
      {},
      { populate: this.populateFields },
    );
  }

  /**
   * Finds albums paginated.
   *
   * @param page The page to retrieve.
   * @param limit The number of items per page.
   * @param sort The sort order.
   * @param field The field to sort by.
   *
   * @returns A promise that resolves to the paginated result.
   */
  findPaginated(page: number, limit: number, sort: ESortOrder, field: string) {
    return this.albumsRepository.findPaginated(
      {},
      {},
      {},
      page,
      limit,
      sort,
      field,
    );
  }

  /**
   * Finds one album by ID.
   *
   * @param id The ID of the album to find.
   *
   * @returns A promise that resolves to the found album.
   */
  findOne(id: string) {
    return this.albumsRepository.findOne(
      { _id: id },
      {},
      { populate: this.populateFields },
    );
  }

  /**
   * Finds one album by title, artists, and year.
   *
   * @param title The title of the album to find.
   * @param artistIds The IDs of the artists on the album to find.
   * @param year The year the album to find was released.
   *
   * @returns A promise that resolves to the found album.
   */
  async findOneByTitleArtistsAndYear(
    title: string,
    artistIds: string[],
    year: number,
  ) {
    return this.albumsRepository.findOne(
      { title, artistIds, year },
      {},
      { populate: this.populateFields },
    );
  }

  /**
   * Updates an album by ID.
   *
   * @param id The ID of the album to update.
   * @param updateAlbumDto The data to update the album with.
   *
   * @returns A promise that resolves to the updated album.
   */
  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    return this.albumsRepository.findOneAndUpdate({ _id: id }, updateAlbumDto);
  }

  /**
   * Removes an album by ID.
   *
   * @param id The ID of the album to remove.
   *
   * @returns A promise that resolves to the removed album.
   */
  remove(id: string) {
    return this.albumsRepository.findOneAndDelete({ _id: id });
  }
}
