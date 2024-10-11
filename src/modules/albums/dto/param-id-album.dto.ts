import { InputType } from '@nestjs/graphql';

import { ParamBaseDto } from '../../../utils';

@InputType()
export class ParamAlbumDto extends ParamBaseDto {}
