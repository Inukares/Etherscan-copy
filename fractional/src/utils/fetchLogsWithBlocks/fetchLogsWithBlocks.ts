import { Log, Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { TRANSFER_HASH } from '../../shared/constants';
import { BlocksMap } from '../../shared/types';

type FetchLogsParams = {
  blockNumber: number;
  provider: Web3Provider;
  contractAddress: string;
  minLogsCount: number;
  collectedLogs: Array<Log>;
  collectedBlocksMap: BlocksMap;
  parallelRequests: number;
};

// TODO: Add caching so that requests to get the same block are retrieved from cache
export const fetchLogsWithBlocks = async ({
  blockNumber,
  provider,
  contractAddress,
  minLogsCount,
  collectedLogs,
  parallelRequests,
  collectedBlocksMap,
}: FetchLogsParams): Promise<{ logs: Array<Log>; blocks: BlocksMap }> => {
  if (blockNumber <= 0) {
    return { logs: collectedLogs, blocks: collectedBlocksMap };
  }

  const promises = [];
  let blockIdx = blockNumber;

  for (let i = 0; i < parallelRequests; i++) {
    promises.push(
      provider.getLogs({
        address: contractAddress,
        fromBlock: blockIdx,
        toBlock: blockIdx,
        topics: [TRANSFER_HASH],
      })
    );
    blockIdx -= 1;
  }

  const blockPromises: Promise<ethers.providers.Block>[] = [];

  const rawLogs = await Promise.allSettled(promises).then((responses) => {
    return responses.reduce((acc, response) => {
      if (response.status === 'rejected') {
        console.warn('Failed to fatch log!::', response);
        return acc;
      }
      // If block has any Transfer logs fetch it to get timestamp
      // other possible solution would be to always fetch blocks alongside logs, but this way
      // I'm reducing fetches amount to the absolute minimum, by making call only when logs are present
      if (response.value.length > 0) {
        blockPromises.push(provider.getBlock(response.value[0].blockNumber));
      }

      return [...acc, ...response.value];
    }, [] as Log[]);
  });

  // blocks structure
  // {158205: {...blockStuff}, 123141: {}}
  const blocksMap = await Promise.allSettled(blockPromises).then(
    (responses) => {
      return responses.reduce((acc, response) => {
        if (response.status === 'rejected') {
          console.warn('Failed to fetch block!', response);
          return acc;
        }

        acc[response.value.number] = { ...response.value };
        return acc;
      }, {} as Record<string, ethers.providers.Block>);
    }
  );
  const combinedLogs = [...collectedLogs, ...rawLogs];
  const combinedBlocksMap = { ...blocksMap, ...collectedBlocksMap };

  if (combinedLogs.length < minLogsCount) {
    return await fetchLogsWithBlocks({
      blockNumber: blockIdx,
      provider,
      contractAddress,
      minLogsCount,
      collectedLogs: combinedLogs,
      collectedBlocksMap: combinedBlocksMap,
      parallelRequests,
    });
  }
  return { logs: combinedLogs, blocks: combinedBlocksMap };
};
