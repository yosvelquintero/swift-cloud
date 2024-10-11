import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

@InputType()
export class CreateWriterDto {
  @Field(() => String)
  @ApiProperty({
    description: 'Name of the writer',
    example: 'Taylor Swift',
  })
  @IsString()
  name: string;
}
