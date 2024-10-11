import { InputType, PartialType } from '@nestjs/graphql';

import { CreateAlbumDto } from './create-album.dto';

@InputType()
export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}
