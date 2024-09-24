import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { AlbumsService } from '../src/modules/albums/albums.service';
import { CreateAlbumDto, UpdateAlbumDto } from '../src/modules/albums/dto';
import { TAlbumDocument } from '../src/modules/albums/entities/album.entity';

describe('AlbumsController (e2e)', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let albumsService: AlbumsService;
  let createdAlbum: TAlbumDocument;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    albumsService = moduleFixture.get<AlbumsService>(AlbumsService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/api/v1/albums (POST)', async () => {
    const createAlbumDto: CreateAlbumDto = {
      title: 'New Album',
      artistIds: [],
      songIds: [],
      year: 2024,
    };

    const response = await request(app.getHttpServer())
      .post('/albums')
      .send(createAlbumDto)
      .expect(201);

    createdAlbum = response.body;
    expect(createdAlbum).toHaveProperty('_id');
    expect(createdAlbum.title).toBe(createAlbumDto.title);
    expect(createdAlbum.year).toBe(createAlbumDto.year);
  });

  it('/api/v1/albums (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/albums')
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toContainEqual(
      expect.objectContaining({ _id: createdAlbum._id }),
    );
  });

  it('/api/v1/albums/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/albums/${createdAlbum._id}`)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdAlbum._id);
  });

  it('/api/v1/albums/:id (PATCH)', async () => {
    const updateAlbumDto: UpdateAlbumDto = {
      title: 'Updated Album',
    };

    const response = await request(app.getHttpServer())
      .patch(`/albums/${createdAlbum._id}`)
      .send(updateAlbumDto)
      .expect(200);

    expect(response.body).toHaveProperty('_id', createdAlbum._id);
    expect(response.body.title).toBe(updateAlbumDto.title);

    // Update the local reference to match the updated album
    createdAlbum = response.body;
  });

  it('/api/v1/albums/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/albums/${createdAlbum._id}`)
      .expect(200);

    // Verify the album has been deleted
    await request(app.getHttpServer())
      .get(`/albums/${createdAlbum._id}`)
      .expect(404);
  });
});
