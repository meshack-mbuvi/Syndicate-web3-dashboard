import { getTotalDistributions } from "@/helpers";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

interface SyndicateItemProps {
  address: string;
  styles: string;
  closeDate: string;
  createdDate: string;
  active: boolean;
  maxTotalDeposits: string | number;
  openToDeposits: boolean;
  totalDeposits: string | number;
  depositors: number;
  depositERC20ContractAddress: string;
  web3: any;
  activities: number | string;
}

const SyndicateItem = (props: SyndicateItemProps) => {
  const {
    address,
    styles,
    closeDate,
    createdDate,
    active,
    maxTotalDeposits,
    openToDeposits,
    totalDeposits,
    depositors,
    activities,
    depositERC20ContractAddress,
  } = props;

  const {
    web3: { syndicateInstance, account, web3 },
  } = props;

  const [eligibleWithdraw, setEligibleWithdraw] = useState<any>("0");
  const [lpDeposits, setLpDeposits] = useState("0");
  const [totalDistributions, setTotalDistributions] = useState("0");
  const [syndicateLpInfo, setSyndicateLpInfo] = useState(null);
  const [claimedDistributions, setClaimedDistributions] = useState("0");

  const formattedAddress = `${address.slice(0, 5)}...${address.slice(
    address.length - 4,
    address.length
  )}`;

  /**
   * when syndicateLpInfo is set, retrieve lpDeposits,
   * claimedDistributions(which are totalWithdrawals per erc20 token per lpAddress)
   */
  useEffect(() => {
    if (syndicateLpInfo && web3) {
      setClaimedDistributions(
        web3.utils.fromWei(syndicateLpInfo[1].toString())
      );
    }
  }, [syndicateLpInfo]);

  /** when user account is loaded, let's find the eligible balance for this
   * contract */
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

    getTotalDistributions(
      syndicateInstance,
      address,
      depositERC20ContractAddress,
      account
    ).then((distributions) => {
      setTotalDistributions(web3.utils.fromWei(distributions.toString()));
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

    // this happens for the case where the wallet owner is the one leading the syndicate
    if (address === account) return;

    //
    try {
      const syndicateValues = await syndicateInstance.getSyndicateValues(
        address
      );
      const syndicateLPInfo = await syndicateInstance.getSyndicateLPInfo(
        address,
        account
      );
      const totalSyndicateDistributions = await syndicateInstance.getTotalDistributions(
        address,
        account
      );

      setSyndicateLpInfo(syndicateLPInfo);

      const lpDeposits = syndicateLPInfo[0];
      const totalSyndicateContributions = syndicateValues.totalDeposits;
      const lpClaimedPrimaryDistributions = syndicateLPInfo[1];

      setLpDeposits(web3.utils.fromWei(lpDeposits.toString()));

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

  /*Status Options:
   * Open for deposits until XX/XX/XX” if the syndicate is not closed to
   * new deposits and hasn’t hit the maximum amount of deposits. And it must be active.
   * “Operating” if the syndicate is closed to new deposits. And it must be active.
   * “Inactive” if the syndicate has been designated as inactive by the syndicate lead.
   */
  let status = "";
  if (active) {
    if (openToDeposits && totalDeposits < maxTotalDeposits) {
      status = `Open until ${closeDate}`;
    } else {
      status = "Operating";
    }
  } else {
    status = "Inactive";
  }

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
    if (address !== account) {
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
    <tr className="border-b border-gray-90">
      <td
        scope="col"
        className="pl-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <p className={`h-5 w-5 rounded-full ${styles}`}></p>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-sm text-gray-300 whitespace-nowrap">
        {formattedAddress}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-sm text-gray-300 whitespace-nowrap">
        {createdDate}
      </td>
      <td className="text-sm px-6s py-4 whitespace-nowrap text-sm font-medium text-gray-300 whitespace-nowrap">
        {status}
      </td>
      <td className="text-sm px-6 py-4 whitespace-nowrap text-sm font-mediumtext-gray-300 whitespace-nowrap">
        {`${depositors / 1000} k`}
      </td>
      <td className="text-sm px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300 whitespace-nowrap">
        {`${totalDeposits} DAI`}
      </td>
      <td className="text-sm px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300 whitespace-nowrap">
        {activities}
      </td>
      <td className="text-sm px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300 whitespace-nowrap">
        {totalDistributions}
      </td>
      <td className="text-sm px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-300 whitespace-nowrap">
        {lpDeposits}
      </td>
      <td className="text-sm px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-300 whitespace-nowrap">
        {claimedDistributions}
      </td>
      <td className="mb-2">
        <Link href={`/syndicates/${address}/${link}`}>
          <a className={`text-sm mx-4 rounded-full py-3 my-1 ${buttonStyles}`}>
            <button className="w-36 focus:outline-none">{buttonText}</button>
          </a>
        </Link>
      </td>
    </tr>
  );
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3 } = web3Reducer;
  return { web3 };
};

export default connect(mapStateToProps)(SyndicateItem);
