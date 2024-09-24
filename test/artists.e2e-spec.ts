import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { ArtistsService } from '../src/modules/artists/artists.service';
import { CreateArtistDto, UpdateArtistDto } from '../src/modules/artists/dto';
import { TArtistDocument } from '../src/modules/artists/entities/artist.entity';

describe('ArtistsController (e2e)', () => {
  let app: INestApplication;
  let createdArtist: TArtistDocument;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let artistsService: ArtistsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    artistsService = moduleFixture.get<ArtistsService>(ArtistsService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/artists (POST)', async () => {
    const createArtistDto: CreateArtistDto = {
      name: 'John Doe',
    };

    const response = await request(app.getHttpServer())
      .post('/artists')
      .send(createArtistDto)
      .expect(201);

    createdArtist = response.body;
    expect(createdArtist).toHaveProperty('_id');
    expect(createdArtist.name).toBe(createArtistDto.name);
  });

  it('/api/v1/artists (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/artists')
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toContainEqual(
      expect.objectContaining({ _id: createdArtist._id }),
    );
  });

  it('/api/v1/artists/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/artists/${createdArtist._id}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdArtist._id);
  });

  it('/api/v1/artists/:id (PATCH)', async () => {
    const updateArtistDto: UpdateArtistDto = {
      name: 'Jane Doe',
    };

    const response = await request(app.getHttpServer())
      .patch(`/artists/${createdArtist._id}`)
      .send(updateArtistDto)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdArtist._id);
    expect(response.body.name).toBe(updateArtistDto.name);

    // Update the local reference to match the updated name
    createdArtist = response.body;
  });

  it('/api/v1/artists/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/artists/${createdArtist._id}`)
      .expect(200);

    // Verify the artist has been deleted
    await request(app.getHttpServer())
      .get(`/artists/${createdArtist._id}`)
      .expect(404);
  });
});
