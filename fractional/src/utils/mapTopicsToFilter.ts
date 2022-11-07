import { ethers } from 'ethers';
import { Topics } from '../shared/types';

export const mapTopicsToFilter = (topics: Topics): Array<string | null> => {
  const [transfer_hash, from, to] = topics;
  const filter = [transfer_hash];
  if (typeof from === 'string' && from)
    filter.push(ethers.utils.hexZeroPad(from, 32));
  if (typeof to === 'string' && to)
    filter.push(ethers.utils.hexZeroPad(to, 32));
  return filter;
};
