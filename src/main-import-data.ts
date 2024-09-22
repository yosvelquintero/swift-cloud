import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ImportService } from './modules/imports/imports.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const importService = app.get(ImportService);
  const logger = new Logger('ImportData');

  const filePath = process.argv[2];
  if (!filePath) {
    logger.error('Please provide the CSV file path as an argument.');
    process.exit(1);
  }

  await importService.importFromCsv(filePath);

  await app.close();
}

bootstrap();
