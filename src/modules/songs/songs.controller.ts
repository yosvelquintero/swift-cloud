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

import { ESortOrder, IPaginationResponse } from '@app/types';

import {
  CreateSongDto,
  ParamSongDto,
  ParamYearSongDto,
  QuerySongDto,
  SongDto,
  UpdateSongDto,
} from './dto';
import { Song, TSongDocument } from './entities/song.entity';
import { SongsService } from './songs.service';

@ApiTags('Songs')
@Controller({
  path: 'songs',
  version: '1',
})
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new song' })
  @ApiResponse({
    status: 201,
    description: 'The song has been successfully created.',
    type: Song,
  })
  create(@Body() createSongDto: CreateSongDto): Promise<TSongDocument> {
    return this.songsService.create(createSongDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a paginated list of songs' })
  @ApiQuery({
    name: 'sort',
    description: 'Sort order',
    enum: ESortOrder,
    required: false,
  })
  @ApiQuery({
    name: 'field',
    description: 'Field to sort by',
    type: String,
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
  @ApiQuery({
    name: 'search',
    description: 'Search query',
    type: String,
    required: false,
  })
  @ApiResponse({ status: 200, description: 'List of songs.', type: [SongDto] })
  findPaginated(
    @Query() queryData: QuerySongDto,
  ): Promise<IPaginationResponse<TSongDocument>> {
    const { page, limit, sort, field, search } = queryData;
    return this.songsService.findPaginated(page, limit, sort, field, search);
  }

  @Get('album/:id')
  @ApiOperation({ summary: 'Find paginated songs by album id' })
  @ApiParam({
    name: 'id',
    description: 'ID of the album',
    type: String,
  })
  @ApiQuery({
    name: 'sort',
    description: 'Sort order',
    enum: ESortOrder,
    required: false,
  })
  @ApiQuery({
    name: 'field',
    description: 'Field to sort by',
    type: String,
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
  @ApiQuery({
    name: 'search',
    description: 'Search query',
    type: String,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'List of songs from the specified album.',
    type: [SongDto],
  })
  findByAlbumId(
    @Param() paramData: ParamSongDto,
    @Query() queryData: QuerySongDto,
  ): Promise<IPaginationResponse<TSongDocument>> {
    const { page, limit, sort, field, search } = queryData;
    return this.songsService.findByAlbumId(
      paramData.id,
      page,
      limit,
      sort,
      field,
      search,
    );
  }

  @Get('year/:year')
  @ApiOperation({ summary: 'Find paginated songs by release year' })
  @ApiParam({
    name: 'year',
    description: 'Release year',
    type: Number,
  })
  @ApiQuery({
    name: 'sort',
    description: 'Sort order',
    enum: ESortOrder,
    required: false,
  })
  @ApiQuery({
    name: 'field',
    description: 'Field to sort by',
    type: String,
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
  @ApiQuery({
    name: 'search',
    description: 'Search query',
    type: String,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'List of songs released in the given year.',
    type: [SongDto],
  })
  findByYear(
    @Param() paramData: ParamYearSongDto,
    @Query() queryData: QuerySongDto,
  ): Promise<IPaginationResponse<TSongDocument>> {
    const { page, limit, sort, field, search } = queryData;
    return this.songsService.findByYear(
      paramData.year,
      page,
      limit,
      sort,
      field,
      search,
    );
  }

  @Get('most-popular')
  @ApiOperation({
    summary: 'Get paginated most popular songs for a given date',
  })
  @ApiQuery({
    name: 'sort',
    description: 'Sort order',
    enum: ESortOrder,
    required: false,
  })
  @ApiQuery({
    name: 'field',
    description: 'Field to sort by',
    type: String,
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
  @ApiQuery({
    name: 'search',
    description: 'Search query',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'date',
    description: 'Date in YYYY-MM-DD format',
    type: Date,
    example: '2024-06-01',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of most popular songs for the date.',
    type: [SongDto],
  })
  findMostPopular(
    @Query() queryData: QuerySongDto,
  ): Promise<IPaginationResponse<TSongDocument>> {
    const { date, page, limit, sort, field, search } = queryData;
    return this.songsService.findMostPopular(
      date,
      page,
      limit,
      sort,
      field,
      search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a song by ID' })
  @ApiParam({ name: 'id', description: 'ID of the song', type: String })
  @ApiResponse({ status: 200, description: 'The song data.', type: Song })
  @ApiResponse({ status: 404, description: 'Song not found.' })
  findOne(@Param() paramData: ParamSongDto): Promise<TSongDocument> {
    return this.songsService.findOne(paramData.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a song by ID' })
  @ApiParam({ name: 'id', description: 'ID of the song', type: String })
  @ApiResponse({
    status: 200,
    description: 'The song has been successfully updated.',
    type: Song,
  })
  @ApiResponse({ status: 404, description: 'Song not found.' })
  update(
    @Param() paramData: ParamSongDto,
    @Body() updateSongDto: UpdateSongDto,
  ) {
    return this.songsService.update(paramData.id, updateSongDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a song by ID' })
  @ApiParam({ name: 'id', description: 'ID of the song', type: String })
  @ApiResponse({
    status: 200,
    description: 'The song has been successfully deleted.',
    type: Song,
  })
  @ApiResponse({ status: 404, description: 'Song not found.' })
  remove(@Param() paramData: ParamSongDto): Promise<TSongDocument> {
    return this.songsService.remove(paramData.id);
  }
}
