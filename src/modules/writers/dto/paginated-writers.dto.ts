import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationBaseDto } from 'src/utils';

import { Writer } from '../entities/writer.entity';

@ObjectType()
export class PaginatedWriters extends PaginationBaseDto<Writer> {
  @Field(() => [Writer])
  data: Writer[];
}
