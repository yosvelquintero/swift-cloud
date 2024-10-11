import { Field, ID, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

@InputType()
export class ParamBaseDto {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  id: string;
}
