import { ApiProperty } from '@nestjs/swagger';

import { IPaginationResponse } from '@app/types';

import { Artist, TArtistDocument } from '../entities/artist.entity';

export class ArtistDto implements IPaginationResponse<TArtistDocument> {
  @ApiProperty({
    type: [Artist],
    description: 'List of artists',
    required: true,
  })
  data: TArtistDocument[];

  @ApiProperty({
    description: 'Total number of artists',
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
    description: 'Number of artists per page',
    required: true,
  })
  limit: number;
}
