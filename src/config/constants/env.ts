import { DeepReadonly } from 'ts-essentials';

import { IEnv } from '@app/types';

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
      mongodbHost: 'MONGODB_HOST',
      mongodbDb: 'MONGODB_DB',
      mongodbUser: 'MONGODB_USER',
      mongodbPort: 'MONGODB_PORT',
      mongodbPassword: 'MONGODB_PASSWORD',
      mongodbUri: 'MONGODB_URI',
    },
  },
};
