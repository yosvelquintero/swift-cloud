import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ImportService } from './modules/imports/imports.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const importService = app.get(ImportService);

  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Please provide the CSV file path as an argument.');
    process.exit(1);
  }

  await importService.importFromCsv(filePath);

  await app.close();
}

bootstrap();
