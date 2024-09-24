import { Module } from '@nestjs/common';

import { AlbumsModule } from '../../modules/albums/albums.module';
import { ArtistsModule } from '../../modules/artists/artists.module';
import { SongsModule } from '../../modules/songs/songs.module';
import { WritersModule } from '../../modules/writers/writers.module';
import { ImportService } from './imports.service';

@Module({
  imports: [SongsModule, ArtistsModule, WritersModule, AlbumsModule],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
