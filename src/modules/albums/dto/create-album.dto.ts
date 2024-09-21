import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({
    description: 'Title of the album',
    example: 'Red',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Array of artist IDs',
    type: [String],
    example: ['60d21b4667d0d8992e610c85'],
  })
  @IsArray()
  @IsOptional()
  artists?: string[];

  @ApiProperty({
    description: 'Array of song IDs',
    type: [String],
    example: ['60d21b4667d0d8992e610c86'],
  })
  @IsArray()
  @IsOptional()
  songs?: string[];

  @ApiProperty({
    description: 'Release year',
    example: 2012,
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;
}
