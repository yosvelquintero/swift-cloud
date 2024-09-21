import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityRepository } from '@app/entity.repository';

import { Album, AlbumDocument } from './entities/album.entity';

@Injectable()
export class AlbumsRepository extends EntityRepository<AlbumDocument> {
  constructor(@InjectModel(Album.name) albumModel: Model<AlbumDocument>) {
    super(albumModel);
  }
}
