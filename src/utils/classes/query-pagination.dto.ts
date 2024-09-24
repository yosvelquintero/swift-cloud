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

export class QueryPaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly limit?: number = PAGINATION.limit;

  @IsOptional()
  @IsEnum(ESortOrder)
  @Type(() => String)
  readonly sort?: ESortOrder = ESortOrder.DESC;

  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly field?: string = PAGINATION.field;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly date?: Date;

  @IsOptional()
  @IsString()
  @Type(() => String)
  readonly search?: string;
}
