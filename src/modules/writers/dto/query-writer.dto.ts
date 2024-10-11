import { InputType } from '@nestjs/graphql';

import { QueryPaginationBaseDto } from '@app/utils';

@InputType()
export class QueryWriterDto extends QueryPaginationBaseDto {}
