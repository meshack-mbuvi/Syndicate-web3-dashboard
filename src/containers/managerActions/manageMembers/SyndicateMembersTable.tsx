import React from "react";
import { useTable } from "react-table";

const SyndicateMembersTable = ({
  columns,
  data,
  distributing,
}): JSX.Element => {
  // hide Distribution/claimed when syndicate is not distributing
  const hiddenColumns = !distributing ? ["Distribution/claimed"] : [];

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    initialState: {
      hiddenColumns,
    },
  });
  return (
    <table {...getTableProps()} className="w-full">
      <thead>
        {
          // Loop over the header rows
          headerGroups.map((headerGroup, index) => (
            // Apply the header row props
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={index}
              className="uppercase text-gray-dim text-xs py-4 table-fixed"
            >
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column, index) => (
                  // Apply the header cell props
                  <th {...column.getHeaderProps()} key={index}>
                    {
                      // Render the header
                      column.render("Header")
                    }
                  </th>
                ))
              }
            </tr>
          ))
        }
      </thead>

      <tbody className="divide-y" {...getTableBodyProps()}>
        {
          // Loop over the table rows
          rows.map((row, index) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr {...row.getRowProps()} key={index} className="py-3">
                {
                  // Loop over the rows cells
                  row.cells.map((cell, cellIndex) => {
                    // Apply the cell props
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={cellIndex}
                        className="m-0 font-whyte-light text-xs table-fixed py-3"
                      >
                        {
                          // Render the cell contents
                          cell.render("Cell")
                        }
                      </td>
                    );
                  })
                }
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

export default SyndicateMembersTable;
