import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { IPaginationResponse } from '@app/types';

import { Artist, TArtistDocument } from '../entities/artist.entity';

@ObjectType()
export class ArtistDto implements IPaginationResponse<TArtistDocument> {
  @Field(() => [Artist])
  @ApiProperty({
    type: [Artist],
    description: 'List of artists',
    required: true,
  })
  data: TArtistDocument[];

  @Field(() => Int)
  @ApiProperty({
    description: 'Total number of artists',
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
    description: 'Number of artists per page',
    required: true,
  })
  limit: number;
}
