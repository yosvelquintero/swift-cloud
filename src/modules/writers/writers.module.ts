import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Writer, WriterSchema } from './entities/writer.entity';
import { WritersController } from './writers.controller';
import { WritersRepository } from './writers.repository';
import { WritersResolver } from './writers.resolver';
import { WritersService } from './writers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Writer.name, schema: WriterSchema }]),
  ],
  controllers: [WritersController],
  providers: [WritersService, WritersResolver, WritersRepository],
  exports: [WritersService],
})
export class WritersModule {}
