import { ApiProperty } from '@nestjs/swagger';

import { IPaginationResponse } from '../../../types';
import { Album, TAlbumDocument } from '../entities/album.entity';

export class AlbumDto implements IPaginationResponse<TAlbumDocument> {
  @ApiProperty({
    type: [Album],
    description: 'List of albums',
    required: true,
  })
  data: TAlbumDocument[];

  @ApiProperty({
    description: 'Total number of albums',
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
    description: 'Number of albums per page',
    required: true,
  })
  limit: number;
}
