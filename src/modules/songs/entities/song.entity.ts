import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { DATABASE } from '../../../config';
import { Album } from '../../../modules/albums/entities/album.entity';
import { Artist } from '../../../modules/artists/entities/artist.entity';
import { Writer } from '../../../modules/writers/entities/writer.entity';
import { ISong } from '../../../types';
import { getMongooseSchemaOptions } from '../../../utils';

export type TSongDocument = Song & Document;

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
  @ApiProperty({
    description: 'The song title',
  })
  title: string;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: DATABASE.mongodb.collections.refs.album,
      },
    ],
    default: [],
  })
  @ApiProperty({
    type: () => [Album],
    description: 'Array of albums',
    default: [],
  })
  albumIds: Types.ObjectId[];

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: DATABASE.mongodb.collections.refs.artist,
      },
    ],
    default: [],
  })
  @ApiProperty({
    type: () => [Artist],
    description: 'Array of artists',
    default: [],
  })
  artistIds: Types.ObjectId[];

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: DATABASE.mongodb.collections.refs.artist,
      },
    ],
    default: [],
  })
  @ApiProperty({
    type: () => [Artist],
    description: 'Array of featuring artists',
    default: [],
  })
  featuringArtistIds: Types.ObjectId[];

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: DATABASE.mongodb.collections.refs.writer,
      },
    ],
    default: [],
  })
  @ApiProperty({
    type: () => [Writer],
    description: 'Array of writers',
    default: [],
  })
  writerIds: Types.ObjectId[];

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
  @ApiProperty({
    description: 'The song creation',
  })
  created: Date;

  @Prop()
  @ApiProperty({
    description: 'The song last update',
  })
  updated: Date;
}

export const SongSchema = SchemaFactory.createForClass(Song);

// Add index on the 'year' field
SongSchema.index({ year: 1 });

// Add index on the 'artists' field
SongSchema.index({ albumIds: 1 });

// Add index on the 'plays.month' field
SongSchema.index({ 'plays.month': 1 });

// Compound index on the 'title' and 'year' fields
SongSchema.index(
  {
    title: 1,
    artistIds: 1,
    year: 1,
  },
  {
    unique: true,
  },
);

// Add unique validation
SongSchema.plugin(uniqueValidator);

// Configure virtuals
SongSchema.virtual(DATABASE.mongodb.collections.populates.albums, {
  ref: DATABASE.mongodb.collections.refs.album,
  localField: DATABASE.mongodb.collections.localFields.albumIds,
  foreignField: '_id',
});

SongSchema.virtual(DATABASE.mongodb.collections.populates.artists, {
  ref: DATABASE.mongodb.collections.refs.artist,
  localField: DATABASE.mongodb.collections.localFields.artistIds,
  foreignField: '_id',
});

SongSchema.virtual(DATABASE.mongodb.collections.populates.featuringArtists, {
  ref: DATABASE.mongodb.collections.refs.artist,
  localField: DATABASE.mongodb.collections.localFields.featuringArtistIds,
  foreignField: '_id',
});

SongSchema.virtual(DATABASE.mongodb.collections.populates.writers, {
  ref: DATABASE.mongodb.collections.refs.writer,
  localField: DATABASE.mongodb.collections.localFields.writerIds,
  foreignField: '_id',
});

SongSchema.set('toObject', { virtuals: true });
SongSchema.set('toJSON', { virtuals: true });
