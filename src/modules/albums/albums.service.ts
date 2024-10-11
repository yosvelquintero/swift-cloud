import { Injectable } from '@nestjs/common';

import { DATABASE } from '@app/config';
import { ESortOrder, IPaginationResponse } from '@app/types';

import { AlbumsRepository } from './albums.repository';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { TAlbumDocument } from './entities/album.entity';

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
  create(createAlbumDto: CreateAlbumDto): Promise<TAlbumDocument> {
    return this.albumsRepository.create(createAlbumDto);
  }

  /**
   * Finds all albums.
   *
   * @returns A promise that resolves to the documents for all albums.
   */
  findAll(): Promise<TAlbumDocument[]> {
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
  ): Promise<IPaginationResponse<TAlbumDocument>> {
    const filter = search ? { title: { $regex: search, $options: 'i' } } : {};
    return this.albumsRepository.findPaginated(
      { ...filter },
      {},
      { populate: this.populateFields },
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
  findOne(id: string): Promise<TAlbumDocument> {
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
  ): Promise<TAlbumDocument> {
    return this.albumsRepository.findOne({ title, artistIds, year }, {}, {});
  }

  /**
   * Updates an album by ID.
   *
   * @param id The ID of the album to update.
   * @param updateAlbumDto The data to update the album with.
   *
   * @returns A promise that resolves to the updated album.
   */
  update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<TAlbumDocument> {
    return this.albumsRepository.findOneAndUpdate({ _id: id }, updateAlbumDto);
  }

  /**
   * Removes an album by ID.
   *
   * @param id The ID of the album to remove.
   *
   * @returns A promise that resolves to the removed album.
   */
  remove(id: string): Promise<TAlbumDocument> {
    return this.albumsRepository.findOneAndDelete({ _id: id });
  }
}
