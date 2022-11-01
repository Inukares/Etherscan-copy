import { Log, Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, providers } from 'ethers';
import ABI from './utils/DAIABI.json';
import { useEffect, useState } from 'react';
import './App.css';

import ConnectToMetamask from './features/ConnectMetamask';
import { useEagerConnect } from './hooks/useEagerConnect';
import { useInactiveListener } from './hooks/useInactiveListener';
import { ErrorWithMessage } from './shared/errorUtils';
import { fetchLogs } from './utils/fetchLogs/fetchLogs';
import { mapToTransferHistory } from './utils/mapToTransferHistory/mapToTransferHistory';
const contractAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';

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
      if (library) {
        const latest = await library.getBlockNumber();
        const { logs, blocks } = await fetchLogs({
          blockNumber: latest,
          collectedLogs: [],
          collectedBlocksMap: {},
          contractAddress,
          minLogsCount: 3,
          provider: library,
          parallelRequests: 3,
        });
        const transferHistory = mapToTransferHistory(
          logs,
          blocks,
          contractAddress,
          ABI
        );
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
