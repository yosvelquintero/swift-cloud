import { Injectable } from '@nestjs/common';

import { ESortOrder } from '@app/types';

import { CreateWriterDto, UpdateWriterDto } from './dto';
import { WritersRepository } from './writers.repository';

@Injectable()
export class WritersService {
  constructor(private readonly writersRepository: WritersRepository) {}

  /**
   * Creates a new writer.
   *
   * @param createWriterDto The creation DTO.
   *
   * @returns A promise that resolves to the created writer.
   */
  create(createWriterDto: CreateWriterDto) {
    return this.writersRepository.create(createWriterDto);
  }

  /**
   * Finds all writers.
   *
   * @returns A promise that resolves to the array of found writers.
   */
  findAll() {
    return this.writersRepository.find({});
  }

  /**
   * Finds writers paginated.
   *
   * @param page The page to retrieve.
   * @param limit The number of items per page.
   * @param sort The sort order.
   * @param field The field to sort by.
   *
   * @returns A promise that resolves to the paginated result.
   */
  findPaginated(page: number, limit: number, sort: ESortOrder, field: string) {
    return this.writersRepository.findPaginated(
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
   * Finds one writer by ID.
   *
   * @param id The ID of the writer to find.
   *
   * @returns A promise that resolves to the found writer.
   */
  findOne(id: string) {
    return this.writersRepository.findOne({ _id: id });
  }

  /**
   * Finds one writer by name.
   *
   * @param name The name of the writer to find.
   *
   * @returns A promise that resolves to the found writer.
   */
  async findOneByName(name: string) {
    return this.writersRepository.findOne({ name });
  }

  /**
   * Updates a writer by ID.
   *
   * @param id The ID of the writer to update.
   * @param updateWriterDto The data to update the writer with.
   *
   * @returns A promise that resolves to the updated writer.
   */
  update(id: string, updateWriterDto: UpdateWriterDto) {
    return this.writersRepository.findOneAndUpdate(
      { _id: id },
      updateWriterDto,
    );
  }

  /**
   * Removes a writer by ID.
   *
   * @param id The ID of the writer to remove.
   *
   * @returns A promise that resolves to the removed writer.
   */
  remove(id: string) {
    return this.writersRepository.findOneAndDelete({ _id: id });
  }
}
