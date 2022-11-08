import React from 'react';
import { useTable, useSortBy, Column, Row } from 'react-table';
import { Transfer } from '../shared/types';

export function Table({
  columns,
  data,
  onRowClick = () => null,
}: {
  columns: Column[];
  data: Array<Transfer>;
  // TODO: improve types to be flexible, not hardcoded
  onRowClick?: (row: Row<object>) => Window | null;
}) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 20);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th
                  {...column.getHeaderProps(
                    (column as any).getSortByToggleProps()
                  )}
                >
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {(column as any).isSorted
                      ? (column as any).isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                className="odd:bg-indigo-300 cursor-pointer"
                onClick={() => onRowClick(row)}
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      className={'text-center pt-4 pr-4 pb-4'}
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </div>
  );
}
