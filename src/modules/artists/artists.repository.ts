import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityRepository } from '@app/entity.repository';

import { Artist, ArtistDocument } from './entities/artist.entity';

@Injectable()
export class ArtistsRepository extends EntityRepository<ArtistDocument> {
  constructor(@InjectModel(Artist.name) artistModel: Model<ArtistDocument>) {
    super(artistModel);
  }
}
