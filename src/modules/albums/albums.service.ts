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

  create(createAlbumDto: CreateAlbumDto) {
    return this.albumsRepository.create(createAlbumDto);
  }

  findAll() {
    return this.albumsRepository.find(
      {},
      {},
      { populate: this.populateFields },
    );
  }

  findPaginated(page: number, limit: number, sort: ESortOrder) {
    return this.albumsRepository.findPaginated({}, {}, {}, page, limit, sort);
  }

  findOne(id: string) {
    return this.albumsRepository.findOne(
      { _id: id },
      {},
      { populate: this.populateFields },
    );
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    return this.albumsRepository.findOneAndUpdate({ _id: id }, updateAlbumDto);
  }

  remove(id: string) {
    return this.albumsRepository.findOneAndDelete({ _id: id });
  }
}
