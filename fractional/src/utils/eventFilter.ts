import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { formatBytes32String } from 'ethers/lib/utils';

export type IERC20 = {
  symbol: string;
  address: string;
  decimals: number;
  name: string;
  abi: any;
};

/**
 * Get recent block number
 * Fetch logs of current blockNumber. If it's DAI:
 * a) fetch details of block to get timestamp and other info** (I think)
 * b) push to logs and decrease blockNumber and respnsesNu
 * -
 * If its not DAI -> decrease blockNumber, but keep num of responses.
 * Decode logs using DAI ABI
 *
 *
 */

// export const eventFilterv5WithPagination = async (
//   contractAddress: string,
//   erc20abi: any, // TODO: improve
//   provider: Web3Provider,
//   numberOfResponses: number
// ) => {
//   // creating the interface of the ABI
//   const iface = new ethers.utils.Interface(erc20abi);

//   // intialize array for the logs
//   let logs: any[] = [];
//   // get latest block number
//   const latest = await provider.getBlockNumber();
//   // intialize a counter for which block we're scraping starting at the most recent block
//   let blockNumberIndex = latest;

//   // while loop runs until there are as many responses as desired
//   while (logs.length < numberOfResponses && blockNumberIndex > 0) {
//     const blocks = await provider.getBlock(blockNumberIndex);

//     // blocks.§
//     // blockNumberIndex -= 1;
//     // const tempLogs = await provider.getBlock({
//     //   address: contractAddress,
//     //   // both fromBlock and toBlock are the index, meaning only one block's logs are pulled
//     //   fromBlock: blockNumberIndex,
//     //   toBlock: blockNumberIndex,
//     // });
//     // an added console.log to help see what's going on
//     // console.log(
//     //   'BLOCK: ',
//     //   blockNumberIndex,
//     //   ' NUMBER OF LOGS: ',
//     //   tempLogs.length
//     // );
//     // blockNumberIndex -= 1;
//     // logs = logs && logs.length > 0 ? [...logs, ...tempLogs] : [...tempLogs];
//   }

//   // this will return an array with the decoded events
//   const decodedEvents = logs.map((log) => {
//     return iface.decodeEventLog('Transfer', log.data);
//   });
//   console.log(decodedEvents);

//   // debugger;
//   // let's pull out the to and from addresses and amounts
//   // @ts-ignore
//   const toAddresses = decodedEvents.map((event) => event['values']['to']);

//   // @ts-ignore
//   const fromAddresses = decodedEvents.map((event) => event['values']['from']);

//   // @ts-ignore
//   const amounts = decodedEvents.map((event) => event['values']['amount']);

//   return [fromAddresses, toAddresses, amounts];
// };

// export const eventFilterv5WithPagination = async (
//   contractAddress: string,
//   erc20abi: any, // TODO: improve
//   provider: any,
//   numberOfResponses: number
// ) => {
//   // creating the interface of the ABI
//   const iface = new ethers.utils.Interface(erc20abi);

//   // intialize array for the logs
//   let logs: any[] = [];
//   // get latest block number
//   const latest = await provider.getBlockNumber();
//   // intialize a counter for which block we're scraping starting at the most recent block
//   let blockNumberIndex = latest;

//   // while loop runs until there are as many responses as desired
//   while (logs.length < numberOfResponses && blockNumberIndex > 0) {
//     const tempLogs = await provider.getLogs({
//       address: contractAddress,
//       // both fromBlock and toBlock are the index, meaning only one block's logs are pulled
//       fromBlock: blockNumberIndex,
//       toBlock: blockNumberIndex,
//     });
//     // an added console.log to help see what's going on
//     console.log(
//       'BLOCK: ',
//       blockNumberIndex,
//       ' NUMBER OF LOGS: ',
//       tempLogs.length
//     );
//     blockNumberIndex -= 1;
//     logs = logs && logs.length > 0 ? [...logs, ...tempLogs] : [...tempLogs];
//   }

//   // this will return an array with the decoded events
//   const decodedEvents = logs.map((log) => {
//     return iface.decodeEventLog('Transfer', log.data);
//   });
//   console.log(decodedEvents);

//   // debugger;
//   // let's pull out the to and from addresses and amounts
//   // @ts-ignore
//   const toAddresses = decodedEvents.map((event) => event['values']['to']);

//   // @ts-ignore
//   const fromAddresses = decodedEvents.map((event) => event['values']['from']);

//   // @ts-ignore
//   const amounts = decodedEvents.map((event) => event['values']['amount']);

//   return [fromAddresses, toAddresses, amounts];
// };

export const eventFilterv5 = async (
  contractAddress: string,
  erc20abi: any,
  _provider: Web3Provider
) => {
  console.log(erc20abi);
  const iface = new ethers.utils.Interface(erc20abi);
  const logs = await _provider.getLogs({
    address: contractAddress,
  });
  console.log(logs);
  const decodedEvents = logs.map((log) => {
    return iface.decodeEventLog('Transfer', log.data);
  });
  console.log('events', decodedEvents);
  // @ts-ignore
  const toAddresses = decodedEvents.map((event) => event['values']['to']);

  // @ts-ignore
  const fromAddresses = decodedEvents.map((event) => event['values']['from']);

  // @ts-ignore
  const amounts = decodedEvents.map((event) => event['values']['value']);
  return [fromAddresses, toAddresses, amounts];
};
