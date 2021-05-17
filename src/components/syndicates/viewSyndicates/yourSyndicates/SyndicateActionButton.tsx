import React, { useState, useEffect } from "react";
import { RootStateOrAny, useSelector } from "react-redux";
import Link from "next/link";
import { ifRows } from "./interfaces";

const SyndicateActionButton = ({
  row: { syndicateAddress, active, openToDeposits },
}: ifRows) => {
  const { web3: web3Wrapper } = useSelector(
    (state: RootStateOrAny) => state.web3Reducer
  );

  const { account, syndicateInstance, web3 } = web3Wrapper;

  const [eligibleWithdraw, setEligibleWithdraw] = useState<any>("0");

  const calculateEligibleWithdrawal = async () => {
    // we need these to be able to access the syndicate contract
    if (!syndicateInstance || !account) return;

    // this happens for the case where the wallet owner is the one leading the syndicate
    if (syndicateAddress === account) return;

    //
    try {
      const syndicateValues = await syndicateInstance.getSyndicateValues(
        syndicateAddress
      );
      const syndicateLPInfo = await syndicateInstance.getSyndicateLPInfo(
        syndicateAddress,
        account
      );
      const totalSyndicateDistributions = await syndicateInstance.getTotalDistributions(
        syndicateAddress,
        account
      );

      const lpDeposits = syndicateLPInfo[0];
      const totalSyndicateContributions = syndicateValues.totalDeposits;
      const lpClaimedPrimaryDistributions = syndicateLPInfo[1];

      // no need to calculate eligible when totalSyndicateDistributions === 0
      // Therefore wallet account can withdraw 0 tokens
      if (totalSyndicateDistributions === "0") return 0;

      // send request to calculate eligibleWithdraw
      const eligibleWithdrawal = await syndicateInstance.calculateEligibleWithdrawal(
        lpDeposits,
        totalSyndicateContributions,
        lpClaimedPrimaryDistributions,
        totalSyndicateDistributions
      );

      return web3.utils.fromWei(eligibleWithdrawal.toString());
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    calculateEligibleWithdrawal()
      .then((data) => {
        setEligibleWithdraw(data);
      })
      .catch((err) => {
        console.log({ err });
        // set this to 0 whenever an error occurs during calculation
        setEligibleWithdraw(0);
      });
  }, [account, syndicateInstance]);

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
  if (active) {
    if (syndicateAddress !== account) {
      // monitors whether syndicate is open to deposits
      if (openToDeposits) {
        buttonText = "Deposit more";
        buttonStyles = "bg-white text-black";
        link = "deposit";
      }

      if (eligibleWithdraw > 0) {
        buttonText = "Withdraws available";
        buttonStyles = "border border-blue-light";
        link = "withdraw";
      }
    } else {
      buttonText = "Manage";
      buttonStyles = "bg-blue-light text-black";
      link = "manage";
    }
  }

  return (
    <Link href={`/syndicates/${syndicateAddress}/${link}`}>
      <div className="flex justify-end">
        <a className={`text-sm rounded-full py-3 my-1  ${buttonStyles}`}>
          <button className="w-36 focus:outline-none">{buttonText}</button>
        </a>
      </div>
    </Link>
  );
};

export default SyndicateActionButton;
