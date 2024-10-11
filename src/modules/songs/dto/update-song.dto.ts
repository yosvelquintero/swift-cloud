import { InputType, PartialType } from '@nestjs/graphql';

import { CreateSongDto } from './create-song.dto';

@InputType()
export class UpdateSongDto extends PartialType(CreateSongDto) {}
