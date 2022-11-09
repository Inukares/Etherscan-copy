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
      // TODO: Below line is likely to fail for addresses that contain a lot of logs.
      // One way to solve this would be to provide small ranges for blocksRange to prevent error from happening at all times
      // and try to fetch up untill genesis block to get all the logs/minimum count
      // I intentionally omitted this part in order to have a further discussion about it
      await fetchTransfers({
        minLogsCount: 0,
        from,
        to,
        blocksRange: {
          toBlock: latestBlock,
          fromBlock: 0,
        },
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
