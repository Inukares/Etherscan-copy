import { useTable, useSortBy, Column, Row } from 'react-table';
import { TRANSFERS_TO_SHOW } from '../constants';
import { Transfer } from '../types';

// TODO: Make it more reusable, by deleting dependency on hardcoded styles and using styles basing on data shape
export function Table({
  columns,
  data,
  initialState,
  onRowClick = () => null,
}: {
  columns: Column[];
  data: Array<Transfer>;
  // react-table v7 has poor typescript support. Many types are simply incorrect, such as missing sortBy in initialState :(
  initialState?: any;
  onRowClick?: (row: Row<object>) => Window | null;
}) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState,
      },
      useSortBy
    );

  // showing only some rows
  const firstPageRows = rows.slice(0, TRANSFERS_TO_SHOW);

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
      <div>
        Showing the first{' '}
        {TRANSFERS_TO_SHOW < rows.length ? TRANSFERS_TO_SHOW : rows.length}{' '}
        results of {rows.length} rows
      </div>
    </div>
  );
}
