import { Web3Provider } from '@ethersproject/providers';
import ABI from '../utils/DAIABI.json';
import PQueue from 'p-queue';
import { useState, useCallback } from 'react';
import { contractAddress, TRANSFER_HASH } from '../shared/constants';
import { Transfer } from '../shared/types';
import { fetchLogsWithBlocks } from '../API/fetchLogsWithBlocks/fetchLogsWithBlocks';
import { mapToTransferHistory } from '../utils/mapToTransferHistory/mapToTransferHistory';
import { mapTopicsToFilter } from '../utils/mapTopicsToFilter';

export type FetchTransfers = ({
  from,
  to,
  blocksRange,
  minLogsCount,
}: {
  from?: string;
  to?: string;
  blocksRange?: { toBlock?: number; fromBlock?: number };
  minLogsCount?: number;
}) => Promise<void>;

export const useLazyFetchTransfers = ({
  library,
}: {
  library: Web3Provider | undefined;
}): {
  transfers: Transfer[];
  error: unknown;
  loading: boolean;
  fetchTransfers: FetchTransfers;
} => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const fetchTransfers = useCallback(
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
      if (!library) {
        setLoading(false);
        setTransfers([]);
        return;
      }
      setLoading(true);
      try {
        const { logs, blocks } = await fetchLogsWithBlocks({
          collectedLogs: [],
          collectedBlocksMap: {},
          contractAddress,
          minLogsCount,
          provider: library,
          promiseQueue: new PQueue({ interval: 1000, concurrency: 5 }),
          topics: mapTopicsToFilter([TRANSFER_HASH, from ?? null, to ?? null]),
          blocksRange,
        });
        console.log(logs, blocks);
        const history = mapToTransferHistory(
          logs, //.sort((a, b) => b.blockNumber - a.blockNumber),
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
    },
    [library]
  );

  return { transfers, error, loading, fetchTransfers };
};
