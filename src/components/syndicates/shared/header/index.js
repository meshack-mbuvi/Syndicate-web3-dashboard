import React from "react";

export const Header = () => {
  return (
    <div className="flex px-4">
      <div className="flex justify-between w-10/12 ml-4">
        <span className="uppercase text-gray-dim text-xs flex align-start ml-4 mr-3 w-28">
          Address
        </span>
        <span className="uppercase text-gray-dim text-xs mx-1 w-20">
          Created
        </span>
        <span className="uppercase text-gray-dim text-xs mx-2 w-40">
          Status
        </span>
        <span className="uppercase text-gray-dim text-xs mx-2 w-20">
          Depositors
        </span>
        <span className="uppercase text-gray-dim text-xs mx-2 w-20">
          Deposits
        </span>
        <span className="uppercase text-gray-dim text-xs mx-2 ">Activity</span>
        <span className="uppercase text-gray-dim text-xs mx-4">
          Distributions
        </span>
        <span className="uppercase text-gray-dim text-xs mx-2">
          My Deposits
        </span>
        <span className="uppercase text-gray-dim text-xs mx-2">
          My withdrawals
        </span>
      </div>
    </div>
  );
};
