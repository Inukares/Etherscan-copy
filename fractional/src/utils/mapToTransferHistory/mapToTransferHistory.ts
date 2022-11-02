import { BlocksMap } from './../types';
import { Log } from '@ethersproject/providers';
import { ContractInterface, ethers } from 'ethers';

export const parseLog = (contract: ethers.Contract, log: Log) => {
  return contract.interface.parseLog(log);
};

export type Transfer = {
  to: string;
  from: string;
  value: number;
  address: string;
  timestamp: number | null;
};

const mapper = (
  log: Log,
  parsedLog: ethers.utils.LogDescription,
  blocksMap: BlocksMap
) => ({
  timestamp: blocksMap[log.blockNumber]?.timestamp ?? null,
  address: log.address,
  from: parsedLog.args[0],
  to: parsedLog.args[1],
  value: ethers.utils.formatEther(parsedLog.args[2]),
});

export const mapToTransferHistory = (
  logs: Log[],
  blocksMap: BlocksMap,
  contractAddress: string,
  ABI: ContractInterface
): any => {
  const contract = new ethers.Contract(contractAddress, ABI);
  const transfers = logs.map((log) => {
    const parsedLog = parseLog(contract, log);
    return mapper(log, parsedLog, blocksMap);
  });
  return transfers;
};
