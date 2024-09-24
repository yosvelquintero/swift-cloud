import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { DATABASE } from '../../../config';
import { IWriter } from '../../../types';
import { getMongooseSchemaOptions } from '../../../utils';

export type TWriterDocument = Writer & Document;

@Schema(
  getMongooseSchemaOptions({
    collection: DATABASE.mongodb.collections.names.writers,
  }),
)
export class Writer implements IWriter {
  @Prop({
    unique: true,
    required: false,
  })
  @ApiProperty({
    description: 'The writer ID',
    required: false,
  })
  id?: string;

  @Prop({
    required: true,
    unique: true,
  })
  @ApiProperty({
    description: 'The writer name',
  })
  name: string;

  @Prop()
  @ApiProperty({
    description: 'The writer creation',
  })
  created: Date;

  @Prop()
  @ApiProperty({
    description: 'The writer last update',
  })
  updated: Date;
}

export const WriterSchema = SchemaFactory.createForClass(Writer);

// Add index on the 'name' field
WriterSchema.index(
  {
    name: 1,
  },
  {
    unique: true,
  },
);

// Add unique validation
WriterSchema.plugin(uniqueValidator);
