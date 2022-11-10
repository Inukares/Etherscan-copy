import { ethers } from 'ethers';

export const mapTopicsToFilter = (
  topics: Array<string | null | undefined>
): Array<string | null> => {
  const transfer_hash = topics[0] || null;
  const from = topics[1] || null;
  const to = topics[2] || null;
  const filter = [transfer_hash];
  if (typeof from === 'string' && from)
    filter.push(ethers.utils.hexZeroPad(from, 32));
  if (typeof to === 'string' && to)
    filter.push(ethers.utils.hexZeroPad(to, 32));
  return filter;
};
