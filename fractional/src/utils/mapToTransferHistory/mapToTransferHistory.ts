import { BlocksMap } from './../types';
import { Log } from '@ethersproject/providers';
import { ContractInterface, ethers } from 'ethers';
import { ABI } from '../types';

const expected = [
  {
    to: 'somebody',
    from: 'someone else',
    value: 5,
    address: '0x241231231',
    timestamp: 13213213,
  },
];

export const parseLog = (contract: ethers.Contract, log: Log) => {
  return contract.interface.parseLog(log);
};

type Transfer = {
  to: string;
  from: string;
  value: number;
  address: string;
  timestamp: number;
};

const mapper = (
  log: Log,
  parsedLog: ethers.utils.LogDescription,
  blocksMap: BlocksMap
) => ({
  timestamp: blocksMap[log.blockNumber].timestamp,
  address: log.address,
  from: parsedLog.args[0],
  to: parsedLog.args[1],
  value: parsedLog.args[2].hex,
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
    const transfer: Transfer = {
      to: '',
      from: '',
      value: 0,
      address: '',
      timestamp: 0,
    };
    console.log(blocksMap);
    console.log(log.blockNumber);
    transfer.timestamp = blocksMap[log.blockNumber]?.timestamp ?? null;
    transfer.address = log.address;
    console.log(parsedLog);
    transfer.from = parsedLog.args[0];
    transfer.to = parsedLog.args[1];
    transfer.value = parsedLog.args[2].toString();
    // transfer.to = parsedLog.eventFragment.inputs
    return transfer;
  });
  return transfers;
};
