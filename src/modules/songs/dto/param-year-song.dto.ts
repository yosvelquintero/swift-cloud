import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

@InputType()
export class ParamYearSongDto {
  @Field(() => Int)
  @ApiProperty({
    description: 'Year of the song',
    example: 2017,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;
}
