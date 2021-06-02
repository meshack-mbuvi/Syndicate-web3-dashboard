import { RootState } from "@/redux/store";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { ifRows } from "./interfaces";

const SyndicateActionButton = ({
  row: { syndicateAddress, depositsEnabled, distributionsEnabled },
}: ifRows) => {
  const {
    web3: { account },
  } = useSelector((state: RootState) => state.web3Reducer);

  /**
   *
   * Button Options:
   * “Deposit More” if the syndicate is not closed to new deposits and hasn’t
   * hit the maximum amount of deposits. And it must be active.
   * “Withdraws Available” if the user can withdraw distributions greater than
   * zero from the syndicate.
   * “View” in any other case.
   */
  let buttonText = "View";
  let buttonStyles = "border";
  let link = "details";

  // check that wallet owner is not the creater of the syndicate
  if (syndicateAddress !== account) {
    // monitors whether syndicate is open to deposits
    if (depositsEnabled) {
      buttonText = "Deposit more";
      buttonStyles = "bg-white text-black";
      link = "deposit";
    }

    if (distributionsEnabled) {
      buttonText = "Withdraws available";
      buttonStyles = "border border-blue-light";
      link = "withdraw";
    }
  } else {
    buttonText = "Manage";
    buttonStyles = "bg-blue-light text-black";
    link = "manage";
  }

  return (
    <Link href={`/syndicates/${syndicateAddress}/${link}`}>
      <div className="flex justify-end cursor-pointer">
        <a className={`text-xs rounded-full py-3 my-1  ${buttonStyles}`}>
          <button className="w-40 focus:outline-none">{buttonText}</button>
        </a>
      </div>
    </Link>
  );
};

export default SyndicateActionButton;
