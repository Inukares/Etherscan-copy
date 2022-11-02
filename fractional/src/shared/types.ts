import { ethers } from 'ethers';
import DAIABI from '../utils/DAIABI.json';

// FIXME: this type could be retrieved from ethers, but can't recall where it is
export type ABI = typeof DAIABI;

export type BlocksMap = Record<string, ethers.providers.Block>;

export type Transfer = {
  to: string;
  from: string;
  value: string;
  txHash: string;
  timestamp: number | null;
};
