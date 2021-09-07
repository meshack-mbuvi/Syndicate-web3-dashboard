import React, { useEffect, useRef, useState } from "react";
import { useRowSelect, useTable } from "react-table";

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
  addingMember
}): JSX.Element => {
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
        className={`rounded checkbox bg-gray-blackRussian border flex ${
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
    rows,
    prepareRow,
    state,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        hiddenColumns,
      },
    },
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
  return (
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
              className="text-blue-rockBlue text-sm py-10"
            >
              {
                // Loop over the headers in each row
                headerGroup.headers.map((column, index) => (
                  // Apply the header cell props
                  <th
                    {...column.getHeaderProps()}
                    key={index}
                    className="rounded-md pl-0.5 py-2 text-left"
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
          rows.map((row:any, index) => {
            // Prepare the row for display
            const { original:{ allowlistEnabled, memberAddressAllowed }} = row
            prepareRow(row);
            return (
              // Apply the row props
              <tr
                {...row.getRowProps()}
                key={index}
                className="space-y-4 hover:opacity-80 hover:bg-gray-blackRussian border-b-1 border-gray-nightrider"
                onMouseEnter={() => setShowMoreOptions(index)}
                onMouseLeave={() => setShowMoreOptions(-1)}
              >
                {
                  // Loop over the rows cells
                  row.cells.map((cell, cellIndex) => {
                    // Apply the cell props
                    // Show more options when row is hovered, otherwise hide them
                    const showAddingMember = (allowlistEnabled && !memberAddressAllowed && addingMember)
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={cellIndex}
                        className={`m-0 font-whyte-light text-white text-xs pl-0.5 py-2 ${
                          showMoreOptions == row.index
                            ? "opacity-100"
                            : cellIndex === row.cells.length - 1 && !showAddingMember
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
  );
};

export default SyndicateMembersTable;
