import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationBaseDto } from '@app/utils';

import { Artist } from '../entities/artist.entity';

@ObjectType()
export class PaginatedArtists extends PaginationBaseDto<Artist> {
  @Field(() => [Artist])
  data: Artist[];
}
