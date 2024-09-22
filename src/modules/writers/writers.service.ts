import { Injectable } from '@nestjs/common';

import { ESortOrder } from '@app/types';

import { CreateWriterDto, UpdateWriterDto } from './dto';
import { WritersRepository } from './writers.repository';

@Injectable()
export class WritersService {
  constructor(private readonly writersRepository: WritersRepository) {}

  create(createWriterDto: CreateWriterDto) {
    return this.writersRepository.create(createWriterDto);
  }

  findAll() {
    return this.writersRepository.find({});
  }

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

  findOne(id: string) {
    return this.writersRepository.findOne({ _id: id });
  }

  async findOneByName(name: string) {
    return this.writersRepository.findOne({ name });
  }

  update(id: string, updateWriterDto: UpdateWriterDto) {
    return this.writersRepository.findOneAndUpdate(
      { _id: id },
      updateWriterDto,
    );
  }

  remove(id: string) {
    return this.writersRepository.findOneAndDelete({ _id: id });
  }
}
