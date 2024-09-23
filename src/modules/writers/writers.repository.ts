import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityRepository } from '@app/entity.repository';

import { TWriterDocument, Writer } from './entities/writer.entity';

@Injectable()
export class WritersRepository extends EntityRepository<TWriterDocument> {
  constructor(@InjectModel(Writer.name) writerModel: Model<TWriterDocument>) {
    super(writerModel);
  }
}
