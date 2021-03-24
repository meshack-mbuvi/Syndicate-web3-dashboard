import React from "react";

export const Header = () => {
  return (
    <div className="flex px-4">
      <span className="uppercase text-gray-dim text-xs flex align-start mx-4  w-28">
        Address
      </span>
      <span className="uppercase text-gray-dim text-xs mx-4 w-20">Created</span>
      <span className="uppercase text-gray-dim text-xs mx-4 w-36">Status</span>
      <span className="uppercase text-gray-dim text-xs mx-4 w-20">
        Depositors
      </span>
      <span className="uppercase text-gray-dim text-xs mx-4">Deposits</span>
      <span className="uppercase text-gray-dim text-xs mx-4">Activity</span>
      <span className="uppercase text-gray-dim text-xs mx-4">
        Distributions
      </span>
      <span className="uppercase text-gray-dim text-xs mx-4">My Deposits</span>
      <span className="uppercase text-gray-dim text-xs">My withdrawals</span>
      <span className="uppercase"></span>
    </div>
  );
};
