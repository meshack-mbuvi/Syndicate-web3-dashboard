import { web3 } from "@/utils";
import Link from "next/link";
import React from "react";
import { ifRows } from "./interfaces";

const SyndicateActionButton: React.FC<ifRows> = ({
  row: { syndicateAddress, depositsEnabled, distributing, isOwner },
}) => {
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
  let buttonStyles = "primary-CTA";
  let link = "details";

  // check that wallet owner is not the creater of the syndicate
  if (!isOwner) {
    // monitors whether syndicate is open to deposits
    if (depositsEnabled) {
      buttonText = "Deposit more";
      buttonStyles = "primary-CTA";
      link = "deposit";
    }

    if (distributing) {
      buttonText = "Withdraws available";
      buttonStyles = "primary-CTA";
      link = "withdraw";
    }
  } else {
    buttonText = "Manage";
    buttonStyles = "secondary-CTA";
    link = "manage";
  }
  return (
    <Link
      href={`/syndicates/${web3.utils.toChecksumAddress(
        syndicateAddress,
      )}/${link}`}
    >
      <div className="flex justify-end cursor-pointer">
        <a className={`my-1 ${buttonStyles}`}>
          <button className="w-36 focus:outline-none">{buttonText}</button>
        </a>
      </div>
    </Link>
  );
};

export default SyndicateActionButton;
