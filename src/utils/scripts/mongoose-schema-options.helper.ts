import { SchemaOptions } from '@nestjs/mongoose';

import { IGetMongooseSchemaOptionsParams } from '../../types';

/**
 * Returns Mongoose schema options.
 *
 * @param {IGetMongooseSchemaOptionsParams} params - Params.
 *
 * @returns {SchemaOptions} Mongoose schema options.
 */
export function getMongooseSchemaOptions(
  params: IGetMongooseSchemaOptionsParams,
): SchemaOptions {
  return {
    collection: params.collection,
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated',
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  };
}
