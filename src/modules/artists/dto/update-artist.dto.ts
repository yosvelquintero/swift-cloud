import { InputType, PartialType } from '@nestjs/graphql';

import { CreateArtistDto } from './create-artist.dto';

@InputType()
export class UpdateArtistDto extends PartialType(CreateArtistDto) {}
