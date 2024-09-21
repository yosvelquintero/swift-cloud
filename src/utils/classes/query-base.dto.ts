import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { ESortOrder } from '@app/types';

export class QueryBaseDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly limit?: number = 10;

  @IsOptional()
  @IsEnum(ESortOrder)
  readonly sort?: ESortOrder = ESortOrder.DESC;

  // Example filter parameters
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly genre?: string;
}
