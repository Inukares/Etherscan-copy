import { useCallback } from 'react';
import { RecursiveFetchTransfers } from '../hooks/useLazyFetchTransfers/types';
import { MIN_LOGS } from '../shared/constants';
import { getBlockRange } from '../utils/getBlockRange';
import { isAddressValid } from '../utils/isAddressValid';

export const Search = ({
  from,
  to,
  latestBlock,
  recursiveFetchTransfers,
}: {
  from: string;
  to: string;
  latestBlock: number;
  recursiveFetchTransfers: RecursiveFetchTransfers;
}) => {
  const handleSearch = useCallback(async () => {
    if (from || to) {
      // TODO: Below line is likely to fail for addresses that contain a lot of logs.
      // One way to solve this would be to provide small ranges for blocksRange to prevent error from happening at all times
      // and try to fetch up untill genesis block to get all the logs/minimum count
      // I intentionally omitted this part in order to have a further discussion about it
      await recursiveFetchTransfers({
        minLogsCount: 0,
        from,
        to,
        blockRange: {
          toBlock: latestBlock,
          fromBlock: 0,
        },
      });
    } else {
      await recursiveFetchTransfers({
        minLogsCount: MIN_LOGS,
        blockRange: {
          toBlock: latestBlock,
          fromBlock: getBlockRange(latestBlock),
        },
      });
    }
  }, [recursiveFetchTransfers, from, latestBlock, to]);

  let isEnabled = true;
  if (from && to) {
    isEnabled = isAddressValid(from) && isAddressValid(to);
  } else if (from) {
    isEnabled = isAddressValid(from);
  } else if (to) {
    isEnabled = isAddressValid(to);
  }

  const className = `
m-auto mt-0 w-full p-4 border-2 border-black border-sold ${
    isEnabled ? '' : 'disabled border-rose-600 cursor-not-allowed'
  }
  `;
  const onClick = async () => {
    if (isEnabled) return await handleSearch();
    return () => {};
  };

  return (
    <button onClick={onClick} className={className}>
      Search
    </button>
  );
};
