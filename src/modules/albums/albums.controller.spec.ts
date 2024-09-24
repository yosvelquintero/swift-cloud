import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationResponse } from '../../types';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import {
  AlbumDto,
  CreateAlbumDto,
  ParamAlbumDto,
  QueryAlbumDto,
  UpdateAlbumDto,
} from './dto';
import { Album, TAlbumDocument } from './entities/album.entity';

describe('AlbumsController', () => {
  let controller: AlbumsController;
  let service: AlbumsService;

  const mockAlbumsService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findPaginated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumsController],
      providers: [{ provide: AlbumsService, useValue: mockAlbumsService }],
    }).compile();

    controller = module.get<AlbumsController>(AlbumsController);
    service = module.get<AlbumsService>(AlbumsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an album', async () => {
    const createAlbumDto: CreateAlbumDto = {
      title: 'Test Album',
      artistIds: [],
      songIds: [],
      year: 2023,
    };
    const album = new Album();
    jest.spyOn(service, 'create').mockResolvedValue(album as TAlbumDocument);

    expect(await controller.create(createAlbumDto)).toBe(album);
    expect(service.create).toHaveBeenCalledWith(createAlbumDto);
  });

  it('should retrieve paginated albums', async () => {
    const queryAlbumDto: QueryAlbumDto = { page: 1, limit: 10 };
    const albums = [new Album(), new Album()];
    const paginationResponse: IPaginationResponse<Album> = {
      data: albums,
      total: 2,
      totalPages: 1,
      page: 1,
      limit: 10,
    };
    jest
      .spyOn(service, 'findPaginated')
      .mockResolvedValue(paginationResponse as AlbumDto);

    expect(await controller.findPaginated(queryAlbumDto)).toBe(
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

  it('should find one album by ID', async () => {
    const album = new Album();
    const paramData: ParamAlbumDto = { id: '66f1b0a1359ff86714665c14' };
    jest.spyOn(service, 'findOne').mockResolvedValue(album as TAlbumDocument);

    expect(await controller.findOne(paramData)).toBe(album);
    expect(service.findOne).toHaveBeenCalledWith(paramData.id);
  });

  it('should update an album', async () => {
    const updateAlbumDto: UpdateAlbumDto = { title: 'Updated Album' };
    const paramData: ParamAlbumDto = { id: '66f1b0a1359ff86714665c14' };
    const updatedAlbum = new Album();
    jest
      .spyOn(service, 'update')
      .mockResolvedValue(updatedAlbum as TAlbumDocument);

    expect(await controller.update(paramData, updateAlbumDto)).toBe(
      updatedAlbum,
    );
    expect(service.update).toHaveBeenCalledWith(paramData.id, updateAlbumDto);
  });

  it('should remove an album', async () => {
    const paramData: ParamAlbumDto = { id: '66f1b0a1359ff86714665c14' };
    const removedAlbum = new Album();
    jest
      .spyOn(service, 'remove')
      .mockResolvedValue(removedAlbum as TAlbumDocument);

    expect(await controller.remove(paramData)).toBe(removedAlbum);
    expect(service.remove).toHaveBeenCalledWith(paramData.id);
  });
});
