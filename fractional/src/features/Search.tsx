import { useCallback } from 'react';
import { FetchTransfers } from '../hooks/useLazyFetchTransfers';
import { MIN_LOGS } from '../shared/constants';
import { getBlockRange } from '../utils/getBlockRange';

export const Search = ({
  from,
  to,
  latestBlock,
  fetchTransfers,
}: {
  from: string;
  to: string;
  latestBlock: number;
  fetchTransfers: FetchTransfers;
}) => {
  const handleSearch = useCallback(async () => {
    if (from || to) {
      const blocksRange = {
        // Hopefully 10 rest calls are enough to prevent query returned more than 10000 results error
        fromBlock: Math.round(latestBlock - latestBlock / 20),
        toBlock: latestBlock,
      };
      console.log(blocksRange);
      await fetchTransfers({
        minLogsCount: 0,
        from,
        to,
        blocksRange,
        //   fromBlock: Math.round(latestBlock - latestBlock / 50),
        //   toBlock: latestBlock,
      });
    } else {
      await fetchTransfers({
        minLogsCount: MIN_LOGS,
        blocksRange: {
          toBlock: latestBlock,
          fromBlock: getBlockRange(latestBlock),
        },
      });
    }
  }, [fetchTransfers, from, latestBlock, to]);

  return (
    <button
      onClick={async () => await handleSearch()}
      className="m-auto mt-0 w-full p-4 border-2 border-black border-sold"
    >
      Search
    </button>
  );
};
