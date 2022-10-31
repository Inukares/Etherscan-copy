import { Log, Web3Provider } from '@ethersproject/providers';
import DAIABI from '../DAIABI.json';
import { LogDescription } from 'ethers/lib/utils';
import { ethers, providers } from 'ethers';
import { TRANSFER_HASH } from '../constants';

type ABI = typeof DAIABI;

export const parseLogs = (contractAddress: string, ABI: ABI, logs: Log[]) => {
  const contract = new ethers.Contract(contractAddress, ABI);
  return logs.map((log) => contract.interface.parseLog(log));
};

export const parseLog = (contract: ethers.Contract, log: Log) => {
  return contract.interface.parseLog(log);
};

type BlocksMap = Record<string, ethers.providers.Block>;

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
export const fetchLogs = async ({
  blockNumber,
  provider,
  contractAddress,
  minLogsCount,
  collectedLogs,
  parallelRequests,
  collectedBlocksMap,
}: FetchLogsParams): Promise<{ logs: Array<Log>; blocks: BlocksMap }> => {
  console.log('running again!');
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
      console.log(responses);
      debugger;
      if (response.status === 'rejected') return acc;
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
        if (response.status === 'rejected') return acc;
        console.log('val', response.value);

        acc[response.value.number] = { ...response.value };
        return acc;
      }, {} as Record<string, ethers.providers.Block>);
    }
  );
  console.log(blocksMap);
  const combinedLogs = [...collectedLogs, ...rawLogs];
  const combinedBlocksMap = { ...blocksMap, ...collectedBlocksMap };

  if (combinedLogs.length < minLogsCount) {
    return await fetchLogs({
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

// needed to get timestamp for transaction as RPC doesn't give that information from log ot of the box
// export const _fetchBlocksForLogs = async (
//   provider: Web3Provider,
//   logs: Log[]
// ) => {
//   const promises = [];
//   logs.map((log) => {
//     log.transactionHash;
//   });
// };

// one block can have multiple logs. no need to fetch blocks with no transfer events.
// { '0x25' : { blockDescription: ..., logDescription:  }}
// OR:
// { from,to,address, etc, timestamp:  } AND these i get from both LogDescription and blocks retrieed from above structure
// that way I have single source of truth for all the stuff needed via single intrface for UI AND data parsed

// // @ts-ignore
// export const fetchLogs: FetchLogs = async ({
//   blockNumber,
//   provider,
//   contractAddress,
//   ABI,
//   minLogsCount,
//   collectedTransactions,
//   parallelRequests,
// }) => {
//   console.log('running again!');
//   if (blockNumber <= 0) return collectedTransactions;
//   const contract = new ethers.Contract(contractAddress, ABI);

//   const promises = [];

//   let blockIdx = blockNumber;
//   for (let i = 0; i < parallelRequests; i++) {
//     promises.push(
//       provider.getLogs({
//         address: contractAddress,
//         fromBlock: blockIdx,
//         toBlock: blockIdx,
//         topics: [TRANSFER_HASH],
//       })
//     );
//     blockIdx -= 1;
//   }

//   const blockPromises: any[] = [];

//   const rawLogs = await Promise.allSettled(promises).then((responses) => {
//     return responses.reduce((acc, response) => {
//       if (response.status === 'rejected') return acc;

//       return [...acc, ...response.value];
//     }, [] as Log[]);
//   });

//   const parsedLogs = rawLogs.map((log) => parseLog(contract, log));

//   // but gives much better UX for the user as he gets results much faster
//   const parsedTransactions = await Promise.allSettled(promises).then(
//     (responses) => {
//       return responses.reduce((acc, response) => {
//         if (response.status === 'rejected') return acc;

//         // for every 'Transfer' event, fetch block in order to retrieve timestamp of transfer
//         // rpc doesn't return this information by default
//         response.value.map((log) =>
//           blockPromises.push(provider.getBlock(log.blockHash))
//         );

//         const parsedLogs = response.value.map((log) => parseLog(contract, log));

//         return [...acc, ...parsedLogs];
//       }, [] as Array<LogDescription>);
//     }
//   );
//   // console.log(parsedTransactions);
//   const blocks = await Promise.allSettled(blockPromises).then((responses) =>
//     responses.filter((response) => response.status === 'fulfilled')
//   );

//   if (parsedTransactions.length < minLogsCount)
//     return await fetchLogs({
//       blockNumber: blockIdx,
//       provider,
//       contractAddress,
//       ABI,
//       minLogsCount,
//       collectedTransactions: [...collectedTransactions, ...parsedTransactions],
//       parallelRequests,
//     });

//   return [parsedTransactions, blocks];
// };
