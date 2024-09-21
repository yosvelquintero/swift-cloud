import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Writer, WriterSchema } from './entities/writer.entity';
import { WritersController } from './writers.controller';
import { WritersRepository } from './writers.repository';
import { WritersService } from './writers.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Writer.name, schema: WriterSchema }]),
  ],
  controllers: [WritersController],
  providers: [WritersService, WritersRepository],
})
export class WritersModule {}
