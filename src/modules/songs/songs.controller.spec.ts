import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationResponse } from '../../types';
import {
  CreateSongDto,
  ParamSongDto,
  QuerySongDto,
  SongDto,
  UpdateSongDto,
} from './dto';
import { Song, TSongDocument } from './entities/song.entity';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';

describe('SongsController', () => {
  let controller: SongsController;
  let service: SongsService;

  const mockSongsService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findPaginated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [{ provide: SongsService, useValue: mockSongsService }],
    }).compile();

    controller = module.get<SongsController>(SongsController);
    service = module.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an song', async () => {
    const createSongDto: CreateSongDto = {
      title: 'Test Song',
      albumIds: [],
      artistIds: [],
      featuringArtistIds: [],
      writerIds: [],
      year: 2023,
      plays: [],
    };
    const song = new Song();
    jest.spyOn(service, 'create').mockResolvedValue(song as TSongDocument);

    expect(await controller.create(createSongDto)).toBe(song);
    expect(service.create).toHaveBeenCalledWith(createSongDto);
  });

  it('should retrieve paginated songs', async () => {
    const querySongDto: QuerySongDto = { page: 1, limit: 10 };
    const songs = [new Song(), new Song()];
    const paginationResponse: IPaginationResponse<Song> = {
      data: songs,
      total: 2,
      totalPages: 1,
      page: 1,
      limit: 10,
    };
    jest
      .spyOn(service, 'findPaginated')
      .mockResolvedValue(paginationResponse as SongDto);

    expect(await controller.findPaginated(querySongDto)).toBe(
      paginationResponse,
    );
    expect(service.findPaginated).toHaveBeenCalledWith(
      1,
      10,
      undefined,
      undefined,
      undefined,
    );
  });

  it('should find one song by ID', async () => {
    const song = new Song();
    const paramData: ParamSongDto = { id: '66f1b0a1359ff86714665c14' };
    jest.spyOn(service, 'findOne').mockResolvedValue(song as TSongDocument);

    expect(await controller.findOne(paramData)).toBe(song);
    expect(service.findOne).toHaveBeenCalledWith(paramData.id);
  });

  it('should update an song', async () => {
    const updateSongDto: UpdateSongDto = { title: 'Updated Song' };
    const paramData: ParamSongDto = { id: '66f1b0a1359ff86714665c14' };
    const updatedSong = new Song();
    jest
      .spyOn(service, 'update')
      .mockResolvedValue(updatedSong as TSongDocument);

    expect(await controller.update(paramData, updateSongDto)).toBe(updatedSong);
    expect(service.update).toHaveBeenCalledWith(paramData.id, updateSongDto);
  });

  it('should remove an song', async () => {
    const paramData: ParamSongDto = { id: '66f1b0a1359ff86714665c14' };
    const removedSong = new Song();
    jest
      .spyOn(service, 'remove')
      .mockResolvedValue(removedSong as TSongDocument);

    expect(await controller.remove(paramData)).toBe(removedSong);
    expect(service.remove).toHaveBeenCalledWith(paramData.id);
  });
});
