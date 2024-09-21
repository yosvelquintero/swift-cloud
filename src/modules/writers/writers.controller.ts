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
  CreateWriterDto,
  ParamWriterDto,
  QueryWriterDto,
  UpdateWriterDto,
} from './dto';
import { Writer, WriterDocument } from './entities/writer.entity';
import { WritersService } from './writers.service';

@ApiTags('Writers')
@Controller({
  path: 'writers',
  version: '1',
})
export class WritersController {
  constructor(private readonly writersService: WritersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new writer' })
  @ApiResponse({
    status: 201,
    description: 'The writer has been successfully created.',
    type: Writer,
  })
  create(@Body() createWriterDto: CreateWriterDto): Promise<WriterDocument> {
    return this.writersService.create(createWriterDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a paginated list of writers' })
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
  @ApiResponse({ status: 200, description: 'List of writers.', type: [Writer] })
  findPaginated(
    @Query() queryData: QueryWriterDto,
  ): Promise<IPaginationResponse<WriterDocument>> {
    const {
      page = 1,
      limit = PAGINATION.limit,
      sort = ESortOrder.DESC,
    } = queryData;

    return this.writersService.findPaginated(page, limit, sort);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a writer by ID' })
  @ApiParam({ name: 'id', description: 'ID of the writer', type: String })
  @ApiResponse({ status: 200, description: 'The writer data.', type: Writer })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findOne(@Param() paramData: ParamWriterDto): Promise<WriterDocument> {
    return this.writersService.findOne(paramData.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a writer by ID' })
  @ApiParam({ name: 'id', description: 'ID of the writer', type: String })
  @ApiResponse({
    status: 200,
    description: 'The writer has been successfully updated.',
    type: Writer,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  update(
    @Param() paramData: ParamWriterDto,
    @Body() updateWriterDto: UpdateWriterDto,
  ): Promise<WriterDocument> {
    return this.writersService.update(paramData.id, updateWriterDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a writer by ID' })
  @ApiParam({ name: 'id', description: 'ID of the writer', type: String })
  @ApiResponse({
    status: 200,
    description: 'The writer has been successfully deleted.',
    type: Writer,
  })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  remove(@Param() paramData: ParamWriterDto): Promise<WriterDocument> {
    return this.writersService.remove(paramData.id);
  }
}
