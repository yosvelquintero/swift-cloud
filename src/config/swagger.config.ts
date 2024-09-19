import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { TEnvAppApi } from '@app/types';

export const swaggerConfig = (app: INestApplication, api: TEnvAppApi): void => {
  const config = new DocumentBuilder()
    .setTitle(api.name)
    .setDescription(api.swagger.description)
    .setVersion(api.version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${api.swagger.prefix}`, app, document);
};
