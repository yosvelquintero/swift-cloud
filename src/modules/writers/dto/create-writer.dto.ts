import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWriterDto {
  @ApiProperty({
    description: 'Name of the writer',
    example: 'Liz Rose',
  })
  @IsString()
  name: string;
}
