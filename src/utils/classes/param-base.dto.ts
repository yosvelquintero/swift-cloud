import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ParamBaseDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  id: string;
}
