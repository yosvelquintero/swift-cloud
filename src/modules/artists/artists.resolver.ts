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

import { ArtistsService } from './artists.service';
import { PaginatedArtists } from './dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

registerEnumType(ESortOrder, { name: 'ESortOrder' });

@Resolver(() => Artist)
export class ArtistsResolver {
  constructor(private readonly artistsService: ArtistsService) {}

  @Mutation(() => Artist)
  createArtist(@Args('createArtistInput') createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Query(() => [Artist], { name: 'artists' })
  findAll() {
    return this.artistsService.findAll();
  }

  @Query(() => PaginatedArtists, { name: 'artistsPaginated' })
  findPaginated(@Args('pagination') paginationArgs: QueryPaginationBaseDto) {
    const { page, limit, sort, field, search } = paginationArgs;
    return this.artistsService.findPaginated(page, limit, sort, field, search);
  }

  @Query(() => Artist, { name: 'artist' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.artistsService.findOne(id);
  }

  @Mutation(() => Artist)
  updateArtist(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateArtistInput') updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistsService.update(id, updateArtistDto);
  }

  @Mutation(() => Artist)
  removeArtist(@Args('id', { type: () => ID }) id: string) {
    return this.artistsService.remove(id);
  }
}
