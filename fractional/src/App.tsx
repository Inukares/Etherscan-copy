import { Web3Provider } from '@ethersproject/providers';
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
const contractAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';

/**
 * GET A BLOCK with all transactions
 * FOR EACH TRANSACTION FETCH INFORMATION ABOUT THE TRANSACTIONS *
 * unknown: how to filter transactions basing on coin
 *
 *
 */

//  if((r.logs[k].topics[0] == tokenTransferHash) && (r.logs[k].topics.length == 3)) {
  // 

// TODO: more generalised name might be better later on
export const getBlockWithLogs = async (
  contractAddress: string,
  provider: any,
  numberOfResponses: number
) => {
  // creating the interface of the ABI

  // intialize array for the logs
  let logs: any[] = [];
  // get latest block number
  const latest = await provider.getBlockNumber();
  // intialize a counter for which block we're scraping starting at the most recent block
  let blockNumberIndex = latest;

  // how does const logs = await provider.getLogs({address: contractAddress, fromBlock: currIdx, toBlock: currIdx})
  // and logs.map(async(log) => {
  //  if(log && log?.transactonHash) {
  //   const tx = await provider.getTransaction(log.transactoinHash); return tx;
  // } return null;
  // })
  // differ from provider.getBlockWIthTransactions ?
  // is it only the address param in getLogs filtering?

  // while loop runs until there are as many responses as desired
  while (logs.length < numberOfResponses && blockNumberIndex > 0) {
    // console.log(logs);
    const blockWithTx = await provider.getBlockWithTransactions(
      blockNumberIndex
    );
    console.log(blockWithTx);
    const tempLogs = await provider.getLogs({
      address: contractAddress,
      // both fromBlock and toBlock are the index, meaning only one block's logs are pulled
      fromBlock: blockNumberIndex,
      toBlock: blockNumberIndex,
    });
    // an added console.log to help see what's going on
    console.log(
      'BLOCK: ',
      blockNumberIndex,
      ' NUMBER OF LOGS: ',
      tempLogs.length
    );
    blockNumberIndex -= 1;
    const transactions = tempLogs.map(async (log: any) => {
      if (log && log?.transactionHash) {
        const tx = await provider.getTransaction(log.transactionHash);
        console.log(tx);
        return tx;
      }
      return null;
    });

    if (logs && logs.length > 0) {
      logs = logs.concat(tempLogs);
    } else {
      logs = [...tempLogs];
    }
    // logs = logs && logs.length > 0 ? [...logs, ...tempLogs] : [...tempLogs];
  }

  return logs;
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
        const logs = await getBlockWithLogs(contractAddress, library, 10);
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
