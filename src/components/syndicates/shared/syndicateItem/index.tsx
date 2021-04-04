import Link from "next/link";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formatDate } from "src/utils";
import Web3 from "web3";

const Button = ({ children, link = "#", ...rest }) => (
  <button {...rest}>
    <Link href={`/syndicate/${link}`}>{children}</Link>
  </button>
);

Button.propTypes = {
  children: PropTypes.string,
  link: PropTypes.string,
  rest: PropTypes.any,
};

const SyndicateItem = (props) => {
  const { address, styles } = props;
  console.log({ props });

  const {
    web3: { syndicateInstance, account },
  } = props;

  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

<<<<<<< HEAD:src/components/syndicates/shared/syndicateItem/index.tsx
  const [eligibleWithdraw, setEligibleWithdraw] = useState<any>(0);
  const [lpDeposits, setLpDeposits] = useState<string>("0");
=======
  const [eligibleWithdraw, setEligibleWithdraw] = useState(0);
  const [lpDeposits, setLpDeposits] = useState(0);
  const [totalDistributions, setTotalDistributions] = useState(0);
  const [closeDate, setCloseDate] = useState(null);
  const [createdDate, setCreatedDate] = useState(null);
  const [syndicateLpInfo, setSyndicateLpInfo] = useState(null);
  const [claimedDistributions, setClaimedDistributions] = useState(0);
  const [openToDeposits, setOpenToDeposits] = useState(false);
  const [inactive, setInactive] = useState(false);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [maxTotalDeposit, setMaxTotalDeposit] = useState(0);
  const [depositors] = useState(0);
>>>>>>> Show totalDeposits, distributions, totalLpdeposits and lpWithdrawals on my syndicates screen.:src/components/syndicates/shared/syndicateItem/index.js

  const formattedAddress = `${address.slice(0, 5)}...${address.slice(
    address.length - 4,
    address.length
  )}`;

  /**
   * when syndicateLpInfo is set, retrieve lpDeposits,
   * claimedDistributions(which are totalWithdrawals per erc20 token per lpAddress)
   */
  useEffect(() => {
    if (syndicateLpInfo) {
      setClaimedDistributions(
        web3.utils.fromWei(syndicateLpInfo[1].toString())
      );
    }
  }, [syndicateLpInfo]);

  useEffect(() => {
    if (syndicateInstance) {
      getSyndicate().then((syndicate) => {
        console.log({ syndicate });
      });
    }
  }, [syndicateInstance]);

  /** when user account is loaded, let's find the eligible balance for this
   * contract */
  useEffect(() => {
    calculateEligibleWithdrawal()
      .then((data) => {
        setEligibleWithdraw(data);
      })
      .catch((err) => {
        console.log({ err }, "getting aligiblewithraw");
        // set this to 0 whenever an error occurs during calculation
        setEligibleWithdraw(0);
      });

    getTotalDistributions().then((distributions) => {
      setTotalDistributions(distributions);
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

      return web3.utils.fromWei(eligibleWithdrawal);
    } catch (error) {
      console.log({ error }, "getting syndicate data");
    }
  };

  /**
   * retrieve totalDistributions for a given syndicate per lpAccount
   * @returns
   */
  const getTotalDistributions = async () => {
    const totalDistributions = await syndicateInstance.getTotalDistributions(
      address,
      account
    );
    setTotalDistributions(web3.utils.fromWei(totalDistributions.toString()));
    return web3.utils.fromWei(totalDistributions.toString());
  };

  /**
   * Retrieves syndicateInfo for the connected wallet. We need to find out
   * how much the wallet account has invested in this syndicate, and then use
   * this date in calculateMyLPShare() above to caluclate the share of the account.
   * @returns
   */
  const getSyndicate = async () => {
    try {
      syndicateInstance
        .getSyndicateValues(address)
        .then((data) => {
          console.log({ data });
          const closeDate = formatDate(new Date(data.closeDate.toNumber()));
          const createdDate = formatDate(
            new Date(data.creationDate.toNumber() * 1000)
          );
          const openToDeposits = data.syndicateOpen;

          const totalDeposits = web3.utils.fromWei(
            data.totalDeposits.toString()
          );
          const maxTotalDeposits = web3.utils.fromWei(
            data.maxTotalDeposits.toString()
          );
          setInactive(inactive);
          setCloseDate(closeDate);
          setTotalDeposits(totalDeposits);
          setMaxTotalDeposit(maxTotalDeposits);
          setCreatedDate(createdDate);
          setOpenToDeposits(openToDeposits);

          return {
            openToDeposits,
            closeDate,
            maxTotalDeposits,
            totalDeposits,
            createdDate,
            inactive: data.inactive,
          };
        })
        .catch((err) => {
          throw err;
        });
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
  if (!inactive) {
    if (openToDeposits && totalDeposits < maxTotalDeposit) {
      status = `open until ${formatDate(closeDate)}`;
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

  if (!inactive) {
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
    <div className="flex my-2 py-2 border-b border-gray-90">
      <div className="w-8">
        <p className={`h-5 w-5 rounded-full ${styles}`}></p>
      </div>
      <span className="text-sm' mx-1 text-gray-300 w-28">
        {formattedAddress}
      </span>
      <span className="text-sm mx-2 text-gray-300">{createdDate}</span>
      <span className="text-sm mx-2 text-gray-300 w-40">{status}</span>
      <span className="text-sm mx-2  text-gray-300  w-20">
        {depositors ? `${depositors / 1000} k` : "-"}
      </span>
      <span className="text-sm mx-2 text-gray-300 w-20">
        {`${totalDeposits} DAI`}
      </span>
      <span className="text-sm mx-2 text-gray-300 w-16">-</span>
      <span className="text-sm mx-2 text-gray-300 w-24">
        {totalDistributions}
      </span>
      <span className="text-sm mx-4 text-gray-300 w-20">{lpDeposits}</span>
      <span className="text-sm mx-2 text-gray-300 w-24">
        {claimedDistributions}
      </span>
      <span>
        <Button
          className={`text-xs mx-4 rounded-full p-2 px-4 w-36 ml-8 ${buttonStyles}`}
          link={link}>
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

SyndicateItem.propTypes = {
  address: PropTypes.string.isRequired,
  createdDate: PropTypes.string,
  closeDate: PropTypes.string,
  depositors: PropTypes.string,
  deposits: PropTypes.string,
  activity: PropTypes.string,
  styles: PropTypes.string,
  inactive: PropTypes.bool.isRequired,
  syndicateOpen: PropTypes.string,
  maxTotalDeposits: PropTypes.string,
  web3: PropTypes.any,
};

export default connect(mapStateToProps)(SyndicateItem);
