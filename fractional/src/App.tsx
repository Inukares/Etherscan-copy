import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import ABI from './utils/DAIABI.json';
import { useEffect, useState, useCallback } from 'react';
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
}: {
  from: string;
  to: string;
}): {
  transfers: Transfer[];
  error: unknown;
  connectionError: Error | undefined;
  loading: boolean;
} => {
  const { library, error: connectionError } = useWeb3React<Web3Provider>();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const fetchLogs = useCallback(async () => {
    if (library) {
      setLoading(true);
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
        logs, //.sort((a, b) => b.blockNumber - a.blockNumber),
        blocks,
        contractAddress,
        ABI
      );
      setTransfers(history);
      setLoading(false);
    }
  }, [from, library, to]);

  // fetch transfers on mount or on provider change
  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library]);

  return { transfers, error, connectionError, loading };
};

function App() {
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  useEagerConnect();
  const { transfers, connectionError, error } = useFetchTransfers({ from, to });
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
      <div className="flex align-center justify-start  w-full h-10">
        <div className="inline-flex">
          <label htmlFor="from">From</label>
          <div className="inputWrapper">
            <input
              onChange={(e) => setFrom(e.target.value)}
              name="from"
              className="w-32 text-slate-200 border-black border-solid"
              type={'text'}
            />
          </div>
        </div>

        <div className="inline-flex">
          <label htmlFor="to">To</label>
          <input
            onChange={(e) => setTo(e.target.value)}
            name="to"
            className="w-32 border-black border-solid"
            type={'text'}
          />
        </div>
      </div>

      <div>
        {transfers ? <TranfersGrid data={transfers} /> : <h2>Loading...</h2>}
      </div>
    </div>
  );
}

export default App;
