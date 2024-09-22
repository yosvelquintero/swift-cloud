import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { PAGINATION } from '@app/config';
import { ESortOrder } from '@app/types';

export class QueryPaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly limit?: number = PAGINATION.limit;

  @IsOptional()
  @IsEnum(ESortOrder)
  readonly sort?: ESortOrder = ESortOrder.DESC;

  @IsOptional()
  @IsString()
  readonly field?: string = PAGINATION.field;
}
