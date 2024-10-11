import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { IPaginationResponse } from '../../../types';
import { Album, TAlbumDocument } from '../entities/album.entity';

@InputType()
export class AlbumDto implements IPaginationResponse<TAlbumDocument> {
  @Field(() => [Album])
  @ApiProperty({
    type: [Album],
    description: 'List of albums',
    required: true,
  })
  data: TAlbumDocument[];

  @Field(() => Int)
  @ApiProperty({
    description: 'Total number of albums',
    required: true,
  })
  total: number;

  @Field(() => Int)
  @ApiProperty({
    description: 'Total number of pages',
    required: true,
  })
  totalPages: number;

  @Field(() => Int)
  @ApiProperty({
    description: 'Current page number',
    required: true,
  })
  page: number;

  @Field(() => Int)
  @ApiProperty({
    description: 'Number of albums per page',
    required: true,
  })
  limit: number;
}
