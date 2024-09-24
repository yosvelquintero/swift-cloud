import { Test, TestingModule } from '@nestjs/testing';

import { AlbumsRepository } from './albums.repository';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { Album, TAlbumDocument } from './entities/album.entity';

describe('AlbumsService', () => {
  let service: AlbumsService;
  let repository: AlbumsRepository;

  const mockAlbumsRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findPaginated: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlbumsService,
        { provide: AlbumsRepository, useValue: mockAlbumsRepository },
      ],
    }).compile();

    service = module.get<AlbumsService>(AlbumsService);
    repository = module.get<AlbumsRepository>(AlbumsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an album', async () => {
    const createAlbumDto: CreateAlbumDto = {
      title: 'Test Album',
      artistIds: [],
      songIds: [],
      year: 2023,
    };
    const album = new Album();
    jest.spyOn(repository, 'create').mockResolvedValue(album as TAlbumDocument);

    expect(await service.create(createAlbumDto)).toBe(album);
    expect(repository.create).toHaveBeenCalledWith(createAlbumDto);
  });

  it('should find one album by ID', async () => {
    const album = new Album();
    const id = '66f1b0a1359ff86714665c14';
    jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(album as TAlbumDocument);

    expect(await service.findOne(id)).toBe(album);
    expect(repository.findOne).toHaveBeenCalledWith(
      { _id: id },
      {},
      { populate: service['populateFields'] },
    );
  });

  it('should update an album', async () => {
    const updateAlbumDto: UpdateAlbumDto = { title: 'Updated Album' };
    const id = '66f1b0a1359ff86714665c14';
    const updatedAlbum = new Album();
    jest
      .spyOn(repository, 'findOneAndUpdate')
      .mockResolvedValue(updatedAlbum as TAlbumDocument);

    expect(await service.update(id, updateAlbumDto)).toBe(updatedAlbum);
    expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: id },
      updateAlbumDto,
    );
  });

  it('should remove an album', async () => {
    const id = '66f1b0a1359ff86714665c14';
    const removedAlbum = new Album();
    jest
      .spyOn(repository, 'findOneAndDelete')
      .mockResolvedValue(removedAlbum as TAlbumDocument);

    expect(await service.remove(id)).toBe(removedAlbum);
    expect(repository.findOneAndDelete).toHaveBeenCalledWith({ _id: id });
  });
});
