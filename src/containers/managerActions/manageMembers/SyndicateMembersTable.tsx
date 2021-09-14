import { SearchForm } from "@/components/inputs/searchForm";
import {
  setSelectedMemberAddress,
  showConfirmReturnDeposit,
} from "@/redux/actions/manageMembers";
import { RootState } from "@/redux/store";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
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
  addingMember,
  filterAddressOnChangeHandler,
  searchAddress,
  showApproveModal,
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
        className={`rounded checkbox bg-gray-blackRussian -mr-2 flex ${
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
    pageCount,
    nextPage,
    previousPage,
    state: { pageSize },
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
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          // eslint-disable-next-line react/display-name
          Cell: function ({ row }) {
            return (
              <IndeterminateCheckbox
                {...{
                  ...row.getToggleRowSelectedProps(),
                  customClass: "hidden",
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

  return (
    <div className="flex flex-col overflow-y-hidden -mx-m6">
      <div className="flex my-10 space-x-8 justify-between ml-6">
        <form className="w-3/12 ">
          <SearchForm
            {...{
              onChangeHandler: filterAddressOnChangeHandler,
              searchValue: searchAddress,
              memberCount: data.length,
            }}
          />
        </form>{" "}
        <div className="flex divide-x divide-gray-steelGrey space-x-4 py-2">
          {selectedFlatRows.length > 0 && (
            <div className="flex space-x-6">
              <p className="">
                {selectedFlatRows.length} of {data.length} selected:
              </p>
              {syndicate.modifiable == true && (
                <button
                  className={`flex flex-shrink font-whyte text-right text-blue text-sm justify-center hover:opacity-80`}
                >
                  <img
                    src={"/images/edit-deposits-blue.svg"}
                    alt="icon"
                    className="mr-2 mt-0.5"
                  />
                  <span>Modify deposit amounts</span>
                </button>
              )}

              {syndicate.open && selectedFlatRowsAmount > 0 ? (
                <button
                  className={`flex flex-shrink font-whyte text-right text-blue text-sm justify-center`}
                  onClick={() => confirmReturnMemberDeposit()}
                >
                  <img
                    src={"/images/return-deposit-blue.svg"}
                    alt="icon"
                    className="mr-2 mt-0.5"
                  />
                  <span>Return deposits</span>
                </button>
              ) : (
                ""
              )}

              {syndicate.allowlistEnabled && (
                <button
                  className={`flex flex-shrink font-whyte text-right text-blue text-sm justify-center hover:opacity-80`}
                >
                  <img
                    src={"/images/block.svg"}
                    alt="icon"
                    className="mr-2 mt-0.5"
                  />
                  <span>Block</span>
                </button>
              )}
            </div>
          )}

          {syndicate.allowlistEnabled && (
            <div className="pl-4">
              <button
                className={`flex flex-shrink font-whyte text-right text-blue text-sm justify-center hover:opacity-80`}
                onClick={showApproveModal}
              >
                <img
                  src={"/images/plus-circle-blue.svg"}
                  alt="icon"
                  className="mr-2 mt-0.5"
                />
                <span>Add members</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <table
        {...getTableProps()}
        className="w-full border-b-1 px-1 border-gray-nightrider"
      >
        <thead className="w-full">
          {
            // Loop over the header rows
            headerGroups.map((headerGroup, index) => (
              // Apply the header row props
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={index}
                className="text-gray-lightManatee text-sm py-10 leading-6"
              >
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column, index) => (
                    // Apply the header cell props
                    <th
                      {...column.getHeaderProps()}
                      key={index}
                      className="rounded-md pl-0.5 pt-2 text-left text-xs text-gray-lightManatee"
                    >
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

        <tbody
          className="divide-y divide-gray-nightrider overflow-y-scroll"
          {...getTableBodyProps()}
        >
          {
            // Loop over the table rows
            page.map((row: any, index) => {
              // Prepare the row for display

              prepareRow(row);
              const {
                original: { allowlistEnabled, memberAddressAllowed },
              } = row;
              const showAddingMember =
                allowlistEnabled && !memberAddressAllowed && addingMember;
              return (
                // Apply the row props
                <tr
                  {...row.getRowProps()}
                  key={index}
                  className="space-y-6 hover:opacity-90 border-b-1 text-base border-gray-nightrider"
                  onMouseEnter={() => setShowMoreOptions(index)}
                  onMouseLeave={() => setShowMoreOptions(-1)}
                >
                  {
                    // Loop over the rows cells
                    row.cells.map((cell, cellIndex) => {
                      // Apply the cell props
                      // Show more options when row is hovered, otherwise hide them
                      return (
                        <td
                          {...cell.getCellProps()}
                          key={cellIndex}
                          className={`m-0 font-whyte-light text-white pl-0.5 py-2 ${
                            showMoreOptions == row.index
                              ? "opacity-100"
                              : cellIndex === row.cells.length - 1 &&
                                !showAddingMember
                              ? "opacity-0"
                              : "opacity-100"
                          }`}
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

      {/* show pagination only when we have more than 10 members */}
      {data.length > 10 ? (
        <div className="flex w-full text-white space-x-4 justify-center my-8 py-1 leading-6">
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
            1 - {pageSize} of {pageCount}
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
