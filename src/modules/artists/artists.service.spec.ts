import { Test, TestingModule } from '@nestjs/testing';

import { ArtistsRepository } from './artists.repository';
import { ArtistsService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto } from './dto';
import { Artist, TArtistDocument } from './entities/artist.entity';

describe('ArtistsService', () => {
  let service: ArtistsService;
  let repository: ArtistsRepository;

  const mockArtistsRepository = {
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
        ArtistsService,
        { provide: ArtistsRepository, useValue: mockArtistsRepository },
      ],
    }).compile();

    service = module.get<ArtistsService>(ArtistsService);
    repository = module.get<ArtistsRepository>(ArtistsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an artist', async () => {
    const createArtistDto: CreateArtistDto = { name: 'Test Artist' };
    const artist = new Artist();
    jest
      .spyOn(repository, 'create')
      .mockResolvedValue(artist as TArtistDocument);

    expect(await service.create(createArtistDto)).toBe(artist);
    expect(repository.create).toHaveBeenCalledWith(createArtistDto);
  });

  it('should find one artist by ID', async () => {
    const artist = new Artist();
    const id = '66f1b0a1359ff86714665c14';
    jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(artist as TArtistDocument);

    expect(await service.findOne(id)).toBe(artist);
    expect(repository.findOne).toHaveBeenCalledWith({ _id: id });
  });

  it('should update an artist', async () => {
    const updateArtistDto: UpdateArtistDto = { name: 'Updated Artist' };
    const id = '66f1b0a1359ff86714665c14';
    const updatedArtist = new Artist();
    jest
      .spyOn(repository, 'findOneAndUpdate')
      .mockResolvedValue(updatedArtist as TArtistDocument);

    expect(await service.update(id, updateArtistDto)).toBe(updatedArtist);
    expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: id },
      updateArtistDto,
    );
  });

  it('should remove an artist', async () => {
    const id = '66f1b0a1359ff86714665c14';
    const removedArtist = new Artist();
    jest
      .spyOn(repository, 'findOneAndDelete')
      .mockResolvedValue(removedArtist as TArtistDocument);

    expect(await service.remove(id)).toBe(removedArtist);
    expect(repository.findOneAndDelete).toHaveBeenCalledWith({ _id: id });
  });
});
