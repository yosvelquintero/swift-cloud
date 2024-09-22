import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class PlayDto {
  @ApiProperty({
    description: 'First day of the month',
    example: '2023-06-01T00:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  month: Date;

  @ApiProperty({
    description: 'Play count for the month',
    example: 100,
  })
  @IsInt()
  @Min(0)
  count: number;
}

export class CreateSongDto {
  @ApiProperty({
    description: 'Title of the song',
    example: 'All Too Well',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Array of album IDs',
    type: [String],
    example: ['60d21b4667d0d8992e610c88'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  albumIds: string[];

  @ApiProperty({
    description: 'Array of artist IDs',
    type: [String],
    example: ['60d21b4667d0d8992e610c85'],
  })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  artistIds: string[];

  @ApiProperty({
    description: 'Array of featuring artist IDs',
    type: [String],
    example: ['60d21b4667d0d8992e610c86'],
  })
  @IsArray()
  @IsOptional()
  featuringArtistIds: string[];

  @ApiProperty({
    description: 'Array of writer IDs',
    type: [String],
    example: ['60d21b4667d0d8992e610c87'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  writerIds: string[];

  @ApiProperty({
    description: 'Release year',
    example: 2012,
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @ApiProperty({
    description: 'Array of play data',
    type: [PlayDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayDto)
  @IsOptional()
  plays: PlayDto[];
}
