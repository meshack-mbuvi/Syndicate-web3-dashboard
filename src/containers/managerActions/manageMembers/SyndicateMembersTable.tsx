import { SearchForm } from "@/components/inputs/searchForm";
import {
  setSelectedMembers,
  showConfirmBlockMemberAddress,
  showModifyOnChainDepositAmounts,
} from "@/redux/actions/manageActions";
import {
  setSelectedMemberAddress,
  showConfirmReturnDeposit,
} from "@/redux/actions/manageMembers";
import { RootState } from "@/redux/store";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePagination, useRowSelect, useTable } from "react-table";

interface IIndeterminateInputProps {
  indeterminate?: boolean;
  customClass?: string;
  checked?: boolean;
  addingMember?: boolean;
}

const useCombinedRefs = (
  ...refs: Array<React.Ref<HTMLInputElement> | React.MutableRefObject<null>>
): React.MutableRefObject<HTMLInputElement | null> => {
  const targetRef = useRef(null);

  useEffect(() => {
    refs.forEach(
      (ref: React.Ref<HTMLInputElement> | React.MutableRefObject<null>) => {
        if (!ref) return;

        if (typeof ref === "function") {
          ref(targetRef.current);
        } else {
          ref.current = targetRef.current;
        }
      },
    );
  }, [refs]);

  return targetRef;
};

const SyndicateMembersTable = ({
  columns,
  data,
  distributing,
  filterAddressOnChangeHandler,
  searchAddress,
  showApproveModal,
  showMemberDetails,
}): JSX.Element => {
  const {
    syndicatesReducer: { syndicate },
  } = useSelector((state: RootState) => state);
  const [showMoreOptions, setShowMoreOptions] = useState(-1);

  // eslint-disable-next-line react/display-name
  const IndeterminateCheckbox = React.forwardRef<
    HTMLInputElement,
    IIndeterminateInputProps
  >(({ indeterminate, customClass, ...rest }, ref) => {
    const defaultRef = useRef(null);
    const combinedRef = useCombinedRefs(ref, defaultRef);

    useEffect(() => {
      if (combinedRef?.current) {
        combinedRef.current.indeterminate = indeterminate ?? false;
      }
    }, [combinedRef, indeterminate]);
    return (
      <input
        type="checkbox"
        className={`rounded checkbox bg-gray-blackRussian flex border-1 focus:ring-offset-0 focus:ring-0 shadow-none focus:shadow-none border-gray-shuttle ${
          rest?.checked ? "block" : `${customClass ? customClass : ""}`
        }`}
        ref={combinedRef}
        {...rest}
      />
    );
  });
  // hide Distribution/claimed when syndicate is not distributing
  const hiddenColumns = !distributing ? ["Distribution/claimed"] : [];

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    selectedFlatRows,
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
        hiddenColumns,
        pageSize: 10,
      },
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // eslint-disable-next-line react/display-name
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <IndeterminateCheckbox
              {...{
                ...getToggleAllRowsSelectedProps(),
              }}
            />
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          // eslint-disable-next-line react/display-name
          Cell: function ({ row }) {
            return (
              <IndeterminateCheckbox
                {...{
                  ...row.getToggleRowSelectedProps(),
                }}
              />
            );
          },
        },
        ...columns,
      ]);
    },
  );

  let selectedFlatRowsAmount = 0;
  selectedFlatRows.forEach(
    (row: any) => (selectedFlatRowsAmount += +row.original.memberDeposit),
  );

  let selectedFlatRowsBlocked = false;
  selectedFlatRows.forEach(
    (row: any) =>
      (selectedFlatRowsBlocked ||= row.original.memberAddressAllowed == true),
  );

  const dispatch = useDispatch();
  const confirmReturnMemberDeposit = () => {
    dispatch(showConfirmReturnDeposit(true));
    let totalDeposit = 0;
    const selectedMemberAddress = [];
    selectedFlatRows.forEach((member: any) => {
      totalDeposit += parseInt(member.original.memberDeposit, 10);
      selectedMemberAddress.push(member.original.memberAddress);
    });
    dispatch(setSelectedMemberAddress(selectedMemberAddress, totalDeposit));
  };

  const confirmBlockMemberAddress = () => {
    dispatch(showConfirmBlockMemberAddress(true));
    let totalDeposit = 0;
    const selectedMemberAddress = [];
    selectedFlatRows.forEach((member: any) => {
      totalDeposit += parseInt(member.original.memberDeposit, 10);
      selectedMemberAddress.push(member.original.memberAddress);
    });
    dispatch(setSelectedMemberAddress(selectedMemberAddress, totalDeposit));
  };

  const handleShowModifyOnChainDepositAmounts = () => {
    const selectedMembers = selectedFlatRows.map((member: any) => {
      return { ...member.original };
    });
    dispatch(setSelectedMembers(selectedMembers));
    dispatch(showModifyOnChainDepositAmounts(true));
  };

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

        <div className="flex divide-x divide-gray-steelGrey space-x-4">
          {selectedFlatRows.length > 0 && (
            <div className="flex space-x-8">
              <p className="text-gray-syn4">
                {selectedFlatRows.length} of {data.length} selected:
              </p>
              {syndicate.modifiable == true && syndicate.open && (
                <button
                  className={`flex flex-shrink font-whyte text-right text-blue text-base justify-center items-center hover:opacity-80`}
                  onClick={() => handleShowModifyOnChainDepositAmounts()}
                >
                  <img
                    src={"/images/edit-deposits-blue.svg"}
                    alt="icon"
                    className="mr-2"
                  />
                  <span>Modify deposit amounts</span>
                </button>
              )}

              {syndicate.open && selectedFlatRowsAmount > 0 ? (
                <button
                  className={`flex flex-shrink font-whyte text-right text-blue justify-center text-base items-center hover:opacity-80`}
                  onClick={() => confirmReturnMemberDeposit()}
                >
                  <img
                    src={"/images/return-deposit-blue.svg"}
                    alt="icon"
                    className="mr-2"
                  />
                  <span>Return deposits</span>
                </button>
              ) : (
                ""
              )}

              {syndicate.allowlistEnabled &&
              selectedFlatRowsBlocked &&
              syndicate.open ? (
                <button
                  className={`flex flex-shrink font-whyte text-right text-blue justify-center text-base items-center  hover:opacity-80`}
                  onClick={() => confirmBlockMemberAddress()}
                >
                  <img src={"/images/block.svg"} alt="icon" className="mr-2" />
                  <span>Block</span>
                </button>
              ) : null}
            </div>
          )}

          {syndicate.allowlistEnabled && syndicate.open && (
            <div className="pl-4">
              <button
                className={`flex flex-shrink font-whyte text-right text-blue text-base justify-center items-center hover:opacity-80`}
                onClick={showApproveModal}
              >
                <img
                  src={"/images/plus-circle-blue.svg"}
                  alt="icon"
                  className="mr-2"
                />
                <span>Add members</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <table
        {...getTableProps()}
        className={`w-full ${
          page.length ? "border-b-1" : "border-b-0"
        } border-gray-steelGrey`}
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
                    className="text-gray-lightManatee text-sm leading-6"
                  >
                    {
                      // Loop over the headers in each row
                      headerGroup.headers.map((column, index) => {
                        // Apply the header cell props
                        if (
                          column?.id == "selection" ||
                          column?.Header.toString().trim() == " "
                        ) {
                          return (
                            <th
                              {...column.getHeaderProps()}
                              key={index}
                              className={`rounded-md pb-2 ${
                                column?.id == "selection" ? "pr-4" : ""
                              } text-left text-sm font-whyte-light text-gray-lightManatee`}
                            >
                              {
                                // Render the header
                                column.render("Header")
                              }
                            </th>
                          );
                        } else {
                          return (
                            <th
                              {...column.getHeaderProps()}
                              key={index}
                              className="rounded-md pb-2 w-1/4 text-left text-sm font-whyte-light text-gray-lightManatee"
                            >
                              {
                                // Render the header
                                column.render("Header")
                              }
                            </th>
                          );
                        }
                      })
                    }
                  </tr>
                ))
              : null
          }
        </thead>

        <tbody
          className="divide-y divide-gray-steelGrey overflow-y-scroll"
          {...getTableBodyProps()}
        >
          {
            // Loop over the table rows
            page.map((row: any, index) => {
              // Prepare the row for display

              prepareRow(row);
              const {
                original: { allowlistEnabled, addingMember },
              } = row;
              const showAddingMember = allowlistEnabled && addingMember;
              return (
                // Apply the row props
                <tr
                  {...row.getRowProps()}
                  key={index}
                  className="space-y-6 border-b-1 text-base border-gray-steelGrey h-16 text-left"
                  onMouseEnter={() => setShowMoreOptions(index)}
                  onMouseLeave={() => setShowMoreOptions(-1)}
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
                          className={`m-0 font-whyte-light text-white py-2 ${
                            showMoreOptions == row.index
                              ? "opacity-100"
                              : cellIndex === row.cells.length - 1 &&
                                !showAddingMember
                              ? "opacity-0"
                              : "opacity-100"
                          } ${
                            cellIndex > 0 && cellIndex < row.cells.length - 1
                              ? "cursor-pointer"
                              : ""
                          }
                          `}
                          onClick={
                            cellIndex > 0 && cellIndex < row.cells.length - 1
                              ? (e) => {
                                  showMemberDetails(e, row.original);
                                }
                              : null
                          }
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
