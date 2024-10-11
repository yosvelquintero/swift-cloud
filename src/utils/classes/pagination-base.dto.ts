import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

@ObjectType({ isAbstract: true })
export abstract class PaginationBaseDto<T> {
  abstract data: T[];

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  total: number;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  totalPages: number;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit: number;
}
