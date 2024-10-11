import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';
import { QueryPaginationBaseDto } from 'src/utils';

@InputType()
export class QueryPaginationByYearSongsDto extends QueryPaginationBaseDto {
  @Field(() => Int)
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  year: number;
}
