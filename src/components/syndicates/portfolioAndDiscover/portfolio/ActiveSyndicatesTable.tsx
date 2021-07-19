import Router from "next/router";
import React, { useState } from "react";
import { useSortBy, useTable } from "react-table";
import { HeaderColumn, ifRows } from "./interfaces";

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
                    className="uppercase text-gray-dim text-xs py-4 table-fixed"
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
                            <img src="/images/sortIcon.svg" alt="Sort icon" />
                          ) : null}

                          {/* Add a sort direction indicator */}

                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <img src="/images/sortIcon.svg" alt="Sort icon" />
                            ) : (
                              <img src="/images/sortIcon.svg" alt="Sort icon" />
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
        <tbody className="divide-y divide-gray-90" {...getTableBodyProps()}>
          {firstPageRows.map((row, index) => {
            prepareRow(row);
            return (
              <tr key={index} {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      key={index}
                      {...cell.getCellProps()}
                      className="m-0 font-whyte-light relative py-4 text-xs cursor-pointer"
                    >
                      <button
                        onClick={() => {
                          // This handles the case when the button in the far right cell
                          // is clicked
                          if (index == row.cells.length - 1) return;

                          // Otherwise make the row cell clickable and link to the syndicate
                          const { syndicateAddress } = row.values;
                          Router.push(`/syndicates/${syndicateAddress}`);
                        }}
                      >
                        {cell.render("Cell")}
                      </button>
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
