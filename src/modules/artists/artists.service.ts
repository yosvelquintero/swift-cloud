import { Injectable } from '@nestjs/common';

import { ESortOrder } from '../../types';
import { ArtistsRepository } from './artists.repository';
import { CreateArtistDto, UpdateArtistDto } from './dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly artistsRepository: ArtistsRepository) {}

  /**
   * Creates a new artist.
   *
   * @param createArtistDto The creation DTO.
   *
   * @returns A promise that resolves to the created artist.
   */
  create(createArtistDto: CreateArtistDto) {
    return this.artistsRepository.create(createArtistDto);
  }

  /**
   * Finds all artists.
   *
   * @returns A promise that resolves to the array of found artists.
   */
  findAll() {
    return this.artistsRepository.find({});
  }

  /**
   * Finds artists paginated.
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
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
    return this.artistsRepository.findPaginated(
      { ...filter },
      {},
      {},
      page,
      limit,
      sort,
      field,
    );
  }

  /**
   * Finds one artist by ID.
   *
   * @param id The ID of the artist to find.
   *
   * @returns A promise that resolves to the found artist.
   */
  findOne(id: string) {
    return this.artistsRepository.findOne({ _id: id });
  }

  /**
   * Finds one artist by name.
   *
   * @param name The name of the artist to find.
   *
   * @returns A promise that resolves to the found artist.
   */
  async findOneByName(name: string) {
    return this.artistsRepository.findOne({ name });
  }

  /**
   * Updates an artist by ID.
   *
   * @param id The ID of the artist to update.
   * @param updateArtistDto The data to update the artist with.
   *
   * @returns A promise that resolves to the updated artist.
   */
  update(id: string, updateArtistDto: UpdateArtistDto) {
    return this.artistsRepository.findOneAndUpdate(
      { _id: id },
      updateArtistDto,
    );
  }

  /**
   * Removes an artist by ID.
   *
   * @param id The ID of the artist to remove.
   *
   * @returns A promise that resolves to the removed artist.
   */
  remove(id: string) {
    return this.artistsRepository.findOneAndDelete({ _id: id });
  }
}
