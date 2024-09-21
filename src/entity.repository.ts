import { Logger, NotFoundException } from '@nestjs/common';
import {
  AnyKeys,
  AnyObject,
  Document,
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import { ESortOrder, IPaginationResponse } from './types';

export abstract class EntityRepository<T extends Document> {
  private readonly logger = new Logger(EntityRepository.name);

  constructor(protected readonly entityModel: Model<T>) {}

  async find(
    filter: FilterQuery<T>,
    projection?: Record<string, any>,
    options?: QueryOptions & { populate?: any },
  ): Promise<T[]> {
    try {
      const query = this.entityModel.find(filter, projection, options);

      if (options?.populate) {
        query.populate(options.populate);
      }

      this.logger.debug('find -->');
      this.logger.debug(`filter: ${JSON.stringify(filter)}`);
      this.logger.debug(`projection: ${JSON.stringify(projection)}`);
      this.logger.debug(`options: ${JSON.stringify(options)}`);

      return query.sort({ created: -1 }).exec();
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async findPaginated(
    filter: FilterQuery<T>,
    projection?: Record<string, any>,
    options?: QueryOptions & { populate?: any },
    page: number = 1,
    limit: number = 10,
    sort: ESortOrder = ESortOrder.DESC,
  ): Promise<IPaginationResponse<T>> {
    try {
      const totalPromise = this.entityModel.countDocuments(filter).exec();
      const dataQuery = this.entityModel
        .find(filter, projection, options)
        .sort({ created: sort === 'ASC' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      if (options?.populate) {
        dataQuery.populate(options.populate);
      }

      const [total, data] = await Promise.all([totalPromise, dataQuery.exec()]);

      this.logger.debug('findPaginated -->');
      this.logger.debug(
        `Pagination query params: page=${page}, limit=${limit}, sort=${sort}`,
      );
      this.logger.debug(`filter: ${JSON.stringify(filter)}`);
      this.logger.debug(`projection: ${JSON.stringify(projection)}`);
      this.logger.debug(`options: ${JSON.stringify(options)}`);
      this.logger.debug(`total: ${total}`);

      return { data, total };
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: Record<string, any>,
    options?: QueryOptions & { populate?: string[] },
  ): Promise<T> {
    try {
      const query = this.entityModel.findOne(filter, projection, options);

      if (options?.populate) {
        query.populate(options.populate);
      }

      this.logger.debug('findOne -->');
      this.logger.debug(`filter: ${JSON.stringify(filter)}`);
      this.logger.debug(`projection: ${JSON.stringify(projection)}`);
      this.logger.debug(`options: ${JSON.stringify(options)}`);

      const entity = await query.exec();
      return this.handleNotFound(entity, filter);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async create(data: AnyKeys<T> & AnyObject): Promise<T> {
    try {
      const entity = new this.entityModel(data);

      this.logger.debug('create');
      this.logger.debug(`data: ${JSON.stringify(data)}`);

      return entity.save();
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async findOneAndUpdate(
    filter: FilterQuery<T>,
    data: UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<T> {
    try {
      const entity = await this.entityModel.findOneAndUpdate(filter, data, {
        new: true,
        runValidators: true,
        context: 'query',
        ...options,
      });

      this.logger.debug('findOneAndUpdate -->');
      this.logger.debug(`filter: ${JSON.stringify(filter)}`);
      this.logger.debug(`update: ${JSON.stringify(data)}`);
      this.logger.debug(`options: ${JSON.stringify(options)}`);

      return this.handleNotFound(entity, filter);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async findOneAndDelete(
    filter: FilterQuery<T>,
    options?: QueryOptions,
  ): Promise<T> {
    try {
      const entity = await this.entityModel.findOneAndDelete(filter, options);

      this.logger.debug('findOneAndDelete -->');
      this.logger.debug(`filter: ${JSON.stringify(filter)}`);
      this.logger.debug(`options: ${JSON.stringify(options)}`);

      return this.handleNotFound(entity, filter);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  private handleNotFound(entity: T, filter: FilterQuery<T>): T {
    if (!entity) {
      throw new NotFoundException(
        `record not found matching: ${JSON.stringify(filter)}`,
      );
    }
    return entity;
  }
}
