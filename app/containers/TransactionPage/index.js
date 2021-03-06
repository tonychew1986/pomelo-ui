/**
 *
 * TransactionPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import styled from 'styled-components';
import { useTable, useSortBy } from 'react-table';
import makeSelectTransactionPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

import jsonList from './json/list.json';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
  );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  const firstPageRows = rows.slice(0, 20);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
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
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  );
}

export function TransactionPage() {
  useInjectReducer({ key: 'transactionPage', reducer });
  useInjectSaga({ key: 'transactionPage', saga });

  const columns = React.useMemo(
    () => [
      {
        Header: 'Transactions',
        columns: [
          {
            Header: 'Date Time',
            accessor: 'datetime',
          },
          {
            Header: 'Epoch',
            accessor: 'epoch',
          },
          {
            Header: 'Tx ID',
            accessor: 'txid',
          },
          {
            Header: 'From',
            accessor: 'txFrom',
          },
          {
            Header: 'To',
            accessor: 'txTo',
          },
          {
            Header: 'Amount',
            accessor: 'txAmount',
          },
          {
            Header: 'Currency',
            accessor: 'currency',
          },
        ],
      },
    ],
    [],
  );

  return (
    <div>
      Transaction count: {jsonList.count}
      <Styles>
        <Table columns={columns} data={jsonList.info} />
      </Styles>
    </div>
  );
}

TransactionPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  transactionPage: makeSelectTransactionPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(TransactionPage);
