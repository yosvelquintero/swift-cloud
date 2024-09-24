import { Test, TestingModule } from '@nestjs/testing';

import { CreateSongDto, UpdateSongDto } from './dto';
import { Song, TSongDocument } from './entities/song.entity';
import { SongsRepository } from './songs.repository';
import { SongsService } from './songs.service';

describe('SongsService', () => {
  let service: SongsService;
  let repository: SongsRepository;

  const mockSongsRepository = {
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
        SongsService,
        { provide: SongsRepository, useValue: mockSongsRepository },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    repository = module.get<SongsRepository>(SongsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
    jest.spyOn(repository, 'create').mockResolvedValue(song as TSongDocument);

    expect(await service.create(createSongDto)).toBe(song);
    expect(repository.create).toHaveBeenCalledWith(createSongDto);
  });

  it('should find one song by ID', async () => {
    const song = new Song();
    const id = '66f1b0a1359ff86714665c14';
    jest.spyOn(repository, 'findOne').mockResolvedValue(song as TSongDocument);

    expect(await service.findOne(id)).toBe(song);
    expect(repository.findOne).toHaveBeenCalledWith(
      { _id: id },
      {},
      { populate: service['populateFields'] },
    );
  });

  it('should update an song', async () => {
    const updateSongDto: UpdateSongDto = { title: 'Updated Song' };
    const id = '66f1b0a1359ff86714665c14';
    const updatedSong = new Song();
    jest
      .spyOn(repository, 'findOneAndUpdate')
      .mockResolvedValue(updatedSong as TSongDocument);

    expect(await service.update(id, updateSongDto)).toBe(updatedSong);
    expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: id },
      updateSongDto,
    );
  });

  it('should remove an song', async () => {
    const id = '66f1b0a1359ff86714665c14';
    const removedSong = new Song();
    jest
      .spyOn(repository, 'findOneAndDelete')
      .mockResolvedValue(removedSong as TSongDocument);

    expect(await service.remove(id)).toBe(removedSong);
    expect(repository.findOneAndDelete).toHaveBeenCalledWith({ _id: id });
  });
});
