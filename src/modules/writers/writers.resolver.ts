import {
  Args,
  ID,
  Mutation,
  Query,
  registerEnumType,
  Resolver,
} from '@nestjs/graphql';

import { ESortOrder } from '@app/types';
import { QueryPaginationBaseDto } from '@app/utils';

import { PaginatedWriters } from './dto';
import { CreateWriterDto } from './dto/create-writer.dto';
import { UpdateWriterDto } from './dto/update-writer.dto';
import { Writer } from './entities/writer.entity';
import { WritersService } from './writers.service';

registerEnumType(ESortOrder, { name: 'ESortOrder' });

@Resolver(() => Writer)
export class WritersResolver {
  constructor(private readonly writersService: WritersService) {}

  @Mutation(() => Writer)
  createWriter(@Args('createWriterInput') createWriterDto: CreateWriterDto) {
    return this.writersService.create(createWriterDto);
  }

  @Query(() => [Writer], { name: 'writers' })
  findAll() {
    return this.writersService.findAll();
  }

  @Query(() => PaginatedWriters, { name: 'writersPaginated' })
  findPaginated(@Args('pagination') paginationArgs: QueryPaginationBaseDto) {
    const { page, limit, sort, field, search } = paginationArgs;
    return this.writersService.findPaginated(page, limit, sort, field, search);
  }

  @Query(() => Writer, { name: 'writer' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.writersService.findOne(id);
  }

  @Mutation(() => Writer)
  updateWriter(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateWriterInput') updateWriterDto: UpdateWriterDto,
  ) {
    return this.writersService.update(id, updateWriterDto);
  }

  @Mutation(() => Writer)
  removeWriter(@Args('id', { type: () => ID }) id: string) {
    return this.writersService.remove(id);
  }
}
