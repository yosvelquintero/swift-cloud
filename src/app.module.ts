import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ENV } from './config/constants';
import { AlbumsModule } from './modules/albums/albums.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { ImportModule } from './modules/imports/import.module';
import { SongsModule } from './modules/songs/songs.module';
import { WritersModule } from './modules/writers/writers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(ENV.database.mongodb.mongodbUri),
        autoIndex: true,
      }),
    }),
    AlbumsModule,
    SongsModule,
    ArtistsModule,
    WritersModule,
    ImportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
