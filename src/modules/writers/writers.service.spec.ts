import { Test, TestingModule } from '@nestjs/testing';

import { CreateWriterDto, UpdateWriterDto } from './dto';
import { TWriterDocument, Writer } from './entities/writer.entity';
import { WritersRepository } from './writers.repository';
import { WritersService } from './writers.service';

describe('WritersService', () => {
  let service: WritersService;
  let repository: WritersRepository;

  const mockWritersRepository = {
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
        WritersService,
        { provide: WritersRepository, useValue: mockWritersRepository },
      ],
    }).compile();

    service = module.get<WritersService>(WritersService);
    repository = module.get<WritersRepository>(WritersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an writer', async () => {
    const createWriterDto: CreateWriterDto = { name: 'Test Writer' };
    const writer = new Writer();
    jest
      .spyOn(repository, 'create')
      .mockResolvedValue(writer as TWriterDocument);

    expect(await service.create(createWriterDto)).toBe(writer);
    expect(repository.create).toHaveBeenCalledWith(createWriterDto);
  });

  it('should find one writer by ID', async () => {
    const writer = new Writer();
    const id = '66f1b0a1359ff86714665c14';
    jest
      .spyOn(repository, 'findOne')
      .mockResolvedValue(writer as TWriterDocument);

    expect(await service.findOne(id)).toBe(writer);
    expect(repository.findOne).toHaveBeenCalledWith({ _id: id });
  });

  it('should update an writer', async () => {
    const updateWriterDto: UpdateWriterDto = { name: 'Updated Writer' };
    const id = '66f1b0a1359ff86714665c14';
    const updatedWriter = new Writer();
    jest
      .spyOn(repository, 'findOneAndUpdate')
      .mockResolvedValue(updatedWriter as TWriterDocument);

    expect(await service.update(id, updateWriterDto)).toBe(updatedWriter);
    expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: id },
      updateWriterDto,
    );
  });

  it('should remove an writer', async () => {
    const id = '66f1b0a1359ff86714665c14';
    const removedWriter = new Writer();
    jest
      .spyOn(repository, 'findOneAndDelete')
      .mockResolvedValue(removedWriter as TWriterDocument);

    expect(await service.remove(id)).toBe(removedWriter);
    expect(repository.findOneAndDelete).toHaveBeenCalledWith({ _id: id });
  });
});
