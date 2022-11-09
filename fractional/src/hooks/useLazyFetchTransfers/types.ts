export type RecursiveFetchTransfers = ({
  from,
  to,
  blockRange,
  minLogsCount,
}: {
  from?: string;
  to?: string;
  blockRange?: { toBlock?: number; fromBlock?: number };
  minLogsCount?: number;
}) => Promise<void>;

export type FetchTransfers = ({
  from,
  to,
  blockRange,
}: {
  from?: string;
  to?: string;
  blockRange?: { toBlock?: number; fromBlock?: number };
}) => Promise<void>;
