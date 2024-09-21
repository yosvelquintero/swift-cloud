import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PAGINATION } from '@app/config';
import { ESortOrder, IPaginationResponse } from '@app/types';

import { ArtistsService } from './artists.service';
import {
  CreateArtistDto,
  ParamArtistDto,
  QueryArtistDto,
  UpdateArtistDto,
} from './dto';
import { Artist, ArtistDocument } from './entities/artist.entity';

@ApiTags('Artists')
@Controller({
  path: 'artists',
  version: '1',
})
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new artist' })
  @ApiResponse({
    status: 201,
    description: 'The artist has been successfully created.',
    type: Artist,
  })
  create(@Body() createArtistDto: CreateArtistDto): Promise<ArtistDocument> {
    return this.artistsService.create(createArtistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a paginated list of artists' })
  @ApiQuery({
    name: 'sort',
    description: 'Sort order',
    enum: ESortOrder,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    type: Number,
    required: false,
  })
  @ApiResponse({ status: 200, description: 'List of artists.', type: [Artist] })
  findPaginated(
    @Query() queryData: QueryArtistDto,
  ): Promise<IPaginationResponse<ArtistDocument>> {
    const {
      page = 1,
      limit = PAGINATION.limit,
      sort = ESortOrder.DESC,
    } = queryData;

    return this.artistsService.findPaginated(page, limit, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an artist by ID' })
  @ApiParam({ name: 'id', description: 'ID of the artist', type: String })
  @ApiResponse({ status: 200, description: 'The artist data.', type: Artist })
  @ApiResponse({ status: 404, description: 'Artist not found.' })
  findOne(@Param() paramData: ParamArtistDto): Promise<ArtistDocument> {
    return this.artistsService.findOne(paramData.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an artist by ID' })
  @ApiParam({ name: 'id', description: 'ID of the artist', type: String })
  @ApiResponse({
    status: 200,
    description: 'The artist has been successfully updated.',
    type: Artist,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  update(
    @Param() paramData: ParamArtistDto,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistDocument> {
    return this.artistsService.update(paramData.id, updateArtistDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an artist by ID' })
  @ApiParam({ name: 'id', description: 'ID of the artist', type: String })
  @ApiResponse({
    status: 200,
    description: 'The artist has been successfully deleted.',
    type: Artist,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  remove(@Param() paramData: ParamArtistDto): Promise<ArtistDocument> {
    return this.artistsService.remove(paramData.id);
  }
}
