import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { useEagerConnect } from './hooks/useEagerConnect';
import { useInactiveListener } from './hooks/useInactiveListener';
import { TranfersGrid } from './features/TransfersGrid';
import { useLazyFetchTransfers } from './hooks/useLazyFetchTransfers';

// TODO: Verify all error-prone paths.
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
  // console.log(transfers);

  // run only on mount or library change
  useEffect(() => {
    if (!library) return;

    const fetchTransfersInitially = async () => {
      try {
        const latest = await library.getBlockNumber();
        await fetchTransfers({
          minLogsCount: 10,
          blocksRange: {
            toBlock: latest,
            fromBlock: latest - 30,
            // TODO: add to and from
          },
        });
        setLatestBlock(latest);
      } catch (err) {
        console.error('Failed to fetch trnasfers!', err);
      }
    };

    fetchTransfersInitially();
  }, [fetchTransfers, latestBlock, library]);

  if (connectionError) {
    console.error(connectionError);
    return <div>Failed to connect to Ethereum node.</div>;
  }

  if (error) {
    console.error(error);
    return (
      <div>
        There was an error while fetching data. Please see the console for more
        details
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
          className="w-full mt-2 mb-2 rounded pl-5 pr-5 pt-3 pb-3 inline-block"
          type={'text'}
        />
        <label htmlFor="to">To</label>
        <input
          onChange={(e) => setTo(e.target.value.trim())}
          name="to"
          className="w-full mt-2 mb-2 rounded pl-5 pr-5 pt-3 pb-3 inline-block"
          type={'text'}
        />
        <button
          onClick={async () =>
            await fetchTransfers({
              minLogsCount: 10,
              blocksRange: {
                fromBlock: latestBlock,
                toBlock: latestBlock - 30,
              },
            })
          }
          className="m-auto mt-0 w-full p-4 border-2 border-black border-sold"
        >
          Search
        </button>
      </div>
      <div>
        {transfers ? <TranfersGrid data={transfers} /> : <h2>Loading...</h2>}
      </div>
    </div>
  );
}

export default App;
