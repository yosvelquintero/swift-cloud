import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { DATABASE } from '@app/config';
import { IWriter } from '@app/types';
import { getMongooseSchemaOptions } from '@app/utils';

export type TWriterDocument = Writer & Document;

@ObjectType()
@Schema(
  getMongooseSchemaOptions({
    collection: DATABASE.mongodb.collections.names.writers,
  }),
)
export class Writer implements IWriter {
  @Field(() => ID)
  id: string;

  @Field()
  @Prop({
    required: true,
    unique: true,
  })
  @ApiProperty({
    description: 'The writer name',
  })
  name: string;

  @Field()
  @Prop()
  @ApiProperty({
    description: 'The writer creation',
  })
  created: Date;

  @Field()
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

WriterSchema.set('toObject', { virtuals: true });
WriterSchema.set('toJSON', { virtuals: true });
