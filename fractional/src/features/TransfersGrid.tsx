import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import { Transfer } from '../shared/types';
import { getTimeElapsed } from '../utils/getTimeElapsed';

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
    cell: (info) =>
      info.getValue() !== null
        ? getTimeElapsed((info.getValue() as number) * 1000)
        : '-',
    header: () => <span>Age</span>,
  }),
  columnHelper.accessor('value', {
    cell: (info) => info.getValue(),
    header: () => <span>Value</span>,
  }),
];

export const TranfersGrid = ({ data }: { data: any }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const ETHERSCAN_TX_URL = 'https://etherscan.io/tx/';
  const forwardToEtherscan = (row: Row<Transfer>) => {
    const txHash = row.original.txHash;

    return window.open(ETHERSCAN_TX_URL + txHash, '_blank');
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className={'table-row'} key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className={'text-left'} key={header.id}>
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
            <tr
              onClick={() => forwardToEtherscan(row)}
              className={'odd:bg-indigo-300 cursor-pointer'}
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <td className={'text-left pt-4 pr-4 pb-4'} key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
