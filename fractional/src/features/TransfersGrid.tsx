import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { info } from 'console';
import { Transfer } from '../shared/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getTimeElapsed } from '../utils/getTimeElapsed';

dayjs.extend(relativeTime);

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

  return (
    <table className="table-auto">
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
