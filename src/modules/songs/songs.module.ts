import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Song, SongSchema } from './entities/song.entity';
import { SongsController } from './songs.controller';
import { SongsRepository } from './songs.repository';
import { SongsResolver } from './songs.resolver';
import { SongsService } from './songs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
  ],
  controllers: [SongsController],
  providers: [SongsService, SongsResolver, SongsRepository],
  exports: [SongsService],
})
export class SongsModule {}
