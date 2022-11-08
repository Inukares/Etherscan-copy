import PQueue from 'p-queue';
import { QueueAddOptions } from 'p-queue';
import PriorityQueue from 'p-queue/dist/priority-queue';
import { TRANSFER_HASH } from '../../shared/constants';
import { Log, Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { BlocksMap, Topics } from '../../shared/types';
import { isNumber } from '../../utils/isNumber';
import { getSanitizedParams } from './getSanitizedParams';

export type FetchLogsParams = {
  provider: Web3Provider;
  contractAddress: string;
  minLogsCount: number;
  collectedLogs: Array<Log>;
  collectedBlocksMap: BlocksMap;
  topics: Topics;
  blocksRange?: { fromBlock?: number; toBlock?: number };
  promiseQueue: PQueue<PriorityQueue, QueueAddOptions>;
};

/**
 * There's no way to know how many logs are there for specific filter
 * That enforces implementing pagination of some sort in order to get desired amount of logs.
 * Possible options are:
 * 1) Get block one by one and fetch logs up until minimum amount of logs is collected
 * 2) Get logs from a range of blocks and if response doesn't containt min amount, recurisvely fetch logs but this time starting at the end of last iteration.
 *
 * Below function favors 2nd approach as it is much faster and can easily incorporate additional logic for iterations and failures
 * */

export const fetchLogsWithBlocks = async ({
  provider,
  contractAddress,
  minLogsCount,
  collectedLogs,
  collectedBlocksMap,
  topics = [TRANSFER_HASH, null, null],
  blocksRange,
  promiseQueue,
}: FetchLogsParams): Promise<{ logs: Array<Log>; blocks: BlocksMap }> => {
  const { fromBlock, toBlock, filter } = getSanitizedParams({
    address: contractAddress,
    topics,
    blockRange: blocksRange,
  });

  // looped through all of the blocks up to genesis block
  if (isNumber(toBlock) && toBlock <= 0) {
    return { logs: collectedLogs, blocks: collectedBlocksMap };
  }

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
      } catch (error) {
        console.error('Failed to fetch block!:', error);
      }
    });
  }
  console.log(blocksMap);
  // wait for all the blocks to be fetched
  await promiseQueue.onIdle();

  debugger;
  // when there is no range provided it's not possible to determine iterating logic
  // could be refactored to allow custom iteration logic
  if (!isNumber(fromBlock) || !isNumber(toBlock)) {
    return { logs, blocks: blocksMap };
  }
  const combinedLogs = [...collectedLogs, ...logs];
  const combinedBlocksMap = { ...blocksMap, ...collectedBlocksMap };
  debugger;
  // latter condition prevents infinite loop
  if (combinedLogs.length < minLogsCount && fromBlock !== toBlock) {
    // start iterating at the last element with the same range initially specified.
    // could be refactored to a custom function, for instance allowing exponentially growing range
    debugger;
    const newBlocksRange = {
      toBlock: fromBlock,
      fromBlock: fromBlock - (toBlock - fromBlock),
    };
    return await fetchLogsWithBlocks({
      provider,
      contractAddress,
      minLogsCount,
      promiseQueue,
      collectedLogs: combinedLogs,
      collectedBlocksMap: combinedBlocksMap,
      blocksRange: newBlocksRange,
      topics,
    });
  }

  return { logs: combinedLogs, blocks: combinedBlocksMap };
};
