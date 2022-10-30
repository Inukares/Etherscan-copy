import { Log, Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, providers } from 'ethers';
import ABI from './utils/DAIABI.json';
import { useEffect, useState } from 'react';
import './App.css';

import ConnectToMetamask from './features/ConnectMetamask';
import { useEagerConnect } from './hooks/useEagerConnect';
import { useInactiveListener } from './hooks/useInactiveListener';
import { ErrorWithMessage, toErrorWithMessage } from './shared/errorUtils';
import { eventFilterv5 } from './utils/eventFilter';
import { Fragment, LogDescription } from 'ethers/lib/utils';
import { JsonFragment } from '@ethersproject/abi';
const contractAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
// based on the hash I know whether transaction is a transfer or not
const TRANSFER_HASH = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes('Transfer(address,address,uint256)')
);

type ABITYPE = typeof ABI;
/**
 * GET A BLOCK with all transactions
 * FOR EACH TRANSACTION FETCH INFORMATION ABOUT THE TRANSACTIONS *
 * unknown: how to filter transactions basing on coin
 *
 *
 */

//  if((r.logs[k].topics[0] == tokenTransferHash) && (r.logs[k].topics.length == 3)) {

// IN order to run requests in parallel, could fire arbitrary number of calls and check if I get number of responses i want.
// I can't know amount of logs I get from initial call upfront, but such paralellizaton would make things faster
// subsequent calls (e.g having 200 more rows) would iterate based on the amount of requests fethced initially

// TODO: more generalised name might be better later on

const REQUESTS_IN_PARALLEL = 50;

const parseLogs = (contractAddress: string, ABI: ABITYPE, logs: Log[]) => {
  const contract = new ethers.Contract(contractAddress, ABI);
  return logs.map((log) => contract.interface.parseLog(log));
};

const getLogs = async (
  blockNumber: number,
  provider: Web3Provider,
  contractAddress: string,
  ABI: ABITYPE,
  minLogsCount: number = 0,
  collectedTransactions: Array<LogDescription> = []
): Promise<Array<LogDescription>> => {
  console.log('running again!');
  if (blockNumber <= 0) return collectedTransactions;

  // useful for log parsing. otherwise would have to implement parsing manually
  const promises = [];

  let blockIdx = blockNumber;
  for (let i = 0; i < REQUESTS_IN_PARALLEL; i++) {
    promises.push(
      provider.getLogs({
        address: contractAddress,
        fromBlock: blockIdx,
        toBlock: blockIdx,
      })
    );
    blockIdx -= 1;
  }
  const parsedTransactions = await Promise.allSettled(promises).then(
    (responses) => {
      return responses.reduce((acc, response) => {
        if (response.status === 'rejected') return acc;

        // getting only 'Transfer' logs as we only care about those
        const transferLogs = response.value.filter((log) => {
          return log.topics.length === 3 && log.topics[0] === TRANSFER_HASH;
        });

        const parsedLogs = parseLogs(contractAddress, ABI, transferLogs);

        return [...acc, ...parsedLogs];
      }, [] as Array<LogDescription>);
    }
  );

  if (parsedTransactions.length < minLogsCount)
    return await getLogs(
      blockIdx,
      provider,
      contractAddress,
      ABI,
      minLogsCount,
      [...collectedTransactions, ...parsedTransactions]
    );

  return parsedTransactions;
};

export const getBlockWithLogs = async (
  contractAddress: string,
  provider: any,
  ABI: ABITYPE,
  numberOfResponses: number
) => {
  // useful for log parsing. otherwise would have to implement parsing manually
  const contract = new ethers.Contract(contractAddress, ABI);
  // intialize array for the logs
  // get latest block number
  const latest = await provider.getBlockNumber();
  // intialize a counter for which block we're scraping starting at the most recent block
  let blockNumberIndex = latest;
  let currentBlock;

  const logs = await getLogs(
    latest,
    provider,
    contractAddress,
    ABI,
    numberOfResponses,
    []
  );
  return logs;

  // while loop runs until there are as many responses as desired
  // while (logs.length < numberOfResponses && blockNumberIndex > 0) {
  //   // console.log(logs);
  //   const tempLogs = await provider.getLogs({
  //     address: contractAddress,
  //     // both fromBlock and toBlock are the index, meaning only one block's logs are pulled
  //     fromBlock: blockNumberIndex,
  //     toBlock: blockNumberIndex,
  //   });
  //   console.log(
  //     'BLOCK: ',
  //     blockNumberIndex,
  //     ' NUMBER OF LOGS: ',
  //     tempLogs.length
  //   );
  //   blockNumberIndex -= 1;
  //   if (logs && logs.length > 0) {
  //     logs = logs.concat(tempLogs);
  //   } else {
  //     logs = [...tempLogs];
  //   }
  //   // logs = logs && logs.length > 0 ? [...logs, ...tempLogs] : [...tempLogs];
  // }

  // const parsed = logs.map((log) => contract.interface.parseLog(log));
  // each input indice corresponds to each arg indice

  // console.log(parsed);
  // console.log(unindexedEvents);
  // console.log(indexedEvents);
  // const unindexedEvents = ABI.map(obj => obj.inputs.filter(event => event && event.indexed === false));
  // const decodedLogs = logs.map(log => decoder.decode(unindexedEvents, log.data)
};

const decodeLogs = (logs: any, erc20abi: any) => {
  const iface = new ethers.utils.Interface(erc20abi);
  const decodedEvents = logs.map((log: any) => {
    return iface.decodeEventLog('Transfer', log.data);
  });
  console.log(decodedEvents);

  // debugger;
  // let's pull out the to and from addresses and amounts
  // @ts-ignore
  const toAddresses = decodedEvents.map((event) => event['values']['to']);

  // @ts-ignore
  const fromAddresses = decodedEvents.map((event) => event['values']['from']);

  // @ts-ignore
  const amounts = decodedEvents.map((event) => event['values']['amount']);

  return [fromAddresses, toAddresses, amounts];
};

function App() {
  // todo: move to redux
  const [accounts, setAccounts] = useState();
  const [error, setError] = useState<ErrorWithMessage>();

  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();

  // TODO: for now leave blank. chekc re-adding later
  // const triedEager = useEagerConnect();
  // useInactiveListener(!triedEager);

  useEffect(() => {
    const fetchAccounts = async () => {
      console.log(library);
      if (library) {
        console.log('no logs yet');
        const logs = await getBlockWithLogs(contractAddress, library, ABI, 50);
        console.log('yup got logs');

        console.log(logs);
        // const accounts = await library.send('eth_requestAccounts', []);
        // const contract = new ethers.Contract(contractAddress, ABI, library);
      }
    };
    fetchAccounts();
  });

  return (
    <div>
      <div className="flex items-center align-center border-2 border-indigo-600">
        <ConnectToMetamask />
      </div>
    </div>
  );
}

export default App;
