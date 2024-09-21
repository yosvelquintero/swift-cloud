import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { DATABASE } from '@app/config';
import { Album } from '@app/modules/albums/entities/album.entity';
import { Artist } from '@app/modules/artists/entities/artist.entity';
import { Writer } from '@app/modules/writers/entities/writer.entity';
import { ISong } from '@app/types';
import { getMongooseSchemaOptions } from '@app/utils';

export type SongDocument = Song & Document;

@Schema()
export class Play {
  @Prop({ required: true })
  @ApiProperty()
  month: Date;

  @Prop({ required: true })
  @ApiProperty()
  count: number;
}

const PlaySchema = SchemaFactory.createForClass(Play);

@Schema(
  getMongooseSchemaOptions({
    collection: DATABASE.mongodb.collections.names.songs,
  }),
)
export class Song implements ISong {
  @Prop({ required: true })
  @ApiProperty()
  title: string;

  @Prop({
    type: [Types.ObjectId],
    ref: DATABASE.mongodb.collections.refs.artist,
    default: [],
  })
  @ApiProperty({
    type: () => [Artist],
    description: 'Array of artists',
    default: [],
  })
  artists: Types.ObjectId[];

  @Prop({
    type: [Types.ObjectId],
    ref: DATABASE.mongodb.collections.refs.writer,
    default: [],
  })
  @ApiProperty({
    type: () => [Writer],
    description: 'Array of writers',
    default: [],
  })
  writers: Types.ObjectId[];

  @Prop({
    type: [Types.ObjectId],
    ref: DATABASE.mongodb.collections.refs.album,
    default: [],
  })
  @ApiProperty({
    type: () => [Album],
    description: 'Array of albums',
    default: [],
  })
  albums: Types.ObjectId[];

  @Prop()
  @ApiProperty()
  year: number;

  @Prop({
    type: () => [PlaySchema],
    default: [],
  })
  @ApiProperty({
    type: () => [Play],
    description: 'Array of albums',
    default: [],
  })
  plays: Play[];

  @Prop()
  @ApiProperty()
  created: Date;

  @Prop()
  @ApiProperty()
  updated: Date;
}

export const SongSchema = SchemaFactory.createForClass(Song);

// Add index on the 'year' field
SongSchema.index({ year: 1 });

// Add index on the 'artists' field
SongSchema.index({ albums: 1 });

// Add index on the 'plays.month' field
SongSchema.index({ 'plays.month': 1 });

// Compound index on the 'title', 'artists', and 'year' fields
SongSchema.index(
  {
    title: 1,
    artists: 1,
    year: 1,
  },
  { unique: true },
);

// Add unique validation
SongSchema.plugin(uniqueValidator);
