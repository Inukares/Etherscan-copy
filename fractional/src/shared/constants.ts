import { ethers } from 'ethers';

export const REQUESTS_IN_PARALLEL: number = 50;

export const TRANSFER_HASH: string = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('Transfer(address,address,uint256)')
);

export const contractAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
