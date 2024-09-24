import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { DATABASE } from '@app/config';
import { IArtist } from '@app/types';
import { getMongooseSchemaOptions } from '@app/utils';

export type TArtistDocument = Artist & Document;

@Schema(
  getMongooseSchemaOptions({
    collection: DATABASE.mongodb.collections.names.artists,
  }),
)
export class Artist implements IArtist {
  @Prop({
    unique: true,
    required: false,
  })
  @ApiProperty({
    description: 'The artist ID',
    required: false,
  })
  id?: string;

  @Prop({
    required: true,
    unique: true,
  })
  @ApiProperty({
    description: 'The artist name',
  })
  name: string;

  @Prop()
  @ApiProperty({
    description: 'The artist creation',
  })
  created: Date;

  @Prop()
  @ApiProperty({
    description: 'The artist last update',
  })
  updated: Date;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);

// Add index on the 'name' field
ArtistSchema.index(
  {
    name: 1,
  },
  {
    unique: true,
  },
);

// Add unique validation
ArtistSchema.plugin(uniqueValidator);
