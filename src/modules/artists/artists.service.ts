import { Injectable } from '@nestjs/common';

import { ESortOrder } from '@app/types';

import { ArtistsRepository } from './artists.repository';
import { CreateArtistDto, UpdateArtistDto } from './dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly artistsRepository: ArtistsRepository) {}

  create(createArtistDto: CreateArtistDto) {
    return this.artistsRepository.create(createArtistDto);
  }

  findAll() {
    return this.artistsRepository.find({});
  }

  findPaginated(page: number, limit: number, sort: ESortOrder, field: string) {
    return this.artistsRepository.findPaginated(
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
    return this.artistsRepository.findOne({ _id: id });
  }

  async findOneByName(name: string) {
    return this.artistsRepository.findOne({ name });
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    return this.artistsRepository.findOneAndUpdate(
      { _id: id },
      updateArtistDto,
    );
  }

  remove(id: string) {
    return this.artistsRepository.findOneAndDelete({ _id: id });
  }
}
