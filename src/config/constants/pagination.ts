import { DeepReadonly } from 'ts-essentials';

import { IPagination } from '../../types';

export const PAGINATION: DeepReadonly<IPagination> = {
  limit: 10,
  field: 'created',
};
