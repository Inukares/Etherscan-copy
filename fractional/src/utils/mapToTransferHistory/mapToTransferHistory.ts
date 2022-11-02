import { BlocksMap, Transfer } from '../../shared/types';
import { Log } from '@ethersproject/providers';
import { ContractInterface, ethers } from 'ethers';

export const parseLog = (contract: ethers.Contract, log: Log) => {
  return contract.interface.parseLog(log);
};

const mapper = (
  log: Log,
  parsedLog: ethers.utils.LogDescription,
  blocksMap: BlocksMap
): Transfer => ({
  timestamp: blocksMap[log.blockNumber]?.timestamp ?? null,
  txHash: log.transactionHash,
  from: parsedLog.args[0],
  to: parsedLog.args[1],
  value: ethers.utils.formatEther(parsedLog.args[2]),
});

export const mapToTransferHistory = (
  logs: Log[],
  blocksMap: BlocksMap,
  contractAddress: string,
  ABI: ContractInterface
): Transfer[] => {
  const contract = new ethers.Contract(contractAddress, ABI);
  const transfers = logs.map((log) => {
    const parsedLog = parseLog(contract, log);
    return mapper(log, parsedLog, blocksMap);
  });
  return transfers;
};
