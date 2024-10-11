import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@InputType()
export class CreateArtistDto {
  @Field(() => String)
  @ApiProperty({
    description: 'Name of the artist',
    example: 'Taylor Swift',
  })
  @IsString()
  readonly name: string;
}
