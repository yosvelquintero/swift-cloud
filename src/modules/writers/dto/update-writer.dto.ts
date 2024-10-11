import { InputType, PartialType } from '@nestjs/graphql';

import { CreateWriterDto } from './create-writer.dto';

@InputType()
export class UpdateWriterDto extends PartialType(CreateWriterDto) {}
