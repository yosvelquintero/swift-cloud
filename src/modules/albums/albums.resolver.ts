import {
  Args,
  ID,
  Mutation,
  Query,
  registerEnumType,
  Resolver,
} from '@nestjs/graphql';
import { ESortOrder } from 'src/types';
import { QueryPaginationBaseDto } from 'src/utils';

import { AlbumsService } from './albums.service';
import { PaginatedAlbums } from './dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

registerEnumType(ESortOrder, { name: 'ESortOrder' });

@Resolver(() => Album)
export class AlbumsResolver {
  constructor(private readonly albumsService: AlbumsService) {}

  @Mutation(() => Album)
  createAlbum(@Args('createAlbumInput') createAlbumDto: CreateAlbumDto) {
    return this.albumsService.create(createAlbumDto);
  }

  @Query(() => [Album], { name: 'albums' })
  findAll() {
    return this.albumsService.findAll();
  }

  @Query(() => PaginatedAlbums, { name: 'albumsPaginated' })
  findPaginated(@Args('pagination') paginationArgs: QueryPaginationBaseDto) {
    const { page, limit, sort, field, search } = paginationArgs;
    return this.albumsService.findPaginated(page, limit, sort, field, search);
  }

  @Query(() => Album, { name: 'album' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.albumsService.findOne(id);
  }

  @Mutation(() => Album)
  updateAlbum(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateAlbumInput') updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Mutation(() => Album)
  removeAlbum(@Args('id', { type: () => ID }) id: string) {
    return this.albumsService.remove(id);
  }
}
