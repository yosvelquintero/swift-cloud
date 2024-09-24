import { ApiProperty } from '@nestjs/swagger';

import { IPaginationResponse } from '../../../types';
import { TWriterDocument, Writer } from '../entities/writer.entity';

export class WriterDto implements IPaginationResponse<TWriterDocument> {
  @ApiProperty({
    type: [Writer],
    description: 'List of writer.entitys',
    required: true,
  })
  data: TWriterDocument[];

  @ApiProperty({
    description: 'Total number of writer.entitys',
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
    description: 'Number of writer.entitys per page',
    required: true,
  })
  limit: number;
}
