import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';

import { DATABASE } from '@app/config';
import { EntityRepository } from '@app/entity.repository';
import { ESortOrder, IPaginationResponse } from '@app/types';

import { Song, TSongDocument } from './entities/song.entity';

@Injectable()
export class SongsRepository extends EntityRepository<TSongDocument> {
  constructor(@InjectModel(Song.name) songModel: Model<TSongDocument>) {
    super(songModel);
  }

  /**
   * Finds songs by popularity, paginated.
   *
   * @param filter A mongodb filter query.
   * @param projection A mongodb projection query.
   * @param options A mongodb query options object.
   * @param date The date to filter by.
   * @param page The page to retrieve.
   * @param limit The number of items per page.
   * @param sort The sort order.
   * @param field The field to sort by.
   *
   * @returns A promise that resolves to the paginated result.
   */
  async findMostPopular(
    filter: FilterQuery<TSongDocument>,
    projection?: Record<string, any>,
    options?: QueryOptions & { populate?: any },
    date: Date = new Date(),
    page: number = 1,
    limit: number = 10,
    sort: ESortOrder = ESortOrder.DESC,
    field: string = 'totalPlays',
  ): Promise<IPaginationResponse<TSongDocument>> {
    const aggregationPipeline = [
      { $unwind: '$plays' },
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: '$plays.month' }, date.getUTCFullYear()] },
              { $eq: [{ $month: '$plays.month' }, date.getUTCMonth() + 1] },
            ],
          },
          ...filter,
        },
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          totalPlays: { $sum: '$plays.count' },
          albumIds: { $first: '$albumIds' },
          artistIds: { $first: '$artistIds' },
          featuringArtistIds: { $first: '$featuringArtistIds' },
          writerIds: { $first: '$writerIds' },
          plays: { $push: '$plays' },
        },
      },
      {
        $sort: {
          [field]: sort === ESortOrder.ASC ? 1 : -1,
          title: 1,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    // Execute the aggregation pipeline
    let data = await this.entityModel
      .aggregate(aggregationPipeline as any)
      .exec();

    // Manually populate the required fields
    data = await this.entityModel.populate(data, [
      {
        path: DATABASE.mongodb.collections.populates.albums,
        model: DATABASE.mongodb.collections.refs.album,
        as: DATABASE.mongodb.collections.populates.albums,
      },
      {
        path: DATABASE.mongodb.collections.populates.artists,
        model: DATABASE.mongodb.collections.refs.artist,
        as: DATABASE.mongodb.collections.populates.artists,
      },
      {
        path: DATABASE.mongodb.collections.populates.featuringArtists,
        model: DATABASE.mongodb.collections.refs.artist,
        as: DATABASE.mongodb.collections.populates.featuringArtists,
      },
      {
        path: DATABASE.mongodb.collections.populates.writers,
        model: DATABASE.mongodb.collections.refs.writer,
        as: DATABASE.mongodb.collections.populates.writers,
      },
    ] as { path: string; model: string; as: string }[]);

    const total = await this.entityModel.countDocuments(filter).exec();
    const totalPages = Math.ceil(total / limit);

    this.logger.debug('findMostPopular -->');
    this.logger.debug(`filter: ${JSON.stringify(filter)}`);
    this.logger.debug(`projection: ${JSON.stringify(projection)}`);
    this.logger.debug(`options: ${JSON.stringify(options)}`);
    this.logger.debug(`date: ${date}`);
    this.logger.debug(`page: ${page}`);
    this.logger.debug(`limit: ${limit}`);
    this.logger.debug(`sort: ${sort}`);
    this.logger.debug(`field: ${field}`);
    this.logger.debug(`total: ${total}`);
    this.logger.debug(`totalPages: ${totalPages}`);

    return {
      data,
      total,
      totalPages,
      page,
      limit,
    };
  }
}
