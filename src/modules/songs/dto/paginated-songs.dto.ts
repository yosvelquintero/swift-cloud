import { Field, ObjectType } from '@nestjs/graphql';

import { PaginationBaseDto } from '@app/utils';

import { Song } from '../entities/song.entity';

@ObjectType()
export class PaginatedSongs extends PaginationBaseDto<Song> {
  @Field(() => [Song])
  data: Song[];
}
