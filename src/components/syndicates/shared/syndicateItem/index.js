import React from "react";
import { formatDate } from "src/utils";
import { Link } from "gatsby";

const Button = () => (
  <button className={`rounded-full p-2 w-32 border`}>
    <Link to="#">View more</Link>
  </button>
);

export const SyndicateItem = (props) => {
  const {
    address,
    createdDate,
    closeDate,
    depositors,
    deposits,
    activity,
    distributions,
    myDeposits,
    myWithdraws,
    styles,
  } = props;

  const formattedAddress = `${address.slice(0, 5)}...${address.slice(
    address.length - 4,
    address.length
  )}`;

  return (
    <div className="flex my-2 py-2 border-b border-gray-90">
      <div className="w-8">
        <p className={`h-5 w-5 rounded-full ${styles}`}></p>
      </div>
      <span className="text-smy' mx-2 text-gray-300 w-28">
        {formattedAddress}
      </span>
      <span className="text-sm mx-4 text-gray-300">
        {formatDate(createdDate)}
      </span>
      <span className="text-sm mx-4 text-gray-300">
        open until {formatDate(closeDate)}
      </span>
      <span className="text-sm mx-4 text-gray-300  w-16">
        {depositors / 1000} k
      </span>
      <span className="text-sm mx-4 text-gray-300 w-24">{deposits} DAI</span>
      <span className="text-sm mx-4 text-gray-300 w-8">{activity}</span>
      <span className="text-sm mx-4 text-gray-300 flex justify-center w-24">
        {distributions}
      </span>
      <span className="text-sm mx-4 text-gray-300 w-18">{myDeposits}</span>
      <span className="text-sm mx-4 text-gray-300 w-28 flex justify-center w-24">
        {myWithdraws}
      </span>
      <span className="text-sm mx-4 text-gray-300">
        <Button>View more</Button>
      </span>
    </div>
  );
};
