import React, { useMemo } from 'react';
import { Column, Row } from 'react-table';
import { Table } from '../shared/components/Table';
import { ETHERSCAN_TX_URL } from '../shared/constants';
import { Transfer } from '../shared/types';
import { getTimeElapsed } from '../utils/getTimeElapsed';

export const TransfersTable = ({ data }: { data: Transfer[] }) => {
  const columns: Column[] = React.useMemo(
    () => [
      {
        Header: 'From',
        accessor: 'from',
        disableSortBy: true,
      },
      {
        Header: 'To',
        accessor: 'to',
        disableSortBy: true,
      },
      {
        Header: 'Timestamp',
        accessor: 'timestamp',
        Cell: ({ value }) => (
          <span>{value !== null ? getTimeElapsed(value * 1000) : ' -'}</span>
        ),
      },
      { Header: 'Value', accessor: 'value' },
    ],
    []
  );

  const initialState = useMemo(
    () => ({
      sortBy: [{ id: 'timestamp', desc: true }],
    }),
    []
  );

  const forwardToEtherscan = (row: unknown) => {
    // TODO: fix to make Table types more flexible
    const txHash = (row as Row<Transfer>).original.txHash;

    return window.open(ETHERSCAN_TX_URL + txHash, '_blank');
  };

  return (
    <Table
      onRowClick={forwardToEtherscan}
      initialState={initialState}
      columns={columns}
      data={data}
    />
  );
};
