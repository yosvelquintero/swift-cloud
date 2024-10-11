import { InputType } from '@nestjs/graphql';

import { QueryPaginationBaseDto } from '../../../utils';

@InputType()
export class QuerySongDto extends QueryPaginationBaseDto {}
