import React from "react";

export const Header = () => {
  return (
    <div className="flex px-4">
      <span className="uppercase text-gray-dim text-xs flex align-start ml-4 mr-3 w-28">
        Address
      </span>
      <span className="uppercase text-gray-dim text-xs text-center mx-1 w-20">
        Created
      </span>
      <span className="uppercase text-gray-dim text-xs text-center mx-4 w-40">
        Status
      </span>
      <span className="uppercase text-gray-dim text-xs text-center mx-2 w-20">
        Depositors
      </span>
      <span className="uppercase text-gray-dim text-xs text-center mx-4 w-24">
        Deposits
      </span>
      <span className="uppercase text-gray-dim text-xs text-center mx-2">
        Activity
      </span>
      <span className="uppercase text-gray-dim text-xs mx-4">
        Distributions
      </span>
      <span className="uppercase text-gray-dim text-xs mx-2">
        My Deposits
      </span>
      <span className="uppercase text-gray-dim text-xs mx-2">
        My withdrawals
      </span>
      <span className="uppercase"></span>
    </div>
  );
};
