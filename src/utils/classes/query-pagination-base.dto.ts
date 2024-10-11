import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { PAGINATION } from '@app/config';
import { ESortOrder } from '@app/types';

@InputType()
export class QueryPaginationBaseDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly page?: number = 1;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly limit?: number = PAGINATION.limit;

  @Field(() => ESortOrder, { nullable: true })
  @IsOptional()
  @IsEnum(ESortOrder)
  @Type(() => String)
  readonly sort?: ESortOrder = ESortOrder.DESC;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly field?: string = PAGINATION.field;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly date?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly search?: string;
}
