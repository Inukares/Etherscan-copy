import PQueue from 'p-queue';
import { QueueAddOptions } from 'p-queue';
import PriorityQueue from 'p-queue/dist/priority-queue';
import { TRANSFER_HASH } from './../../shared/constants';
import { Log, Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { BlocksMap } from '../../shared/types';

export const mapTopicsToFilter = (
  topics: Array<string | null>
): Array<string | null> => {
  const [transfer_hash, from, to] = topics;
  const filter = [transfer_hash];
  if (typeof from === 'string' && from)
    filter.push(ethers.utils.hexZeroPad(from, 32));
  if (typeof to === 'string' && to)
    filter.push(ethers.utils.hexZeroPad(to, 32));
  return filter;
};

type FetchLogsParams = {
  provider: Web3Provider;
  contractAddress: string;
  minLogsCount: number;
  collectedLogs: Array<Log>;
  collectedBlocksMap: BlocksMap;
  topics: Array<string | null>;
  blocksRange: { fromBlock: number; toBlock: number };
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
 *
 *
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
  let { fromBlock, toBlock } = blocksRange;
  if (toBlock <= 0) {
    return { logs: collectedLogs, blocks: collectedBlocksMap };
  }
  if (fromBlock < 0) fromBlock = 0;

  const filter = { address: contractAddress, fromBlock, toBlock, topics };
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
  // wait for all the blocks to be fetched
  await promiseQueue.onIdle();

  const combinedLogs = [...collectedLogs, ...logs];
  const combinedBlocksMap = { ...blocksMap, ...collectedBlocksMap };
  // latter condition prevents infinite loop
  if (combinedLogs.length < minLogsCount && fromBlock !== toBlock) {
    // start iterating at the last element with the same range initially specified.
    // could be refactored to a custom function, for instance allowing exponentially growing range
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
