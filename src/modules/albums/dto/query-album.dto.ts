import { InputType } from '@nestjs/graphql';

import { QueryPaginationBaseDto } from '../../../utils';

@InputType()
export class QueryAlbumDto extends QueryPaginationBaseDto {}
