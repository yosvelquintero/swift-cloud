import { DeepReadonly } from 'ts-essentials';

import { IPagination } from '@app/types';

export const PAGINATION: DeepReadonly<IPagination> = {
  limit: 10,
  field: 'created',
};
