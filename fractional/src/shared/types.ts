import { ethers } from 'ethers';

export type BlocksMap = Record<string, ethers.providers.Block>;

export type Transfer = {
  to: string;
  from: string;
  value: string;
  txHash: string;
  timestamp: number | null;
};

export type Topics = Array<string | null>;
