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

import { PaginatedSongs, QueryPaginationByYearSongsDto } from './dto';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './entities/song.entity';
import { SongsService } from './songs.service';

registerEnumType(ESortOrder, { name: 'ESortOrder' });

@Resolver(() => Song)
export class SongsResolver {
  constructor(private readonly songsService: SongsService) {}

  @Mutation(() => Song)
  createSong(@Args('createSongInput') createSongDto: CreateSongDto) {
    return this.songsService.create(createSongDto);
  }

  @Query(() => [Song], { name: 'songs' })
  findAll() {
    return this.songsService.findAll();
  }

  @Query(() => PaginatedSongs, { name: 'songsPaginated' })
  findPaginated(@Args('pagination') paginationArgs: QueryPaginationBaseDto) {
    const { page, limit, sort, field, search } = paginationArgs;
    return this.songsService.findPaginated(page, limit, sort, field, search);
  }

  @Query(() => PaginatedSongs, { name: 'songsPaginatedByYear' })
  findByYear(
    @Args('pagination') paginationArgs: QueryPaginationByYearSongsDto,
  ) {
    const { year, page, limit, sort, field, search } = paginationArgs;
    return this.songsService.findByYear(year, page, limit, sort, field, search);
  }

  @Query(() => Song, { name: 'song' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.songsService.findOne(id);
  }

  @Mutation(() => Song)
  updateSong(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateSongInput') updateSongDto: UpdateSongDto,
  ) {
    return this.songsService.update(id, updateSongDto);
  }

  @Mutation(() => Song)
  removeSong(@Args('id', { type: () => ID }) id: string) {
    return this.songsService.remove(id);
  }
}
