import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

import { IPaginationResponse } from '@app/types';

import { TWriterDocument, Writer } from '../entities/writer.entity';

@InputType()
export class WriterDto implements IPaginationResponse<TWriterDocument> {
  @Field(() => [Writer])
  @ApiProperty({
    type: [Writer],
    description: 'List of writer.entitys',
    required: true,
  })
  data: TWriterDocument[];

  @Field(() => Int)
  @ApiProperty({
    description: 'Total number of writer.entitys',
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
    description: 'Number of writer.entitys per page',
    required: true,
  })
  limit: number;
}
