import { ApiProperty } from '@nestjs/swagger';

import { IPaginationResponse } from '@app/types';

import { Song, TSongDocument } from '../entities/song.entity';

export class SongDto implements IPaginationResponse<TSongDocument> {
  @ApiProperty({
    type: [Song],
    description: 'List of songs',
    required: true,
  })
  data: TSongDocument[];

  @ApiProperty({
    description: 'Total number of songs',
    required: true,
  })
  total: number;

  @ApiProperty({
    description: 'Total number of pages',
    required: true,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Current page number',
    required: true,
  })
  page: number;

  @ApiProperty({
    description: 'Number of songs per page',
    required: true,
  })
  limit: number;
}
