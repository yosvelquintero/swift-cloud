import { Module } from '@nestjs/common';

import { AlbumsModule } from '@app/modules/albums/albums.module';
import { ArtistsModule } from '@app/modules/artists/artists.module';
import { SongsModule } from '@app/modules/songs/songs.module';
import { WritersModule } from '@app/modules/writers/writers.module';

import { ImportService } from './imports.service';

@Module({
  imports: [SongsModule, ArtistsModule, WritersModule, AlbumsModule],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
