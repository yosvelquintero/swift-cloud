import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArtistsController } from './artists.controller';
import { ArtistsRepository } from './artists.repository';
import { ArtistsResolver } from './artists.resolver';
import { ArtistsService } from './artists.service';
import { Artist, ArtistSchema } from './entities/artist.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService, ArtistsResolver, ArtistsRepository],
  exports: [ArtistsService],
})
export class ArtistsModule {}
