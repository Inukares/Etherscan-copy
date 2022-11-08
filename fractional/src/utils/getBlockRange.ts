import { BLOCK_ITERATOR } from '../shared/constants';

export const getBlockRange = (latest: number): number =>
  latest - BLOCK_ITERATOR;
