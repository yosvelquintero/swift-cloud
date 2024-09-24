import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { CreateWriterDto, UpdateWriterDto } from '../src/modules/writers/dto';
import { TWriterDocument } from '../src/modules/writers/entities/writer.entity';
import { WritersService } from '../src/modules/writers/writers.service';

describe('WritersController (e2e)', () => {
  let app: INestApplication;
  let createdWriter: TWriterDocument;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let writersService: WritersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    writersService = moduleFixture.get<WritersService>(WritersService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/writers (POST)', async () => {
    const createWriterDto: CreateWriterDto = {
      name: 'John Doe',
    };

    const response = await request(app.getHttpServer())
      .post('/writers')
      .send(createWriterDto)
      .expect(201);

    createdWriter = response.body;
    expect(createdWriter).toHaveProperty('_id');
    expect(createdWriter.name).toBe(createWriterDto.name);
  });

  it('/api/v1/writers (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/writers')
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toContainEqual(
      expect.objectContaining({ _id: createdWriter._id }),
    );
  });

  it('/api/v1/writers/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/writers/${createdWriter._id}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdWriter._id);
  });

  it('/api/v1/writers/:id (PATCH)', async () => {
    const updateWriterDto: UpdateWriterDto = {
      name: 'Jane Doe',
    };

    const response = await request(app.getHttpServer())
      .patch(`/writers/${createdWriter._id}`)
      .send(updateWriterDto)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdWriter._id);
    expect(response.body.name).toBe(updateWriterDto.name);

    // Update the local reference to match the updated name
    createdWriter = response.body;
  });

  it('/api/v1/writers/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/writers/${createdWriter._id}`)
      .expect(200);

    // Verify the writer has been deleted
    await request(app.getHttpServer())
      .get(`/writers/${createdWriter._id}`)
      .expect(404);
  });
});
