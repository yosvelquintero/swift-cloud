import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityRepository } from '@app/entity.repository';

import { Writer, WriterDocument } from './entities/writer.entity';

@Injectable()
export class WritersRepository extends EntityRepository<WriterDocument> {
  constructor(@InjectModel(Writer.name) writerModel: Model<WriterDocument>) {
    super(writerModel);
  }
}
