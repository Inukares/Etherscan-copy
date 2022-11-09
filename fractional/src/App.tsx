import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import { useConnect } from './hooks/useConnect';
import { useLazyFetchTransfers } from './hooks/useLazyFetchTransfers/useLazyFetchTransfers';
import { TransfersTable } from './features/TransfersTable';
import { getBlockRange } from './utils/getBlockRange';
import { MIN_LOGS } from './shared/constants';
import { Search } from './features/Search';
import { Spinner } from './shared/components/Spinner';
import { DisplayError } from './shared/components/DisplayError';

function App() {
  const { library, error: connectionError } = useWeb3React<Web3Provider>();
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [latestBlock, setLatestBlock] = useState<number>(0);

  const tried = useConnect();
  const { transfers, error, loading, recursiveFetchTransfers, fetchTransfers } =
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
          blockRange: {
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
        setLatestBlock(() => block);
        await fetchTransfers({
          blockRange: { fromBlock: block, toBlock: block },
          from,
          to,
        });
      });
      return () => {
        library.removeAllListeners('block');
      };
    }
  }, [fetchTransfers, from, library, to]);

  if (tried && !library) {
    return <h2>Failed to connect to Ethereum node. Try again later.</h2>;
  }

  if (connectionError) {
    console.error(connectionError);
    return <div>Failed to connect to Ethereum node.</div>;
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
        {error ? (
          <DisplayError
            error={error}
            message={`You most likely requested too many logs. Please see more in the 'high level decisions' section of Readme.md`}
          />
        ) : null}
        {transfers.length > 0 ? <TransfersTable data={transfers} /> : null}
        {loading && transfers.length === 0 ? <Spinner /> : null}
      </div>
    </div>
  );
}

export default App;
