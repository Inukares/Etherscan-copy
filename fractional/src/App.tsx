import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { useConnect } from './hooks/useConnect';
import DAIABI from './utils/DAIABI.json';
import { useInactiveListener } from './hooks/useInactiveListener';
import { useLazyFetchTransfers } from './hooks/useLazyFetchTransfers/useLazyFetchTransfers';
import { TransfersTable } from './features/TransfersTable';
import { getBlockRange } from './utils/getBlockRange';
import { contractAddress, MIN_LOGS } from './shared/constants';
import { Search } from './features/Search';
import { fetchLogsWithBlocks } from './API/fetchLogsWithBlocks/fetchLogsWithBlocks';

// 0x60594a405d53811d3BC4766596EFD80fd545A270

// TDO: Move DAIABI to shared
// TODO: Default sorting for table, listetningto new blocks
// TODO: Correct inconsitent namings for errors, block vs blocksRange, etc
// TODO: if recipient or sender is set, set minLogsCount to 0 and blockRange to null
function App() {
  const { library, error: connectionError } = useWeb3React<Web3Provider>();
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [latestBlock, setLatestBlock] = useState<number>(0);

  const tried = useConnect();
  const { transfers, error, recursiveFetchTransfers, fetchTransfers } =
    useLazyFetchTransfers({
      library,
    });

  useEffect(() => {
    if (!library) return;

    const fetchTransfersInitially = async () => {
      // needs to be wrapped in try catch as it initializes fetching latest block
      try {
        const latest = await library.getBlockNumber();
        await recursiveFetchTransfers({
          minLogsCount: MIN_LOGS,
          blocksRange: {
            toBlock: latest,
            fromBlock: getBlockRange(latest),
          },
        });
        setLatestBlock(latest);
      } catch (err) {
        console.error('Failed to fetch trnasfers!', err);
      }
    };
    fetchTransfersInitially();
    // run only on mount or library change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recursiveFetchTransfers, library]);

  useEffect(() => {
    if (library) {
      library.on('block', async (block) => {
        await fetchTransfers({
          blocksRange: { fromBlock: block, toBlock: block },
          from,
          to,
        });
      });
      return () => {
        library.removeAllListeners('block');
      };
    }
  }, [library]);

  if (tried && !library) {
    return <h2>Failed to connect to Ethereum node. Try again later.</h2>;
  }

  if (connectionError) {
    console.error(connectionError);
    return <div>Failed to connect to Ethereum node.</div>;
  }

  if (error) {
    console.error(error);
    return (
      <h2>
        You most likely requested too many logs. Please see more in the 'high
        level decisions' section of Readme.md
      </h2>
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
          recursiveFetchTransfers={recursiveFetchTransfers}
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
