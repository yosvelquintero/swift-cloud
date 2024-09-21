import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { DATABASE } from '@app/config';
import { IArtist } from '@app/types';
import { getMongooseSchemaOptions } from '@app/utils';

export type ArtistDocument = Artist & Document;

@Schema(
  getMongooseSchemaOptions({
    collection: DATABASE.mongodb.collections.names.artists,
  }),
)
export class Artist implements IArtist {
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

export const ArtistSchema = SchemaFactory.createForClass(Artist);

// Add index on the 'name' field
ArtistSchema.index({ name: 1 });

// Add unique validation
ArtistSchema.plugin(uniqueValidator);
