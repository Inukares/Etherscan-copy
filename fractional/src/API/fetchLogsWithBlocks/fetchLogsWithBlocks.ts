import PQueue from 'p-queue';
import { QueueAddOptions } from 'p-queue';
import PriorityQueue from 'p-queue/dist/priority-queue';
import { Log, Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { BlocksMap, Topics } from '../../shared/types';

export type FetchLogsParams = {
  provider: Web3Provider;
  contractAddress: string;
  minLogsCount?: number;
  collectedLogs: Array<Log>;
  collectedBlocksMap: BlocksMap;
  topics: Topics;
  blockRange?: { fromBlock?: number; toBlock?: number };
  promiseQueue: PQueue<PriorityQueue, QueueAddOptions>;
};

/**
 * There's no way to know how many logs are there for specific filter
 * That enforces implementing pagination of some sort in order to get desired amount of logs.
 * Possible options are:
 * 1) Get block one by one and fetch logs up until minimum amount of logs is collected
 * 2) Get logs from a range of blocks and if response doesn't containt min amount, recurisvely fetch more logs, but this time starting at the end of last iteration.
 *
 * Below function favors 2nd approach as it is much faster and can easily incorporate additional logic for iterations and failures. Actual implementation should
 * be based on desired UX.
 * */
export const fetchLogsWithBlocks = async ({
  provider,
  promiseQueue,
  filter,
}: {
  provider: Web3Provider;
  promiseQueue: PQueue<PriorityQueue, QueueAddOptions>;
  filter: ethers.providers.Filter;
}) => {
  const logs = await provider.getLogs(filter);
  const uniqueBlocks = new Set<number>();
  for (let i = 0; i < logs.length; i++) {
    uniqueBlocks.add(logs[i].blockNumber);
  }

  const blocksMap: Record<string, ethers.providers.Block> = {};
  for (const blockNumber of uniqueBlocks) {
    promiseQueue.add(async () => {
      let block;
      try {
        block = await provider.getBlock(blockNumber);
        blocksMap[block.number] = { ...block };
        // ignore missed blocks and simply not display timestamp.
      } catch (error) {
        console.error('Failed to fetch block!:', error);
      }
    });
  }
  // wait for all the blocks to be fetched
  await promiseQueue.onIdle();

  return { logs, blocksMap };
};
