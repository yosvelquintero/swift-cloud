import { SchemaOptions } from '@nestjs/mongoose';

import { IGetMongooseSchemaOptionsParams } from '@app/types';

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
