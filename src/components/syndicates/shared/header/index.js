import React from "react";

export const Header = () => {
  return (
    <thead>
      <tr>
        <th
          scope="col"
          className="pl-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Address
        </th>

        <th
          scope="col"
          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Created
        </th>
        <th
          scope="col"
          className="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Depositors
        </th>

        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Deposits
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Activity
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Distributions
        </th>
        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
          My Deposits
        </th>
        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
          My withdrawals
        </th>
        <th scope="col" className=" px-6 py-3">
          <span className="sr-only">Action</span>
        </th>
      </tr>
    </thead>
  );
};
