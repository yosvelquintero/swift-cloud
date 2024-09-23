import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

import { DATABASE } from '@app/config';
import { Artist } from '@app/modules/artists/entities/artist.entity';
import { Song } from '@app/modules/songs/entities/song.entity';
import { IAlbum } from '@app/types';
import { getMongooseSchemaOptions } from '@app/utils';

export type TAlbumDocument = Album & Document;

@Schema(
  getMongooseSchemaOptions({
    collection: DATABASE.mongodb.collections.names.albums,
  }),
)
export class Album implements IAlbum {
  @Prop({
    required: true,
  })
  title: string;

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
        ref: DATABASE.mongodb.collections.refs.song,
      },
    ],
    default: [],
  })
  @ApiProperty({
    type: () => [Song],
    description: 'Array of songs',
    default: [],
  })
  songIds: Types.ObjectId[];

  @Prop()
  @ApiProperty()
  year: number;

  @Prop()
  @ApiProperty()
  created: Date;

  @Prop()
  @ApiProperty()
  updated: Date;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);

// Add index on the 'title' field
AlbumSchema.index({ title: 1 });

// Add index on the 'artistIds' field
AlbumSchema.index({ artistId: 1 });

// Add index on the 'year' field
AlbumSchema.index({ year: 1 });

// Compound index on the 'title', 'artistIds' and 'year' fields
AlbumSchema.index(
  {
    title: 1,
    artistIds: 1,
    year: 1,
  },
  { unique: true },
);

// Add unique validation
AlbumSchema.plugin(uniqueValidator);

// Configure virtuals
AlbumSchema.virtual(DATABASE.mongodb.collections.populates.artists, {
  ref: DATABASE.mongodb.collections.refs.artist,
  localField: DATABASE.mongodb.collections.localFields.artistIds,
  foreignField: '_id',
});

AlbumSchema.virtual(DATABASE.mongodb.collections.populates.songs, {
  ref: DATABASE.mongodb.collections.refs.song,
  localField: DATABASE.mongodb.collections.localFields.songIds,
  foreignField: '_id',
});

AlbumSchema.set('toObject', { virtuals: true });
AlbumSchema.set('toJSON', { virtuals: true });
