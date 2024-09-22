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

import { PAGINATION } from './config';
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
      options = { sort: { created: -1 }, ...options };

      const query = this.entityModel.find(filter, projection, options);

      if (options?.populate) {
        options.populate.forEach((field) => {
          query.populate(field);
        });
      }

      this.logger.debug('find -->');
      this.logger.debug(`filter: ${JSON.stringify(filter)}`);
      this.logger.debug(`projection: ${JSON.stringify(projection)}`);
      this.logger.debug(`options: ${JSON.stringify(options)}`);

      return query.exec();
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
    field: string = PAGINATION.field,
  ): Promise<IPaginationResponse<T>> {
    try {
      page = Math.max(1, page);
      limit = Math.max(1, limit);

      const totalPromise = this.entityModel.countDocuments(filter).exec();

      options = { ...options };
      options.sort = options.sort || { [field]: sort === 'ASC' ? 1 : -1 };

      const query = this.entityModel
        .find(filter, projection, options)
        .skip((page - 1) * limit)
        .limit(limit);

      if (options?.populate) {
        options.populate.forEach((field) => {
          query.populate(field);
        });
      }

      const [total, data] = await Promise.all([totalPromise, query.exec()]);

      const totalPages = Math.ceil(total / limit);

      this.logger.debug('findPaginated -->');
      this.logger.debug(
        `Pagination query params: page=${page}, limit=${limit}, sort=${sort}, field=${field}`,
      );
      this.logger.debug(`filter: ${JSON.stringify(filter)}`);
      this.logger.debug(`projection: ${JSON.stringify(projection)}`);
      this.logger.debug(`options: ${JSON.stringify(options)}`);
      this.logger.debug(`total: ${total}`);
      this.logger.debug(`totalPages: ${totalPages}`);

      return { data, total, totalPages, page, limit };
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async findOne(
    filter: FilterQuery<T>,
    projection?: Record<string, any>,
    options?: QueryOptions & { populate?: any },
  ): Promise<T> {
    try {
      options = { ...options };
      const query = this.entityModel.findOne(filter, projection, options);

      if (options?.populate) {
        options.populate.forEach((field) => {
          query.populate(field);
        });
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
    options?: QueryOptions & { populate?: any },
  ): Promise<T> {
    try {
      const query = this.entityModel.findOneAndUpdate(filter, data, {
        new: true,
        runValidators: true,
        context: 'query',
        ...options,
      });

      if (options?.populate) {
        options.populate.forEach((field) => {
          query.populate(field);
        });
      }

      this.logger.debug('findOneAndUpdate -->');
      this.logger.debug(`filter: ${JSON.stringify(filter)}`);
      this.logger.debug(`update: ${JSON.stringify(data)}`);
      this.logger.debug(`options: ${JSON.stringify(options)}`);

      const entity = await query.exec();
      return this.handleNotFound(entity, filter);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  async findOneAndDelete(
    filter: FilterQuery<T>,
    options?: QueryOptions & { populate?: any },
  ): Promise<T> {
    try {
      const query = this.entityModel.findOneAndDelete(filter, options);

      if (options?.populate) {
        options.populate.forEach((field) => {
          query.populate(field);
        });
      }

      this.logger.debug('findOneAndDelete -->');
      this.logger.debug(`filter: ${JSON.stringify(filter)}`);
      this.logger.debug(`options: ${JSON.stringify(options)}`);

      const entity = await query.exec();
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
