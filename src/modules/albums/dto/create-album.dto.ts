import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class CreateAlbumDto {
  @Field(() => String)
  @ApiProperty({
    description: 'Title of the album',
    example: 'Red',
  })
  @IsString()
  title: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  @ApiProperty({
    description: 'Array of artist IDs',
    type: [String],
    example: ['60d21b4667d0d8992e610c85'],
  })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  artistIds?: string[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  @ApiProperty({
    description: 'Array of song IDs',
    type: [String],
    example: ['60d21b4667d0d8992e610c86'],
  })
  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  songIds?: string[];

  @Field(() => Int)
  @ApiProperty({
    description: 'Release year',
    example: 2012,
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;
}
