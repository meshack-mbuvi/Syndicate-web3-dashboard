import React, { useState } from "react";
import { useSortBy, useTable } from "react-table";
import { HeaderColumn, ifRows } from "./interfaces";

interface Props {
  columns: Array<HeaderColumn> | any;
  data: Array<ifRows>;
}

const ActiveSyndicatesTable = ({ columns, data }: Props) => {
  const [activeHeader, setActiveHeader] = useState<string | object | any>("");

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
    useSortBy
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
                        <div className="mr-6">{column.render("Header")}</div>
                        <div className="w-5">
                          {activeHeader === column.render("Header") &&
                          !column.isSorted &&
                          showSort ? (
                            <img src="/images/sortIcon.svg" />
                          ) : null}

                          {/* Add a sort direction indicator */}

                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <img src="/images/sortIcon.svg" />
                            ) : (
                              <img src="/images/sortIcon.svg" />
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
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, index) => {
            prepareRow(row);
            return (
              <tr key={index} {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      key={index}
                      {...cell.getCellProps()}
                      className="m-0 relative py-2 border-b border-gray-90 font-iter text-xs"
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
