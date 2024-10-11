import { InputType } from '@nestjs/graphql';

import { ParamBaseDto } from '@app/utils';

@InputType()
export class ParamWriterDto extends ParamBaseDto {}
