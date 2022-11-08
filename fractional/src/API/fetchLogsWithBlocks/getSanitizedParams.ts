import { Filter } from '@ethersproject/providers';
import { Topics } from '../../shared/types';
import { isNumber } from '../../utils/isNumber';

export const getSanitizedParams = ({
  address,
  topics,
  blockRange,
}: {
  address: string;
  topics: Topics;
  blockRange?: {
    fromBlock?: number;
    toBlock?: number;
  };
}) => {
  const filter: Filter = { address, topics };
  let blockRangeCopy;
  if (typeof blockRange === 'object') {
    blockRangeCopy = { ...blockRange };
  }

  let fromBlock = blockRangeCopy?.fromBlock;
  let toBlock = blockRangeCopy?.toBlock;
  if (isNumber(toBlock)) {
    filter.toBlock = toBlock;
  }

  if (isNumber(fromBlock)) {
    if (fromBlock < 0) {
      fromBlock = 0;
    }
    filter.fromBlock = fromBlock;
  }
  return { filter, fromBlock, toBlock };
};
