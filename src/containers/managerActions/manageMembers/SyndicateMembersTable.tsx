import React, { useEffect, useRef, useState } from "react";
import { useRowSelect, useTable } from "react-table";

interface IIndeterminateInputProps {
  indeterminate?: boolean;
  customClass?: string;
  checked?: boolean;
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
          className={`rounded checkbox bg-gray-102 ${
            rest?.checked ? "block" : `${customClass}`
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
    <table {...getTableProps()} className="w-full">
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
                    className="rounded-md py-2 text-left"
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
          rows.map((row, index) => {
            // Prepare the row for display
            prepareRow(row);
            return (
              // Apply the row props
              <tr
                {...row.getRowProps()}
                key={index}
                className="space-y-4 hover:opacity-80 border-b-1 border-gray-nightrider"
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
                        className={`m-0 font-whyte-light text-white text-xs py-4`}
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
