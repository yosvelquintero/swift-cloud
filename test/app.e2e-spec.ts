import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/ (GET) should return 404', () => {
    return request(app.getHttpServer())
      .get('/') // Assuming the root route doesn't exist
      .expect(404)
      .expect({
        statusCode: 404,
        message: 'Cannot GET /',
        error: 'Not Found',
      });
  });
});
