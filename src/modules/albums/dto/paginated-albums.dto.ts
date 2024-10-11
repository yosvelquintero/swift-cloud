import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationBaseDto } from 'src/utils';

import { Album } from '../entities/album.entity';

@ObjectType()
export class PaginatedAlbums extends PaginationBaseDto<Album> {
  @Field(() => [Album])
  data: Album[];
}
