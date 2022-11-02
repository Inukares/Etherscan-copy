import { Log, Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import ABI from './utils/DAIABI.json';
import { useEffect, useState } from 'react';
import './App.css';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import ConnectToMetamask from './features/ConnectMetamask';
import { useEagerConnect } from './hooks/useEagerConnect';
import { useInactiveListener } from './hooks/useInactiveListener';
import { mapToTransferHistory } from './utils/mapToTransferHistory/mapToTransferHistory';
import { fetchLogsWithBlocks } from './utils/fetchLogsWithBlocks/fetchLogsWithBlocks';
import { BlocksMap, Transfer } from './shared/types';
import { contractAddress } from './shared/constants';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<Transfer>();
const columns = [
  columnHelper.accessor('to', {
    cell: (info) => info.getValue(),
    header: () => <span>To</span>,
  }),
  columnHelper.accessor('from', {
    cell: (info) => info.getValue(),
    header: () => <span>From</span>,
  }),
  columnHelper.accessor('timestamp', {
    cell: (info) => info.getValue(),
    header: () => <span>Age</span>,
  }),
  columnHelper.accessor('value', {
    cell: (info) => info.getValue(),
    header: () => <span>Value</span>,
  }),
];

// TODO: Verify if the mapping of transfer's value is correct.
function App() {
  const [blocks, setBlocks] = useState<BlocksMap>({});
  const [logs, setLogs] = useState<Log[]>([]);
  const [transferHistory, setTransferHistory] = useState<Transfer[]>();

  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();

  // TODO: for now leave blank. chekc re-adding later
  // const triedEager = useEagerConnect();
  // useInactiveListener(!triedEager);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (library) {
        const latest = await library.getBlockNumber();
        const { logs, blocks } = await fetchLogsWithBlocks({
          blockNumber: latest,
          collectedLogs: [],
          collectedBlocksMap: {},
          contractAddress,
          minLogsCount: 10,
          provider: library,
          parallelRequests: 10,
        });
        const history = mapToTransferHistory(
          logs,
          blocks,
          contractAddress,
          ABI
        );
        setBlocks(blocks);
        setLogs(logs);
        setTransferHistory(history);
      }
    };
    fetchAccounts();
  }, [library]);

  return (
    <div>
      <div className="flex items-center align-center border-2 border-indigo-600">
        <ConnectToMetamask />
        {transferHistory ? (
          <Grid columns={columns} data={transferHistory} />
        ) : null}
      </div>
    </div>
  );
}

const Grid = ({ columns, data }: { columns: any; data: any }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default App;
