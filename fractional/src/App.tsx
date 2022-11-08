import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { useEagerConnect } from './hooks/useEagerConnect';
import { useInactiveListener } from './hooks/useInactiveListener';
import {
  FetchTransfers,
  useLazyFetchTransfers,
} from './hooks/useLazyFetchTransfers';
import { TransfersTable } from './features/TransfersTable';
import { getBlockRange } from './utils/getBlockRange';
import { MIN_LOGS } from './shared/constants';
import { Search } from './features/Search';

// 0x60594a405d53811d3BC4766596EFD80fd545A270

// TODO: Default sorting for table, listetningto new blocks
// TODO: Correct inconsitent namings for errors, block vs blocksRange, etc
// TODO: if recipient or sender is set, set minLogsCount to 0 and blockRange to null
function App() {
  const { library, error: connectionError } = useWeb3React<Web3Provider>();
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [latestBlock, setLatestBlock] = useState<number>(0);

  useEagerConnect();
  const { transfers, error, fetchTransfers } = useLazyFetchTransfers({
    library,
  });

  useEffect(() => {
    if (!library) return;

    const fetchTransfersInitially = async () => {
      // needs to be wrapped in try catch as it initializes fetching latest block
      try {
        const latest = await library.getBlockNumber();
        await fetchTransfers({
          minLogsCount: MIN_LOGS,
          blocksRange: {
            toBlock: latest,
            fromBlock: getBlockRange(latest),
          },
          to,
          from,
        });
        setLatestBlock(latest);
      } catch (err) {
        console.error('Failed to fetch trnasfers!', err);
      }
    };
    fetchTransfersInitially();
    // run only on mount or library change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTransfers, library]);

  if (connectionError) {
    console.error(connectionError);
    return <div>Failed to connect to Ethereum node.</div>;
  }

  if (error) {
    console.error(error);
    return (
      <div>
        There was an error while fetching data. Please see the console for more
        details.
      </div>
    );
  }

  return (
    <div>
      <div className="wrapper m-auto mt-0 p-12 bg-indigo-200 rounded mb-8">
        <label htmlFor="from">From</label>
        <input
          onChange={(e) => setFrom(e.target.value.trim())}
          name="from"
          id="from"
          className="w-full mt-2 mb-2 rounded pl-5 pr-5 pt-3 pb-3 inline-block"
          type={'text'}
        />
        <label htmlFor="to">To</label>
        <input
          onChange={(e) => setTo(e.target.value.trim())}
          name="to"
          id="to"
          className="w-full mt-2 mb-2 rounded pl-5 pr-5 pt-3 pb-3 inline-block"
          type={'text'}
        />
        <Search
          fetchTransfers={fetchTransfers}
          from={from}
          latestBlock={latestBlock}
          to={to}
        />
      </div>
      <div>
        {transfers ? <TransfersTable data={transfers} /> : <h2>Loading...</h2>}
      </div>
    </div>
  );
}

export default App;
