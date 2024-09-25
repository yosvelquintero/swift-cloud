import { DeepReadonly } from 'ts-essentials';

import { IEnv } from '../../types';

export const ENV: DeepReadonly<IEnv> = {
  app: {
    api: {
      name: 'APP_API_NAME',
      version: 'APP_API_VERSION',
      host: 'APP_API_HOST',
      port: 'APP_API_PORT',
      prefix: 'APP_API_PREFIX',
      isSwaggerEnabled: 'APP_API_IS_SWAGGER_ENABLED',
      swagger: {
        description: 'APP_API_SWAGGER_DESCRIPTION',
        prefix: 'APP_API_SWAGGER_PREFIX',
      },
    },
  },
  database: {
    mongodb: {
      mongodbUri: 'MONGODB_URI',
    },
  },
};
