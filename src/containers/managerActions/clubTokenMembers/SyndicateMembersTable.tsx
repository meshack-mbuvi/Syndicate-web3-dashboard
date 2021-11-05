import { SearchForm } from "@/components/inputs/searchForm";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import Image from "next/image";
import React from "react";
import { usePagination, useTable } from "react-table";

const SyndicateMembersTable = ({
  columns,
  data,
  filterAddressOnChangeHandler,
  searchAddress,
}): JSX.Element => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageSize, pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 10,
      },
    },
    usePagination,
  );

  // show first and last page for pagination
  const firstPage = pageIndex === 0 ? "1" : pageIndex * pageSize;
  let lastPage;
  if (pageIndex > 0) {
    lastPage =
      page.length < pageSize
        ? pageIndex * pageSize + page.length
        : (pageIndex + 1) * pageSize;
  } else if (pageIndex === 0) {
    lastPage =
      page.length < pageSize
        ? (pageIndex + 1) * pageSize + page.length
        : (pageIndex + 1) * pageSize;
  }

  return (
    <div className="flex flex-col overflow-y-hidden">
      <div className="flex my-11 space-x-8 justify-between items-center">
        {
          // no point showing the search form if there is just one member.
          page.length > 1 || searchAddress ? (
            <SearchForm
              {...{
                onChangeHandler: filterAddressOnChangeHandler,
                searchValue: searchAddress,
                memberCount: data.length,
              }}
            />
          ) : (
            // adding this empty div to maintain button placements to the right
            <div></div>
          )
        }
      </div>

      <table
        {...getTableProps()}
        className={`w-full ${
          page.length ? "border-b-1" : "border-b-0"
        } border-gray-syn6`}
      >
        <thead className="w-full">
          {
            // Loop over the header rows if table data exists.
            page.length
              ? headerGroups.map((headerGroup, index) => (
                  // Apply the header row props
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={index}
                    className="text-gray-sun4 text-sm leading-6"
                  >
                    {
                      // Loop over the headers in each row
                      headerGroup.headers.map((column, index) => {
                        // Apply the header cell props

                        return (
                          <th
                            {...column.getHeaderProps()}
                            key={index}
                            className="rounded-md pb-2 w-1/4 text-left text-sm font-whyte-light text-gray-syn4"
                          >
                            {
                              // Render the header
                              column.render("Header")
                            }
                          </th>
                        );
                      })
                    }
                  </tr>
                ))
              : null
          }
        </thead>

        <tbody
          className="divide-y divide-gray-syn6 overflow-y-scroll"
          {...getTableBodyProps()}
        >
          {
            // Loop over the table rows
            page.map((row: any, index) => {
              // Prepare the row for display

              prepareRow(row);

              return (
                // Apply the row props
                <tr
                  {...row.getRowProps()}
                  key={index}
                  className="border-b-1 text-base border-gray-syn6 text-left"
                >
                  {
                    // Loop over the rows cells
                    row.cells.map((cell, cellIndex) => {
                      // Apply the cell props
                      // Show more options when row is hovered, otherwise hide them
                      return (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                        <td
                          {...cell.getCellProps()}
                          key={cellIndex}
                          className={`m-0 font-whyte-light text-base py-5 text-white`}
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
          {searchAddress && !page.length && (
            <div className="flex flex-col justify-center w-full h-full items-center">
              <ExclamationCircleIcon className="h-10 w-10 mb-2 text-gray-lightManatee" />
              <p className="text-gray-lightManatee">No member found.</p>
            </div>
          )}
        </tbody>
      </table>

      {/* show pagination only when we have more than 10 members */}
      {data.length > 10 ? (
        <div className="flex w-full text-white space-x-4 justify-center my-8 leading-6">
          <button
            className={`pt-1 ${
              !canPreviousPage
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <Image
              src={"/images/arrowBack.svg"}
              height="16"
              width="16"
              alt="Previous"
            />
          </button>
          <p className="">
            {firstPage} - {lastPage}
            {` of `} {data.length}
          </p>

          <button
            className={`pt-1 ${
              !canNextPage
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <Image
              src={"/images/arrowNext.svg"}
              height="16"
              width="16"
              alt="Next"
            />
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SyndicateMembersTable;
