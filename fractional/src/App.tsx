import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import ABI from './utils/DAIABI.json';
import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { useEagerConnect } from './hooks/useEagerConnect';
import { useInactiveListener } from './hooks/useInactiveListener';
import PQueue from 'p-queue';
import { TranfersGrid } from './features/TransfersGrid';
import { mapToTransferHistory } from './utils/mapToTransferHistory/mapToTransferHistory';
import {
  fetchLogsWithBlocks,
  mapTopicsToFilter,
} from './utils/fetchLogsWithBlocks/fetchLogsWithBlocks';
import { BlocksMap, Transfer } from './shared/types';
import { contractAddress, TRANSFER_HASH } from './shared/constants';

const useFetchTransfers = ({
  from,
  to,
  library,
}: {
  from: string;
  to: string;
  library: Web3Provider | undefined;
}): {
  transfers: Transfer[];
  error: unknown;
  loading: boolean;
  fetchTransfers: () => Promise<void>;
} => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const fetchTransfers = useCallback(async () => {
    if (!library) {
      setLoading(false);
      setTransfers([]);
      return;
    }

    setLoading(true);
    try {
      const latest = await library.getBlockNumber();
      const { logs, blocks } = await fetchLogsWithBlocks({
        collectedLogs: [],
        collectedBlocksMap: {},
        contractAddress,
        minLogsCount: 20,
        provider: library,
        promiseQueue: new PQueue({ interval: 1000, concurrency: 5 }),
        topics: mapTopicsToFilter([TRANSFER_HASH, from, to]),
        blocksRange: { toBlock: latest, fromBlock: latest - 30 },
      });
      const history = mapToTransferHistory(
        logs.sort((a, b) => b.blockNumber - a.blockNumber),
        blocks,
        contractAddress,
        ABI
      );
      setTransfers(history);
    } catch (e) {
      console.error(e);
      setError(e);
    }
    setLoading(false);
  }, [from, library, to]);

  // fetch transfers on mount or on provider change
  useEffect(() => {
    fetchTransfers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library]);

  return { transfers, error, loading, fetchTransfers };
};

function App() {
  const { library, error: connectionError } = useWeb3React<Web3Provider>();
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  useEagerConnect();
  const { transfers, error, fetchTransfers } = useFetchTransfers({
    from,
    to,
    library,
  });

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
          onClick={() => fetchTransfers()}
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
