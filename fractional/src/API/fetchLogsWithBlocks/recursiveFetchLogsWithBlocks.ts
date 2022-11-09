import { Log } from '@ethersproject/providers';
import { TRANSFER_HASH } from '../../shared/constants';
import { BlocksMap } from '../../shared/types';
import { getSanitizedParams } from '../../utils/getSanitizedParams';
import { isNumber } from '../../utils/isNumber';
import { FetchLogsParams, fetchLogsWithBlocks } from './fetchLogsWithBlocks';

export const recursiveFetchLogsWithBlocks = async ({
  provider,
  contractAddress,
  minLogsCount,
  collectedLogs,
  collectedBlocksMap,
  topics = [TRANSFER_HASH, null, null],
  blockRange,
  promiseQueue,
}: FetchLogsParams): Promise<{ logs: Array<Log>; blocks: BlocksMap }> => {
  const { fromBlock, toBlock, filter } = getSanitizedParams({
    address: contractAddress,
    topics,
    blockRange,
  });

  // looped through all of the blocks up to genesis block
  if (isNumber(toBlock) && toBlock <= 0) {
    return { logs: collectedLogs, blocks: collectedBlocksMap };
  }

  const { blocksMap, logs } = await fetchLogsWithBlocks({
    provider,
    filter,
    promiseQueue,
  });

  // when there is no range provided it's not possible to determine iterating logic
  // could be refactored to allow custom iteration logic
  if (!isNumber(fromBlock) || !isNumber(toBlock)) {
    return { logs, blocks: blocksMap };
  }
  const combinedLogs = [...collectedLogs, ...logs];
  const combinedBlocksMap = { ...blocksMap, ...collectedBlocksMap };
  // latter condition prevents infinite loop
  if (combinedLogs.length < (minLogsCount ?? 0) && fromBlock !== toBlock) {
    // start iterating at the last element with the same range initially specified.
    // could be refactored to a custom function, for instance allowing exponentially growing range
    const newBlockRange = {
      toBlock: fromBlock,
      fromBlock: fromBlock - (toBlock - fromBlock),
    };
    return await recursiveFetchLogsWithBlocks({
      provider,
      contractAddress,
      minLogsCount,
      promiseQueue,
      collectedLogs: combinedLogs,
      collectedBlocksMap: combinedBlocksMap,
      blockRange: newBlockRange,
      topics,
    });
  }

  return { logs: combinedLogs, blocks: combinedBlocksMap };
};
