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

import {
  CreateSongDto,
  ParamSongDto,
  QuerySongDto,
  UpdateSongDto,
} from './dto';
import { Song, SongDocument } from './entities/song.entity';
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
  create(@Body() createSongDto: CreateSongDto): Promise<SongDocument> {
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
  @ApiResponse({ status: 200, description: 'List of songs.', type: [Song] })
  findPaginated(
    @Query() queryData: QuerySongDto,
  ): Promise<IPaginationResponse<SongDocument>> {
    const {
      page = 1,
      limit = PAGINATION.limit,
      sort = ESortOrder.DESC,
    } = queryData;

    return this.songsService.findPaginated(page, limit, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a song by ID' })
  @ApiParam({ name: 'id', description: 'ID of the song', type: String })
  @ApiResponse({ status: 200, description: 'The song data.', type: Song })
  @ApiResponse({ status: 404, description: 'Song not found.' })
  findOne(@Param() paramData: ParamSongDto): Promise<SongDocument> {
    return this.songsService.findOne(paramData.id);
  }

  @Get('year/:year')
  @ApiOperation({ summary: 'Find songs by release year' })
  @ApiParam({ name: 'year', description: 'Release year', type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of songs released in the given year.',
    type: [Song],
  })
  findByYear(@Param('year') year: number): Promise<SongDocument[]> {
    return this.songsService.findByYear(year);
  }

  @Get('album/:id')
  @ApiOperation({ summary: 'Find songs by album' })
  @ApiParam({ name: 'id', description: 'ID of the album', type: String })
  @ApiResponse({
    status: 200,
    description: 'List of songs from the specified album.',
    type: [Song],
  })
  findByAlbum(@Param() paramData: ParamSongDto): Promise<SongDocument[]> {
    return this.songsService.findByAlbum(paramData.id);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get most popular songs for a given month' })
  @ApiQuery({
    name: 'month',
    description: 'Month in YYYY-MM-DD format',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of songs to return',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'List of most popular songs for the month.',
    type: [Song],
  })
  findMostPopularSongs(
    @Query('month') month: string,
    @Query('limit') limit?: number,
  ): Promise<SongDocument[]> {
    return this.songsService.findMostPopularSongs(month, limit);
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
  remove(@Param() paramData: ParamSongDto): Promise<SongDocument> {
    return this.songsService.remove(paramData.id);
  }
}
