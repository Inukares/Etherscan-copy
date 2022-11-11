import { ethers } from 'ethers';

export const isAddressValid = (address: string | null) =>
  typeof address === 'string' && ethers.utils.isAddress(address);
