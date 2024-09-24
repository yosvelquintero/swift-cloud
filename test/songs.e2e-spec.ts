import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { CreateSongDto, UpdateSongDto } from '../src/modules/songs/dto';
import { TSongDocument } from '../src/modules/songs/entities/song.entity';
import { SongsService } from '../src/modules/songs/songs.service';

describe('SongsController (e2e)', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let songsService: SongsService;
  let createdSong: TSongDocument;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    songsService = moduleFixture.get<SongsService>(SongsService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/api/v1/songs (POST)', async () => {
    const createSongDto: CreateSongDto = {
      title: 'New Song',
      albumIds: [new Types.ObjectId() as unknown as string],
      artistIds: [new Types.ObjectId() as unknown as string],
      featuringArtistIds: [new Types.ObjectId() as unknown as string],
      writerIds: [new Types.ObjectId() as unknown as string],
      year: 2024,
      plays: [
        {
          month: new Date('2024-07-01'),
          count: 100,
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/songs')
      .send(createSongDto)
      .expect(201);

    createdSong = response.body;
    expect(createdSong).toHaveProperty('_id');
    expect(createdSong.title).toBe(createSongDto.title);
    expect(createdSong.year).toBe(createSongDto.year);
  });

  it('/api/v1/songs (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/songs')
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toContainEqual(
      expect.objectContaining({ _id: createdSong._id }),
    );
  });

  it('/api/v1/songs/album/:id (GET)', async () => {
    const albumId = createdSong.albumIds[0];

    const response = await request(app.getHttpServer())
      .get(`/songs/album/${albumId}`)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('/api/v1/songs/year/:year (GET)', async () => {
    const year = createdSong.year;

    const response = await request(app.getHttpServer())
      .get(`/songs/year/${year}`)
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toContainEqual(
      expect.objectContaining({ year }),
    );
  });

  // TODO: Fix this test
  // it('/api/v1/songs/most-popular (GET)', async () => {
  //   const date = '2024-07-01';

  //   const response = await request(app.getHttpServer())
  //     .get(`/songs/most-popular?date=${date}`)
  //     .expect(200);

  //   console.log(response.body);
  //   expect(Array.isArray(response.body.data)).toBe(true);
  // });

  it('/api/v1/songs/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/songs/${createdSong._id}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdSong._id);
  });

  it('/api/v1/songs/:id (PATCH)', async () => {
    const updateSongDto: UpdateSongDto = {
      title: 'Updated Song',
    };

    const response = await request(app.getHttpServer())
      .patch(`/songs/${createdSong._id}`)
      .send(updateSongDto)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdSong._id);
    expect(response.body.title).toBe(updateSongDto.title);

    createdSong = response.body;
  });

  it('/api/v1/songs/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/songs/${createdSong._id}`)
      .expect(200);

    // Verify the song has been deleted
    await request(app.getHttpServer())
      .get(`/songs/${createdSong._id}`)
      .expect(404);
  });
});
