import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationResponse } from '../../types';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import {
  ArtistDto,
  CreateArtistDto,
  ParamArtistDto,
  QueryArtistDto,
  UpdateArtistDto,
} from './dto';
import { Artist, TArtistDocument } from './entities/artist.entity';

describe('ArtistsController', () => {
  let controller: ArtistsController;
  let service: ArtistsService;

  const mockArtistsService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findPaginated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [{ provide: ArtistsService, useValue: mockArtistsService }],
    }).compile();

    controller = module.get<ArtistsController>(ArtistsController);
    service = module.get<ArtistsService>(ArtistsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an artist', async () => {
    const createArtistDto: CreateArtistDto = {
      name: 'Test Artist',
    };
    const artist = new Artist();
    jest.spyOn(service, 'create').mockResolvedValue(artist as TArtistDocument);

    expect(await controller.create(createArtistDto)).toBe(artist);
    expect(service.create).toHaveBeenCalledWith(createArtistDto);
  });

  it('should retrieve paginated artists', async () => {
    const queryArtistDto: QueryArtistDto = { page: 1, limit: 10 };
    const artists = [new Artist(), new Artist()];
    const paginationResponse: IPaginationResponse<Artist> = {
      data: artists,
      total: 2,
      totalPages: 1,
      page: 1,
      limit: 10,
    };
    jest
      .spyOn(service, 'findPaginated')
      .mockResolvedValue(paginationResponse as ArtistDto);

    expect(await controller.findPaginated(queryArtistDto)).toBe(
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

  it('should find one artist by ID', async () => {
    const artist = new Artist();
    const paramData: ParamArtistDto = { id: '66f1b0a1359ff86714665c14' };
    jest.spyOn(service, 'findOne').mockResolvedValue(artist as TArtistDocument);

    expect(await controller.findOne(paramData)).toBe(artist);
    expect(service.findOne).toHaveBeenCalledWith(paramData.id);
  });

  it('should update an artist', async () => {
    const updateArtistDto: UpdateArtistDto = { name: 'Updated Artist' };
    const paramData: ParamArtistDto = { id: '66f1b0a1359ff86714665c14' };
    const updatedArtist = new Artist();
    jest
      .spyOn(service, 'update')
      .mockResolvedValue(updatedArtist as TArtistDocument);

    expect(await controller.update(paramData, updateArtistDto)).toBe(
      updatedArtist,
    );
    expect(service.update).toHaveBeenCalledWith(paramData.id, updateArtistDto);
  });

  it('should remove an artist', async () => {
    const paramData: ParamArtistDto = { id: '66f1b0a1359ff86714665c14' };
    const removedArtist = new Artist();
    jest
      .spyOn(service, 'remove')
      .mockResolvedValue(removedArtist as TArtistDocument);

    expect(await controller.remove(paramData)).toBe(removedArtist);
    expect(service.remove).toHaveBeenCalledWith(paramData.id);
  });
});
