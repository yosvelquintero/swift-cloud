import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({
    description: 'Name of the artist',
    example: 'Taylor Swift',
  })
  @IsString()
  readonly name: string;
}
