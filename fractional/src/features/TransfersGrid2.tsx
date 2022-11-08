export const app = () => {};
// import { tab } from '@testing-library/user-event/dist/tab';
// import {}
// import { table } from 'console';
// import { useMemo, useState } from 'react';
// import { Transfer } from '../shared/types';
// import { getTimeElapsed } from '../utils/getTimeElapsed';

// export type SortDirection = 'asc' | 'desc';

// export type ColumnSort = {
//   id: string;
//   desc: boolean;
// };

// export type SortingState = ColumnSort[];

// export type SortingTableState = {
//   sorting: SortingState;
// };

// export const TranfersGrid = ({ data }: { data: any }) => {
//   const columns = useMemo(
//     () => [
//       columnHelper.accessor('to', {
//         cell: (info) => info.getValue(),
//         header: () => <span>To</span>,
//       }),
//       columnHelper.accessor('from', {
//         cell: (info) => info.getValue(),
//         header: () => <span>From</span>,
//         // enableSorting: false,
//       }),
//       columnHelper.accessor('timestamp', {
//         cell: (info) =>
//           info.getValue() !== null
//             ? getTimeElapsed((info.getValue() as number) * 1000)
//             : '-',
//         header: () => <span>Age</span>,
//         id: 'timestamp',
//         // enableSorting: true,
//       }),
//       columnHelper.accessor('value', {
//         cell: (info) => info.getValue(),
//         header: () => <span>Value</span>,
//         id: 'value',
//         // enableSorting: true,
//       }),
//     ],
//     []
//   );
//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable(
//       {
//         columns,
//         data,
//       },
//       useSortBy
//     );
//   // const table = useReactTable({
//   //   data,
//   //   columns,
//   //   initialState: {
//   //     sorting: sorting,
//   //   },
//   //   getCoreRowModel: getCoreRowModel(),
//   //   onSortingChange: setSorting,
//   //   getSortedRowModel: getSortedRowModel(),
//   //   debugTable: true,
//   //   // enableSorting: true,
//   // });

//   // table.getso
//   const ETHERSCAN_TX_URL = 'https://etherscan.io/tx/';
//   const forwardToEtherscan = (row: Row<Transfer>) => {
//     const txHash = row.original.txHash;

//     return window.open(ETHERSCAN_TX_URL + txHash, '_blank');
//   };

//   return (
//     <div className="w-full overflow-x-auto">
//       <table className="w-full">
//         <thead>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr className={'table-row'} key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <th
//                   onClick={header.column.getToggleSortingHandler()}
//                   // onClick={header.column.toggleSorting(header.column.)}
//                   className={
//                     'text-left ' + header.column.getCanSort()
//                       ? 'cursor-pointer select-none'
//                       : ''
//                   }
//                   // className: header.column.getCanSort()
//                   //           ? 'cursor-pointer select-none'
//                   //           : '',
//                   key={header.id}
//                 >
//                   {header.isPlaceholder
//                     ? null
//                     : flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {table.getRowModel().rows.map((row) => (
//             <tr
//               onClick={() => forwardToEtherscan(row)}
//               className={'odd:bg-indigo-300 cursor-pointer'}
//               key={row.id}
//             >
//               {row.getVisibleCells().map((cell) => (
//                 <td className={'text-left pt-4 pr-4 pb-4'} key={cell.id}>
//                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
