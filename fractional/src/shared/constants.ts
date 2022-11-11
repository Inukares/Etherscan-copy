import { ethers } from 'ethers';

export const TRANSFER_HASH: string = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('Transfer(address,address,uint256)')
);

export const contractAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';

export const ETHERSCAN_TX_URL = 'https://etherscan.io/tx/';

export const MIN_LOGS = 10;
export const BLOCK_ITERATOR = Math.round(MIN_LOGS * 0.8); // on average block has around 2-3 logs, hence this range should suffice for getting enough logs wanted in one call
export const TRANSFERS_TO_SHOW = MIN_LOGS;
