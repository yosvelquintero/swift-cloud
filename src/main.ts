import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ENV, settingsConfig, swaggerConfig } from './config';
import { TEnvAppApi } from './types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const api: TEnvAppApi = {
    name: configService.get<string>(ENV.app.api.name),
    version: configService.get<string>(ENV.app.api.version),
    host: configService.get<string>(ENV.app.api.host),
    port: configService.get<string>(ENV.app.api.port),
    prefix: configService.get<string>(ENV.app.api.prefix),
    isSwaggerEnabled: configService.get<string>(ENV.app.api.isSwaggerEnabled),
    swagger: {
      description: configService.get<string>(ENV.app.api.swagger.description),
      prefix: configService.get<string>(ENV.app.api.swagger.prefix),
    },
  };
  const logger = new Logger(api.name);
  const isSwaggerEnabled = api.isSwaggerEnabled === 'true';

  settingsConfig(app, api.prefix);

  if (isSwaggerEnabled) {
    swaggerConfig(app, api);
  }

  await app.listen(api.port, () => {
    const apiUrl = `${api.host}:${api.port}${api.prefix}`;
    const swaggerUrl = `${api.host}:${api.port}${api.swagger.prefix}`;

    if (isSwaggerEnabled) {
      logger.log(`Swagger API documentation: ${swaggerUrl}`);
    }

    logger.log(`Application running at: ${apiUrl}`);
  });
}
bootstrap();
