import { Web3Provider } from '@ethersproject/providers';
import PQueue from 'p-queue';
import { useState, useCallback } from 'react';
import ABI from '../../shared/data/DAIABI.json';
import { contractAddress, TRANSFER_HASH } from '../../shared/constants';
import { Transfer } from '../../shared/types';
import {
  fetchLogsWithBlocks,
  recursiveFetchLogsWithBlocks,
} from '../../API/fetchLogsWithBlocks/fetchLogsWithBlocks';
import { mapToTransferHistory } from '../../utils/mapToTransferHistory/mapToTransferHistory';
import { mapTopicsToFilter } from '../../utils/mapTopicsToFilter';
import { getSanitizedParams } from '../../utils/getSanitizedParams';
import { FetchTransfers, RecursiveFetchTransfers } from './types';

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
      blocksRange,
    }: {
      from?: string;
      to?: string;
      blocksRange?: { toBlock?: number; fromBlock?: number };
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
          blockRange: blocksRange,
        });
        const { logs, blocksMap: blocks } = await fetchLogsWithBlocks({
          filter,
          promiseQueue,
          provider: library,
        });

        const history = mapToTransferHistory(
          logs,
          blocks,
          contractAddress,
          ABI
        );
        if (history.length > 0) {
          // ensure that always merge previous values
          setTransfers((transfers) => [...history, ...transfers]);
        }
      } catch (error) {
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
      blocksRange,
      minLogsCount,
    }: {
      from?: string;
      to?: string;
      blocksRange?: { toBlock?: number; fromBlock?: number };
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
          blocksRange,
        });
        const history = mapToTransferHistory(
          logs,
          blocks,
          contractAddress,
          ABI
        );
        setTransfers(() => history);
      } catch (e) {
        console.error(e);
        setError(e);
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
