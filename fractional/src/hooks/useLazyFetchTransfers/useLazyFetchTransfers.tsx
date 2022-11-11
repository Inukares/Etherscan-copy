import { Web3Provider } from '@ethersproject/providers';
import PQueue from 'p-queue';
import { useState, useCallback } from 'react';
import ABI from '../../shared/data/DAIABI.json';
import { contractAddress, TRANSFER_HASH } from '../../shared/constants';
import { Transfer } from '../../shared/types';
import { fetchLogsWithBlocks } from '../../API/fetchLogsWithBlocks/fetchLogsWithBlocks';
import { mapToTransfers } from '../../utils/mapToTransferHistory/mapToTransferHistory';
import { mapTopicsToFilter } from '../../utils/mapTopicsToFilter';
import { getSanitizedParams } from '../../utils/getSanitizedParams';
import { FetchTransfers, RecursiveFetchTransfers } from './types';
import { recursiveFetchLogsWithBlocks } from '../../API/fetchLogsWithBlocks/recursiveFetchLogsWithBlocks';
import { getErrorMessage } from '../../shared/toErrorWithMessage';

export const useLazyFetchTransfers = ({
  library,
}: {
  library: Web3Provider | undefined;
}): {
  transfers: Transfer[];
  error: unknown;
  loading: boolean;
  fetchTransfers: FetchTransfers;
  recursiveFetchTransfers: RecursiveFetchTransfers;
} => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [promiseQueue] = useState(
    new PQueue({ interval: 1000, concurrency: 5 })
  );

  const fetchTransfers = useCallback(
    async ({
      from,
      to,
      blockRange,
    }: {
      from?: string;
      to?: string;
      blockRange?: { toBlock?: number; fromBlock?: number };
    }): Promise<void> => {
      setError(null);
      setLoading(true);
      if (!library) {
        return;
      }
      try {
        const topics = mapTopicsToFilter([TRANSFER_HASH, from, to]);
        const { filter } = getSanitizedParams({
          address: contractAddress,
          topics,
          blockRange,
        });
        const { logs, blocksMap: blocks } = await fetchLogsWithBlocks({
          filter,
          promiseQueue,
          provider: library,
        });

        const transfers = mapToTransfers(logs, blocks, contractAddress, ABI);
        if (transfers.length > 0) {
          // ensure that always merge previous values
          setTransfers((oldTransfers) => [...transfers, ...oldTransfers]);
        }
      } catch (error) {
        setError(getErrorMessage(error));
        console.log(error);
      }
      setLoading(false);
    },

    [library, promiseQueue]
  );

  const recursiveFetchTransfers = useCallback(
    async ({
      from,
      to,
      blockRange,
      minLogsCount,
    }: {
      from?: string;
      to?: string;
      blockRange?: { toBlock?: number; fromBlock?: number };
      minLogsCount?: number;
    }): Promise<void> => {
      setError(null);
      setLoading(true);
      if (!library) {
        return;
      }
      try {
        const { logs, blocks } = await recursiveFetchLogsWithBlocks({
          collectedLogs: [],
          collectedBlocksMap: {},
          contractAddress,
          minLogsCount,
          provider: library,
          promiseQueue: promiseQueue,
          topics: mapTopicsToFilter([TRANSFER_HASH, from, to]),
          blockRange,
        });
        const transfers = mapToTransfers(logs, blocks, contractAddress, ABI);
        setTransfers(() => transfers);
      } catch (error) {
        console.error(error);
        setError(getErrorMessage(error));
        setTransfers(() => []);
      }
      setLoading(false);
    },
    [library, promiseQueue]
  );

  return {
    transfers,
    error,
    loading,
    recursiveFetchTransfers,
    fetchTransfers,
  };
};
