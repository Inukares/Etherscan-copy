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
};

export const fetchLogsWithBlocks = async ({
  provider,
  contractAddress,
  minLogsCount,
  collectedLogs,
  collectedBlocksMap,
  topics = [TRANSFER_HASH, null, null],
  blocksRange,
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

  const blockPromises: Promise<ethers.providers.Block>[] = [];
  for (const blockNumber of uniqueBlocks) {
    blockPromises.push(provider.getBlock(blockNumber));
  }

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
      collectedLogs: combinedLogs,
      collectedBlocksMap: combinedBlocksMap,
      blocksRange: newBlocksRange,
      topics,
    });
  }

  return { logs: combinedLogs, blocks: blocksMap };
};

/**
 * There's no way to know how many logs are there for specific set of topics
 * That requires to implement some kind of pagination. Below are listed options:
 * 1) Get block one by one and fetch logs up until minimum amount of logs is collected
 * 2) Get X range of blocks and if those don't return enough logs, rerun query
 *
 * Both options need to support cases when there are less logs collected than provided in function's query
 * 1* Could have retryPolicy basing on provider's rules. That still doesn't do the job well, as involves a ginormous amount of calls
 * 2* After some trial-and-error I noticed that on average each blocks emits around 2-3 logs. That means that If I want to get 100 logs, requesting 50 should do the job, but just to avoid
 * // additional requests I'll pick get 70. Custom incremental mechanism could be put in place, like exponentially growing range of blocks to connect logs from, etc.
 *
 *
 */

//  type FetchLogsParams = {
//   blockNumber: number;
//   provider: Web3Provider;
//   contractAddress: string;
//   minLogsCount: number;
//   collectedLogs: Array<Log>;
//   collectedBlocksMap: BlocksMap;
//   parallelRequests: number;
//   from?: string;
//   to?: string;
// };

// TODO: Add caching so that requests to get the same block are retrieved from cache
// export const fetchLogsWithBlocks = async ({
//   blockNumber,
//   provider,
//   contractAddress,
//   minLogsCount,
//   collectedLogs,
//   parallelRequests,
//   collectedBlocksMap,
//   from,
//   to,
// }: FetchLogsParams): Promise<{ logs: Array<Log>; blocks: BlocksMap }> => {
//   if (blockNumber <= 0) {
//     return { logs: collectedLogs, blocks: collectedBlocksMap };
//   }

//   const promises = [];
//   let blockIdx = blockNumber;
//   let filter = [TRANSFER_HASH];
//   if (from) filter.push(ethers.utils.hexZeroPad(from, 32));
//   if (to) filter.push(ethers.utils.hexZeroPad(to, 32));
//   console.log(filter);
//   const test = await provider.getLogs({
//     address: contractAddress,
//     toBlock: blockIdx,
//     fromBlock: blockIdx - 1000,
//   });
//   console.log(test);

//   for (let i = 0; i < parallelRequests; i++) {
//     promises.push(
//       provider.getLogs({
//         address: contractAddress,
//         fromBlock: blockIdx,
//         toBlock: blockIdx,
//         topics: filter,
//       })
//     );
//     blockIdx -= 1;
//   }

//   const blockPromises: Promise<ethers.providers.Block>[] = [];

//   const rawLogs = await Promise.allSettled(promises).then((responses) => {
//     return responses.reduce((acc, response) => {
//       if (response.status === 'rejected') {
//         // console.warn('Failed to fatch log!::', response);
//         // TODO: Throw too many requests, please try again in:
//         debugger;
//         console.log(response.reason);
//         throw new Error('Fail!');
//       }
//       // If block has any Transfer logs fetch it to get timestamp
//       // other possible solution would be to always fetch blocks alongside logs, but this way
//       // I'm reducing fetches amount to the absolute minimum, by making call only when logs are present
//       if (response.value.length > 0) {
//         blockPromises.push(provider.getBlock(response.value[0].blockNumber));
//       }

//       return [...acc, ...response.value];
//     }, [] as Log[]);
//   });

//   // blocks structure
//   // {158205: {...blockStuff}, 123141: {}}
//   const blocksMap = await Promise.allSettled(blockPromises).then(
//     (responses) => {
//       return responses.reduce((acc, response) => {
//         if (response.status === 'rejected') {
//           console.warn('Failed to fetch block!', response);
//           return acc;
//         }

//         acc[response.value.number] = { ...response.value };
//         return acc;
//       }, {} as Record<string, ethers.providers.Block>);
//     }
//   );
//   const combinedLogs = [...collectedLogs, ...rawLogs];
//   const combinedBlocksMap = { ...blocksMap, ...collectedBlocksMap };

//   if (combinedLogs.length < minLogsCount) {
//     return await fetchLogsWithBlocks({
//       blockNumber: blockIdx,
//       provider,
//       contractAddress,
//       minLogsCount,
//       collectedLogs: combinedLogs,
//       collectedBlocksMap: combinedBlocksMap,
//       parallelRequests,
//       from,
//       to,
//     });
//   }
//   return { logs: combinedLogs, blocks: combinedBlocksMap };
// };
