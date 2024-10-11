import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityRepository } from '@app/entity.repository';

import { Artist, TArtistDocument } from './entities/artist.entity';

@Injectable()
export class ArtistsRepository extends EntityRepository<TArtistDocument> {
  constructor(@InjectModel(Artist.name) artistModel: Model<TArtistDocument>) {
    super(artistModel);
  }
}
