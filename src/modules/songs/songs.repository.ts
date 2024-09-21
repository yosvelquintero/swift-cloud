import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EntityRepository } from '@app/entity.repository';

import { Song, SongDocument } from './entities/song.entity';

@Injectable()
export class SongsRepository extends EntityRepository<SongDocument> {
  constructor(@InjectModel(Song.name) songModel: Model<SongDocument>) {
    super(songModel);
  }

  async findAll(
    year: number,
    options?: { populate?: string[] },
  ): Promise<SongDocument[]> {
    return this.entityModel.find({ year }, {}, options);
  }

  async findByYear(
    year: number,
    options?: { populate?: string[] },
  ): Promise<SongDocument[]> {
    return this.entityModel.find({ year }, {}, options);
  }

  async findByAlbum(
    albumId: string,
    options?: { populate?: string[] },
  ): Promise<SongDocument[]> {
    return this.entityModel.find({ albums: albumId }, {}, options);
  }

  async findMostPopularSongs(month: Date, limit: number = 10): Promise<any[]> {
    // TODO: Implement the findMostPopularSongs method
    return this.entityModel
      .aggregate([
        // Unwind the plays array to process each play entry
        { $unwind: '$plays' },
        // Match plays that occurred in the specified month
        {
          $match: {
            'plays.month': month,
          },
        },
        // Group by song ID and sum the play counts
        {
          $group: {
            _id: '$_id',
            title: { $first: '$title' },
            totalPlays: { $sum: '$plays.count' },
            artists: { $first: '$artists' },
            writers: { $first: '$writers' },
            albums: { $first: '$albums' },
          },
        },
        // Sort by total plays in descending order
        { $sort: { totalPlays: -1 } },
        // Limit the number of results
        { $limit: limit },
        // Populate the artists
        {
          $lookup: {
            from: 'artists',
            localField: 'artists',
            foreignField: '_id',
            as: 'artists',
          },
        },
        // Populate the writers
        {
          $lookup: {
            from: 'writers',
            localField: 'writers',
            foreignField: '_id',
            as: 'writers',
          },
        },
        // Populate the albums
        {
          $lookup: {
            from: 'albums',
            localField: 'albums',
            foreignField: '_id',
            as: 'albums',
          },
        },
      ])
      .exec();
  }
}
