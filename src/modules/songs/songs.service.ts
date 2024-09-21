import { Injectable } from '@nestjs/common';

import { DATABASE } from '@app/config';
import { ESortOrder } from '@app/types';

import { CreateSongDto, UpdateSongDto } from './dto';
import { SongsRepository } from './songs.repository';

@Injectable()
export class SongsService {
  private populateFields = [
    DATABASE.mongodb.collections.populates.artists,
    DATABASE.mongodb.collections.populates.writers,
    DATABASE.mongodb.collections.populates.albums,
  ];

  constructor(private readonly songsRepository: SongsRepository) {}

  async create(createSongDto: CreateSongDto) {
    return this.songsRepository.create(createSongDto);
  }

  async findAll() {
    return this.songsRepository.find({}, {}, { populate: this.populateFields });
  }

  findPaginated(page: number, limit: number, sort: ESortOrder) {
    return this.songsRepository.findPaginated({}, {}, {}, page, limit, sort);
  }

  async findOne(id: string) {
    return this.songsRepository.findOne(
      { _id: id },
      {},
      { populate: this.populateFields },
    );
  }

  async findByYear(year: number) {
    return this.songsRepository.findByYear(year, {
      populate: this.populateFields,
    });
  }

  async findByAlbum(albumId: string) {
    return this.songsRepository.findByAlbum(albumId, {
      populate: this.populateFields,
    });
  }

  async findMostPopularSongs(monthStr: string, limit?: number) {
    const month = new Date(monthStr);
    return this.songsRepository.findMostPopularSongs(month, limit);
  }

  async update(id: string, updateSongDto: UpdateSongDto) {
    return this.songsRepository.findOneAndUpdate({ _id: id }, updateSongDto);
  }

  async remove(id: string) {
    return this.songsRepository.findOneAndDelete({ _id: id });
  }
}
