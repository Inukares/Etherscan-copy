import { isAddressValid } from '../isAddressValid';
import { ethers } from 'ethers';

export const mapTopicsToFilter = (
  topics: Array<string | null | undefined>
): Array<string | null> => {
  const transfer_hash = topics[0] || null;
  const from = topics[1] || null;
  const to = topics[2] || null;
  const filter = [transfer_hash];
  if (isAddressValid(from)) {
    filter.push(ethers.utils.hexZeroPad(from as string, 32));
  }
  if (isAddressValid(to)) {
    filter.push(ethers.utils.hexZeroPad(to as string, 32));
  }
  return filter;
};
