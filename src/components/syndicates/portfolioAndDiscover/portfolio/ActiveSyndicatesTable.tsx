import Router from "next/router";
import React, { useState } from "react";
import { useSortBy, useTable } from "react-table";
import { HeaderColumn, ifRows } from "./interfaces";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";

interface Props {
  columns: Array<HeaderColumn> | any;
  data: Array<ifRows>;
}

const ActiveSyndicatesTable = ({ columns, data }: Props): JSX.Element => {
  const [activeHeader, setActiveHeader] = useState<unknown>("");

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

  const {
    web3Reducer: {
        web3: { account }
    },
  } = useSelector((state: RootState) => state);

  const firstPageRows = rows.slice(0, 20);

  return (
    <>
      <table {...getTableProps()} className="w-full">
        <thead className="text-left">
          {headerGroups.map((headerGroup, index) => (
            <tr
              key={index}
              {...headerGroup.getHeaderGroupProps()}
              className="ml-4"
            >
              {headerGroup.headers.map((column, index) => {
                const {
                  showSort,
                }: string | boolean | any = headerGroup.headers[index];
                return (
                  // Add the sorting props to control sorting. For this example
                  // we can add them into the header props
                  <th
                    key={index}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="text-gray-dim text-sm py-4 table-fixed"
                  >
                    <div className="flex items-center font-normal w-full">
                      <div
                        className="flex"
                        onMouseEnter={() =>
                          setActiveHeader(headerGroup.headers[index].Header)
                        }
                        onMouseLeave={() => setActiveHeader(null)}
                      >
                        <div className="mr-2">{column.render("Header")}</div>
                        <div className="w-5">
                          {activeHeader === column.render("Header") &&
                          !column.isSorted &&
                          showSort ? (
                            <img src="/images/sortIcon.svg" className="vertically-center" alt="Sort icon" />
                          ) : null}

                          {/* Add a sort direction indicator */}

                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <img src="/images/sort-ascending.svg" className="vertically-center" alt="Sort icon" />
                            ) : (
                              <img src="/images/sort-descending.svg" className="vertically-center" alt="Sort icon" />
                            )
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-steelGrey" {...getTableBodyProps()}>
          {firstPageRows.map((row, index) => {
            prepareRow(row);
            return (
              <tr key={index} {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      key={index}
                      {...cell.getCellProps()}
                      className="m-0 pr-4 last:pr-0 relative py-2 cursor-pointer"
                      onClick={() => {
                        // This handles the case when the button in the far right cell
                        // is clicked
                        if (index == row.cells.length - 1) return;

                        // Otherwise make the row cell clickable and link to the syndicate
                        let link = "manage"
                        const { syndicateAddress } = row.values;
                        const { row: syndicateDetails } = row.values.Deposits.props
                        const isManager = syndicateDetails.managerCurrent  === account
                        if (syndicateDetails.depositsEnabled && !isManager) {
                          link = "deposit"
                        }
                        if (syndicateDetails.distributing && !isManager) {
                          link = "withdraw"
                        }
                        Router.push(`/syndicates/${syndicateAddress}/${link}`);
                      }}
                    >
                    {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
    </>
  );
};

export default ActiveSyndicatesTable;
