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

import { ESortOrder, IPaginationResponse } from '../../types';
import {
  CreateWriterDto,
  ParamWriterDto,
  QueryWriterDto,
  UpdateWriterDto,
  WriterDto,
} from './dto';
import { TWriterDocument, Writer } from './entities/writer.entity';
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
  create(@Body() createWriterDto: CreateWriterDto): Promise<TWriterDocument> {
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
    description: 'List of paginated writers.',
    type: [WriterDto],
  })
  findPaginated(
    @Query() queryData: QueryWriterDto,
  ): Promise<IPaginationResponse<TWriterDocument>> {
    const { page, limit, sort, field, search } = queryData;
    return this.writersService.findPaginated(page, limit, sort, field, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a writer by ID' })
  @ApiParam({ name: 'id', description: 'ID of the writer', type: String })
  @ApiResponse({ status: 200, description: 'The writer data.', type: Writer })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  findOne(@Param() paramData: ParamWriterDto): Promise<TWriterDocument> {
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
  ): Promise<TWriterDocument> {
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
  remove(@Param() paramData: ParamWriterDto): Promise<TWriterDocument> {
    return this.writersService.remove(paramData.id);
  }
}
