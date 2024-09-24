import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityRepository } from '../../entity.repository';
import { Album, TAlbumDocument } from './entities/album.entity';

@Injectable()
export class AlbumsRepository extends EntityRepository<TAlbumDocument> {
  constructor(@InjectModel(Album.name) albumModel: Model<TAlbumDocument>) {
    super(albumModel);
  }
}
