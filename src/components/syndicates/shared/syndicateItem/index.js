import Link from "next/link";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formatDate, toEther } from "src/utils";

const Button = ({ children, ...rest }) => (
  <button {...rest}>
    <Link to="#">{children}</Link>
  </button>
);

const SyndicateItem = (props) => {
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
    maxTotalDeposits,
    styles,
    inactive,
    syndicateOpen,
  } = props;

  const { web3 } = props;

  const { syndicateInstance, account } = web3;

  const [eligibleWithdraw, setEligibleWithdraw] = useState(0);

  const formattedAddress = `${address.slice(0, 5)}...${address.slice(
    address.length - 4,
    address.length
  )}`;

  /** when user account is loaded, let's find the eligible balance for this
   * contract */
  useEffect(() => {
    calculateEligibleWithdrawal()
      .then((data) => {
        console.log({ data });
        setEligibleWithdraw(data);
        // we need to update syndicate data here or set loading to false for this syndicate
      })
      .catch((err) => {
        console.log({ err }, "getting aligiblewithraw");
        // set this to 0 whenever an error occurs during calculation
        setEligibleWithdraw(0);
      });
  }, [account, syndicateInstance]);

  /**
   * if user can withdraw, we set text to Withdraws available.
   * for this, we need to call the function calculate calculateEligibleWithdrawal
   * parameters to be passed are:
   *  serContributions, totalContributions,claimedDistributions and totalDistributions
   *
   * See this test for more https://github.com/SyndicateProtocol/Syndicate-SPV/blob/bf1b78b697ca74f1b1fc743c2b7498605c889122/test/Syndicate.js#L824
   */
  const calculateEligibleWithdrawal = async () => {
    // we need these to be able to access the syndicate contract
    if (!syndicateInstance || !account) return;

    //
    try {
      const syndicateValues = await syndicateInstance.getSyndicateValues(
        address
      );
      const syndicateLPInfo = await syndicateInstance.getSyndicateLPInfo(
        address,
        account
      );
      /**
       * This needs a getter for total distributions per ERC20 and Syndicate
       * on the syndicate.
       * TODO: update this when its method getter is implemented
       **/

      const totalSyndicateDistributions = toEther("1000");

      const lpDeposits = syndicateLPInfo[0];
      const totalSyndicateContributions = syndicateValues.totalDeposits;
      const lpClaimedPrimaryDistributions = syndicateLPInfo[1];

      // no need to calculate eligible when totalSyndicateDistributions === 0
      // Therefore wallet account can withdraw 0 tokens
      if (totalSyndicateDistributions.toNumber() === 0) return 0;

      // send request to calculate eligibleWithdraw
      const eligibleWithdrawal = await syndicateInstance.calculateEligibleWithdrawal(
        lpDeposits,
        totalSyndicateContributions,
        lpClaimedPrimaryDistributions,
        totalSyndicateDistributions
      );

      return eligibleWithdrawal.toNumber();
    } catch (error) {
      console.log({ error }, "getting syndicate data");
      throw error;
    }
  };

  /**
   * Status Options:
   * Open for deposits until XX/XX/XX” if the syndicate is not closed to
   * new deposits and hasn’t hit the maximum amount of deposits. And it must be active.
   * “Operating” if the syndicate is closed to new deposits. And it must be active.
   * “Inactive” if the syndicate has been designated as inactive by the syndicate lead.
   *
   * Button Options:
   * “Deposit More” if the syndicate is not closed to new deposits and hasn’t
   * hit the maximum amount of deposits. And it must be active.
   * “Withdraws Available” if the user can withdraw distributions greater than
   * zero from the syndicate.
   * “View” in any other case.
   */

  let buttonText = "View more";
  let buttonStyles = "border";
  if (!inactive) {
    // monitors whether syndicate is open to deposits
    if (syndicateOpen) {
      buttonText = "Deposit more";
      buttonStyles = "bg-white text-black";
    }

    if (eligibleWithdraw > 0) {
      buttonText = "Withdraws available";
      buttonStyles = "border border-blue-light";
    }
  }

  return (
    <div className="flex my-2 py-2 border-b border-gray-90">
      <div className="w-8">
        <p className={`h-5 w-5 rounded-full ${styles}`}></p>
      </div>
      <span className="text-sm' mx-1 text-gray-300 w-28 text-center">
        {formattedAddress}
      </span>
      <span className="text-sm mx-2 text-gray-300 text-center">
        {formatDate(createdDate)}
      </span>
      <span className="text-sm mx-2 text-gray-300 w-40 text-center">
        open until {formatDate(closeDate)}
      </span>
      <span className="text-sm mx-4  text-gray-300  w-20 text-center text-center">
        {depositors / 1000} k
      </span>
      <span className="text-sm mx-2 text-gray-300 w-24 text-center">
        {deposits} DAI
      </span>
      <span className="text-sm mx-4 text-gray-300 w-8 text-center w-14 text-center">
        {activity}
      </span>
      <span className="text-sm mx-2 text-gray-300 flex justify-center w-24 text-center">
        {distributions}
      </span>
      <span className="text-sm mx-4 text-gray-300 w-18 text-center text-center w-20">
        {myDeposits}
      </span>
      <span className="text-sm mx-2 text-gray-300 flex justify-center w-24 text-center">
        {myWithdraws}
      </span>
      <span>
        <Button
          className={`text-xs mx-2 rounded-full p-2 px-3 text-center w-36 ${buttonStyles}`}>
          {buttonText}
        </Button>
      </span>
    </div>
  );
};
const mapStateToProps = ({ web3Reducer }) => {
  const { web3 } = web3Reducer;
  return { web3 };
};
export default connect(mapStateToProps)(SyndicateItem);
