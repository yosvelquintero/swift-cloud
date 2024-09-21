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

import { AlbumsService } from './albums.service';
import {
  CreateAlbumDto,
  ParamAlbumDto,
  QueryAlbumDto,
  UpdateAlbumDto,
} from './dto';
import { Album, AlbumDocument } from './entities/album.entity';

@ApiTags('Albums')
@Controller({
  path: 'albums',
  version: '1',
})
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new album' })
  @ApiResponse({
    status: 201,
    description: 'The album has been successfully created.',
    type: Album,
  })
  create(@Body() createAlbumDto: CreateAlbumDto): Promise<AlbumDocument> {
    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a paginated list of albums' })
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
  @ApiResponse({ status: 200, description: 'List of albums.', type: [Album] })
  findPaginated(
    @Query() queryData: QueryAlbumDto,
  ): Promise<IPaginationResponse<AlbumDocument>> {
    const {
      page = 1,
      limit = PAGINATION.limit,
      sort = ESortOrder.DESC,
    } = queryData;

    return this.albumsService.findPaginated(page, limit, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an album by ID' })
  @ApiParam({ name: 'id', description: 'ID of the album', type: String })
  @ApiResponse({ status: 200, description: 'The album data.', type: Album })
  @ApiResponse({ status: 404, description: 'Album not found.' })
  findOne(@Param() paramData: ParamAlbumDto): Promise<AlbumDocument> {
    return this.albumsService.findOne(paramData.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an album by ID' })
  @ApiParam({ name: 'id', description: 'ID of the album', type: String })
  @ApiResponse({
    status: 200,
    description: 'The album has been successfully updated.',
    type: Album,
  })
  update(
    @Param() paramData: ParamAlbumDto,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumDocument> {
    return this.albumsService.update(paramData.id, updateAlbumDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an album by ID' })
  @ApiParam({ name: 'id', description: 'ID of the album', type: String })
  @ApiResponse({
    status: 200,
    description: 'The album has been successfully deleted.',
    type: Album,
  })
  remove(@Param() paramData: ParamAlbumDto): Promise<AlbumDocument> {
    return this.albumsService.remove(paramData.id);
  }
}
