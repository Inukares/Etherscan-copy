export type RecursiveFetchTransfers = ({
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

export type FetchTransfers = ({
  from,
  to,
  blocksRange,
}: {
  from?: string;
  to?: string;
  blocksRange?: { toBlock?: number; fromBlock?: number };
}) => Promise<void>;
