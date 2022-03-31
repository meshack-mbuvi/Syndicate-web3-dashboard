import React from 'react';

// our table is inverted, column names show vertically
const InvestmentDetailsTable = ({
  columns,
  data,
  editMode,
  hover
}): JSX.Element => {
  const borderStyles = `border-b-1 border-gray-syn6 border-collapse text-gray-syn4`;
  return (
    <div>
      <table className="w-full font-whyte-light">
        {columns.map((column, index) => {
          return (
            <tr key={index}>
              <th
                className={`text-left text-base ${
                  column.Header === 'Details' ? `text-white` : borderStyles
                }`}
              >
                {column.Header}
              </th>
              <td
                className={`text-right text-base ${
                  index === 0 ? `pr-2 text-gray-syn4` : borderStyles
                }`}
              >
                {data[index]}
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default InvestmentDetailsTable;
