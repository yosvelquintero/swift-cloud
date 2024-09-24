import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class ParamYearSongDto {
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
