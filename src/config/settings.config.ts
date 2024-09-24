import {
  INestApplication,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

import { ValidationErrorFilter } from '../filters';

export const settingsConfig = (app: INestApplication, prefix: string): void => {
  // Security middleware using Helmet
  app.use(helmet());

  // Body Parsing Middleware
  app.use(
    json({
      limit: 2 * 1024 * 1024,
    }),
  );

  // URL Encoding Middleware
  app.use(
    urlencoded({
      limit: 1 * 1024 * 1024,
      extended: true,
    }),
  );

  // Enable Cross-Origin Resource Sharing
  app.enableCors();

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Set Global Prefix for all routes
  app.setGlobalPrefix(prefix, {
    exclude: [
      // Exclude Swagger Routes from Global Prefix
      {
        path: 'swagger',
        method: RequestMethod.ALL,
      },
    ],
  });

  // Global Pipes for validation and transformation
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  // Global Filters for error handling
  app.useGlobalFilters(new ValidationErrorFilter());
};
