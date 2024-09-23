import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { DATABASE } from '@app/config';
import { IWriter } from '@app/types';
import { getMongooseSchemaOptions } from '@app/utils';

export type TWriterDocument = Writer & Document;

@Schema(
  getMongooseSchemaOptions({
    collection: DATABASE.mongodb.collections.names.writers,
  }),
)
export class Writer implements IWriter {
  @Prop({
    required: true,
    unique: true,
  })
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  created: Date;

  @Prop()
  @ApiProperty()
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
