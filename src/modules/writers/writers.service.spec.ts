import { Test, TestingModule } from '@nestjs/testing';

import { WritersService } from './writers.service';

describe('WritersService', () => {
  let service: WritersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WritersService],
    }).compile();

    service = module.get<WritersService>(WritersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
