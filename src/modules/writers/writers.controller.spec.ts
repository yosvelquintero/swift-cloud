import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationResponse } from '../../types';
import {
  CreateWriterDto,
  ParamWriterDto,
  QueryWriterDto,
  UpdateWriterDto,
  WriterDto,
} from './dto';
import { TWriterDocument, Writer } from './entities/writer.entity';
import { WritersController } from './writers.controller';
import { WritersService } from './writers.service';

describe('WritersController', () => {
  let controller: WritersController;
  let service: WritersService;

  const mockWritersService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findPaginated: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WritersController],
      providers: [{ provide: WritersService, useValue: mockWritersService }],
    }).compile();

    controller = module.get<WritersController>(WritersController);
    service = module.get<WritersService>(WritersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an writer', async () => {
    const createWriterDto: CreateWriterDto = {
      name: 'Test Writer',
    };
    const writer = new Writer();
    jest.spyOn(service, 'create').mockResolvedValue(writer as TWriterDocument);

    expect(await controller.create(createWriterDto)).toBe(writer);
    expect(service.create).toHaveBeenCalledWith(createWriterDto);
  });

  it('should retrieve paginated writers', async () => {
    const queryWriterDto: QueryWriterDto = { page: 1, limit: 10 };
    const writers = [new Writer(), new Writer()];
    const paginationResponse: IPaginationResponse<Writer> = {
      data: writers,
      total: 2,
      totalPages: 1,
      page: 1,
      limit: 10,
    };
    jest
      .spyOn(service, 'findPaginated')
      .mockResolvedValue(paginationResponse as WriterDto);

    expect(await controller.findPaginated(queryWriterDto)).toBe(
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

  it('should find one writer by ID', async () => {
    const writer = new Writer();
    const paramData: ParamWriterDto = { id: '66f1b0a1359ff86714665c14' };
    jest.spyOn(service, 'findOne').mockResolvedValue(writer as TWriterDocument);

    expect(await controller.findOne(paramData)).toBe(writer);
    expect(service.findOne).toHaveBeenCalledWith(paramData.id);
  });

  it('should update an writer', async () => {
    const updateWriterDto: UpdateWriterDto = { name: 'Updated Writer' };
    const paramData: ParamWriterDto = { id: '66f1b0a1359ff86714665c14' };
    const updatedWriter = new Writer();
    jest
      .spyOn(service, 'update')
      .mockResolvedValue(updatedWriter as TWriterDocument);

    expect(await controller.update(paramData, updateWriterDto)).toBe(
      updatedWriter,
    );
    expect(service.update).toHaveBeenCalledWith(paramData.id, updateWriterDto);
  });

  it('should remove an writer', async () => {
    const paramData: ParamWriterDto = { id: '66f1b0a1359ff86714665c14' };
    const removedWriter = new Writer();
    jest
      .spyOn(service, 'remove')
      .mockResolvedValue(removedWriter as TWriterDocument);

    expect(await controller.remove(paramData)).toBe(removedWriter);
    expect(service.remove).toHaveBeenCalledWith(paramData.id);
  });
});
