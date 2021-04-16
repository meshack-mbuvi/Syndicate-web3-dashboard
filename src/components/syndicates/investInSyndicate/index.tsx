import { Validate } from "@/utils/inputValidators";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
// action to initiate wallet connect
import { showWalletModal } from "src/redux/actions/web3Provider";
// utils
import { toEther } from "src/utils";
import { DetailsCard } from "../shared";

const Web3 = require("web3");

const InvestInSyndicate = (props) => {
  const {
    web3: { syndicateInstance, account, daiContract },
    dispatch,
    syndicate,
    withdrawalMode,
    depositMode,
  } = props;
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [myLPDeposits, setMyLPDeposits] = useState<string>("0");
  const [mySyndicateshare, setMySyndicateShare] = useState<string>("0");
  const [myClaimedDistributions, setMyClaimedDistributions] = useState<string>(
    "0"
  );
  const [myWithdrawsToDate, setMyWithdrawsToDate] = useState<string>("0");
  const [
    withdrawalsToDepositPercentage,
    setWithdrawalsToDepositPercentage,
  ] = useState<string>("0");
  const [
    totalAvailableDistributions,
    setTotalAvailableDistributions,
  ] = useState<string>("0");

  // TODO: To update this dynamically from drop-down based on available ERC20
  const [currentERC20, setCurrentERC20] = useState<string>(account);
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositAmountError, setDepositAmountError] = useState("");

  const sections = [
    {
      header: "My Deposits",
      subText: `${myLPDeposits} ${currentERC20} ($${parseInt(
        myLPDeposits
      ).toFixed(2)})`,
    },
    { header: "My % of This Syndicate", subText: mySyndicateshare },
    {
      header: "My Distributions to Date",
      subText: `${myClaimedDistributions} ${currentERC20}`,
    },
    {
      header: "My Withdraws to Date",
      subText: `${myWithdrawsToDate} ${currentERC20}`,
    },
    {
      header: "Total Withdraws / Deposits",
      subText: `${withdrawalsToDepositPercentage} %`,
    },
  ];

  /**
   * all syndicates are handled by the SyndicateSPV contract, so the contract
   * address is the same for all of them while the spvAddress that is passed
   * into the contract is different
   */
  const { syndicateAddress } = router.query;

  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  /**
   * get wallet total deposits
   */
  useEffect(() => {
    if (syndicateInstance) {
      getSyndicateLPDeposits();
    }
  }, [account, syndicateInstance]);

  /**
   * whenever we get syndicate details, we neet to trigger calculation of wallet
   * syndicate share.
   */
  useEffect(() => {
    if (syndicate) {
      calculateMyLPShare();

      // get claimed distrbutions.
      // this updates the value of 'My Distributions to Date' on the UI
      getClaimedDistributions(syndicateAddress, account, daiContract._address);

      // get total distributions.
      // this updates the distributions available value on the syndicate page
      getTotalDistributions(syndicateAddress, daiContract._address);
    }
  }, [syndicate]);

  /**
   *
   * calculate my % share in syndicate
   */
  useEffect(() => {
    calculateMyLPShare();
  }, [myLPDeposits]);

  /**
   * Calculates the % share of the wallet onwer(lpAddress) which is a ration of
   * the total investments made by the wallet to the total deposits made in the
   * syndicate. This value is then converted to %
   * @returns
   */
  const calculateMyLPShare = () => {
    if (syndicate === null) {
      return;
    }

    const myLPDepositsNum = parseInt(myLPDeposits, 10);

    /** Zero deposits into a syndicate with zero total deposits
     * should return 0%. Otherwise, calculate percentage.
     * */
    const MySyndicateShare =
      myLPDepositsNum === 0
        ? 0
        : (parseInt(myLPDeposits, 10) * 100) / syndicate.totalDeposits;

    // update mySindicateShare percentage state.
    setMySyndicateShare(`${MySyndicateShare} %`);
  };

  /**
   * Retrieves syndicateInfo for the connected wallet. We need to find out
   * how much the wallet account has invested in this syndicate, and then use
   * this date in calculateMyLPShare() above to caluclate the share of the account.
   * @returns
   */
  const getSyndicateLPDeposits = async () => {
    if (!syndicateInstance) return;
    try {
      const syndicateLPInfo = await syndicateInstance.getSyndicateLPInfo(
        syndicateAddress,
        account
      );

      const myTotalLPDeposits = web3.utils.fromWei(
        syndicateLPInfo[0].toString()
      );

      const withdrawalsToDate = web3.utils.fromWei(
        syndicateLPInfo[1].toString()
      );

      const withdrawalsToDepositPercentage =
        parseInt(myTotalLPDeposits) <= 0
          ? 0
          : (parseInt(withdrawalsToDate) / parseInt(myTotalLPDeposits)) * 100;

      // sets 'My Deposits' field
      setMyLPDeposits(`${myTotalLPDeposits}`);

      // sets 'My Withdraws to Date' field
      setMyWithdrawsToDate(`${withdrawalsToDate}`);

      // sets 'Total Withdraws / Deposits' field

      setWithdrawalsToDepositPercentage(`${withdrawalsToDepositPercentage}`);

      return myTotalLPDeposits;
    } catch (error) {
      console.log({ error });
    }
  };

  // Approve sending the daiBalance from the user to the manager. Note that the
  // approval goes to the contract, since that is what executes the transferFrom
  // call.
  // See https://forum.openzeppelin.com/t/uniswap-transferfrom-error-dai-insufficient-allowance/4996/4
  // and https://forum.openzeppelin.com/t/example-on-how-to-use-erc20-token-in-another-contract/1682
  // This prevents the error "Dai/insufficient-allowance"
  // Setting an amount specifies the approval level
  const approveManager = async (account, managerAddress, amount) => {
    const amountDai = toEther(amount).toString();

    try {
      await daiContract.methods
        .approve(managerAddress, amountDai)
        .send({ from: account, gasLimit: 800000 });

      // Check the approval amount
      /** @returns string */
      const daiAllowance = await daiContract.methods
        .allowance(account.toString(), managerAddress)
        .call({ from: account });

      return parseInt(daiAllowance);
    } catch (approveError) {
      console.log({ approveError });
      return 0;
    }
  };

  /** This method gets a Syndicate's total distributions for a given ERC20
   * @param syndicateAddress The address of the Syndicate
   * @param distributionERC20ContractAddress The address of the ERC20
   * to return total distributions
   * @return totalDistributions for a given distributionERC20ContractAddress
   * */
  const getTotalDistributions = async (
    address: string | string[],
    distributionERC20ContractAddress: string | string[]
  ) => {
    try {
      const totalDistributions = await syndicateInstance.getTotalDistributions(
        address,
        distributionERC20ContractAddress,
        { from: account, gasLimit: 800000 }
      );

      setTotalAvailableDistributions(
        web3.utils.fromWei(totalDistributions.toString())
      );
    } catch (error) {
      console.log({ error });
    }
  };

  /** Method to get an LP's claimed distributions for a given ERC20
   * @param syndicateAddress The address of the Syndicate
   * @param lpAddress The address of the LP whose info is being queried
   * @param distributionERC20ContractAddress The address of the ERC20
   * to return the LP's claimed distributions
   * @return claimedDistributions by an LP for a given
   * distributionERC20ContractAddress
   * */
  const getClaimedDistributions = async (
    address: string | string[],
    lpAddress: string,
    ERC20ContractAddress: string
  ) => {
    try {
      const claimedDistributions = await syndicateInstance.getClaimedDistributions(
        address,
        lpAddress,
        ERC20ContractAddress,
        { from: account, gasLimit: 800000 }
      );

      setMyClaimedDistributions(
        web3.utils.fromWei(claimedDistributions.toString())
      );
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    //
    /**
     * When contract instance is null or undefined, we can't access syndicate
     * address so we need to connect to wallet first which will handle contract
     * instantiation.
     */
    if (!syndicateInstance) {
      dispatch(showWalletModal());
    }
  }, [syndicateInstance]);

  const handleSetAmount = (event: any) => {
    event.preventDefault();
    const { value } = event.target;

    setDepositAmount(value);

    const message = Validate(value);
    if (message) {
      setDepositAmountError(`Deposit amount ${message}`);
    } else {
      setDepositAmountError("");
    }
  };

  /**
   * This methods is used to invest in LP(syndicate)
   * The account that is investing is obtained from the connected wallet from
   * which funds will be transferred.
   *
   * Note: For a user to invest in LP, s/he must be an accredited investor,
   * which we get from the checkbox on this form
   *
   * The LpAddress is obtained from the page params
   * @param {object} data contains depositAmount, and accredited
   */
  const investInSyndicate = async (depositAmount: number) => {
    /**
     * All addresses are allowed, and investments can be rejected after the
     * fact. This is useful if you want to allow anyone to invest in an SPV
     *  (for example, for a non-profit might enable this because there is
     * no expectation of profits and therefore they wouldn't need to be as
     * concerned about US securities regulations)
     * Addresses must be pre-approved by the manager and added to the
     * allowlist before an LP can invest.
     */

    /**
     * If deposit amount exceeds the allowed investment deposit, this will fail.
     */
    const amountToInvest = toEther(depositAmount);
    await syndicateInstance.lpInvestInSyndicate(
      syndicateAddress,
      amountToInvest,
      { from: account, gasLimit: 800000 }
    );
  };

  /** method used by an LP to withdraw from a syndicate
   * @param withdrawAmount The amount to withdraw from the syndicate.
   * If withdrawal amount exceeds the amount of unclaimed distribution, this would fail.
   */
  const withdrawFromSyndicate = async (withdrawAmount: number) => {
    const amountToWithdraw = toEther(withdrawAmount);
    try {
      /** This method is used by an LP to withdraw a deposit or distribution from a Syndicate
       * @param syndicateAddress The Syndicate that an LP wants to withdraw from
       * @param erc20ContractAddress The ERC 20 address to be transferred from the
       * manager to the LP.
       * @param amount The amount to withdraw
       */
      await syndicateInstance.lpWithdrawFromSyndicate(
        syndicateAddress,
        daiContract._address,
        amountToWithdraw,
        { from: account, gasLimit: 800000 }
      );

      // TODO: Add success message on the UI.
    } catch (error) {
      console.log({ error });
      // TODO: Add error message on the UI.
    }
  };

  // handle deposit/withdrawal form submit.
  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (!syndicateInstance) {
      // user needs to connect wallet first
      return dispatch(showWalletModal());
    }

    setSubmitting(true);

    const approvedAllowance = await approveManager(
      account,
      syndicateInstance.address,
      depositAmount
    );

    if (approvedAllowance === 0) {
      // inform user that his account does not have allowance to invest.
      setSubmitting(false);
      return;
    }

    // Call invest or withdrawal functions based on current state.
    try {
      if (depositMode) {
        await investInSyndicate(depositAmount);
      }

      if (withdrawalMode) {
        await withdrawFromSyndicate(depositAmount);
      }

      setSubmitting(false);
    } catch (error) {
      // show error message for failed investment
      console.log({ error });
      setSubmitting(false);
    }
  };

  // set title and texts of section based on whether this is a withdrawal or a deposit.
  let titleText = "Deposit Into Syndicate";
  let statusApprovedText = "Whitelist enabled: You’re pre-approved";
  let statusNotApprovedText =
    "Whitelist disabled: You will need to be approved";
  let disclaimerText =
    "All deposits are final and can only be changed by Syndicate leads.";
  if (withdrawalMode) {
    titleText = "Withdraw My Distributions.";

    // update actual amounts on this text after receiving syndicate details

    statusApprovedText = `${totalAvailableDistributions} ${currentERC20} ($${totalAvailableDistributions}) distributions available.`;
    disclaimerText = "Remember, all withdraws are final.";
  }

  return (
    <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
      <div className="h-fit-content rounded-t-md mx-2 lg:p-6 bg-gray-9 sm:ml-6 border border-b-0 border-gray-49">
        {syndicate !== null ? (
          <>
            <p className="fold-bold text-xl p-4">{titleText}</p>

            <div className="px-2">
              {/* show this text if whitelist is enabled for deposits */}
              <p className="ml-4 py-4 text-green-screamin font-ibm">
                {syndicate?.allowlistEnabled
                  ? statusApprovedText
                  : statusNotApprovedText}
              </p>

              <form onSubmit={onSubmit}>
                <div className="flex justify-between my-1">
                  <input
                    name="depositAmount"
                    type="text"
                    placeholder="400"
                    onChange={handleSetAmount}
                    className={`rounded-md bg-gray-9 border border-gray-24 text-white focus:outline-none focus:ring-gray-24 focus:border-gray-24 font-ibm ${
                      withdrawalMode ? "mb-5" : "mb-0"
                    }`}
                  />

                  {/* In the new design, this would be a drop down from which
                a user selects currency */}
                  <p className="flex justify-between pt-2">
                    <span className="mx-2">
                      <img src="/images/usdcIcon.svg" />
                    </span>
                    USDC
                  </p>
                </div>

                {depositAmountError ? (
                  <p className="mr-2 w-full text-red-500 text-sm -mt-3 mb-4">
                    {depositAmountError}
                  </p>
                ) : null}
                {/* checkbox for user to confirm they are accredited investor if this is a deposit */}
                {depositMode ? (
                  <p className="text-sm my-5 text-gray-dim">
                    By depositing tokens, you attest you are accredited below to
                    join this syndicate. After depositing, contact the syndicate
                    leads to confirm receipt and withdraw timing.
                  </p>
                ) : null}

                {/* when form submittion is triggered, we show loader, otherwise
                we show submit button */}
                {submitting ? (
                  <div className="loader ease-linear rounded-full border-8 border-t-8 border-white h-4 w-4"></div>
                ) : (
                  <button
                    className={`flex w-full items-center justify-center font-medium rounded-md text-black bg-white focus:outline-none focus:ring py-4 ${
                      depositAmountError ? "opacity-50" : ""
                    }`}
                    type="submit"
                    disabled={depositAmountError ? true : false}>
                    Continue
                  </button>
                )}

                <div className="flex justify-center">
                  <div className="w-2/3 text-sm my-5 text-gray-dim justify-self-center text-center">
                    {disclaimerText}
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex justify-center">
            <p>
              No syndicate with given address. Please check the address
              provided.
            </p>
          </div>
        )}
      </div>

      {/* This component should be shown when we have details about user deposits */}
      {/* <div className="ml-6 border border-gray-49"> */}
      <DetailsCard
        {...{ title: "My Stats", sections }}
        customStyles={
          "sm:ml-6 p-4 mx-2 sm:px-8 sm:py-4 sm:ml-0 rounded-b-md border border-gray-49"
        }
      />
      {/* </div> */}
    </div>
  );
};

const mapStateToProps = ({ web3Reducer }) => {
  const { web3, withdrawalMode, depositMode } = web3Reducer;
  return { web3, withdrawalMode, depositMode };
};

InvestInSyndicate.propTypes = {
  web3: PropTypes.any,
  dispatch: PropTypes.any,
  syndicate: PropTypes.object,
  withdrawalMode: PropTypes.any,
  depositMode: PropTypes.any,
};

export default connect(mapStateToProps)(InvestInSyndicate);
