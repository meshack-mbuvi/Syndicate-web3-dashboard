import ErrorBoundary from "@/components/errorBoundary";
import { getTotalDistributions } from "@/helpers";
import { Validate } from "@/utils/validators";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
// ABI
import syndicateABI from "src/contracts/Syndicate.json";
import { approveManager } from "src/helpers/approveAllowance";
import { setSyndicateDetails } from "src/redux/actions/syndicateDetails";
import { updateSyndicateLPDetails } from "src/redux/actions/syndicateLPDetails";
// actions
import { showWalletModal } from "src/redux/actions/web3Provider";
// utils and helpers
import { toEther } from "src/utils";
import ERC20ABI from "src/utils/abi/rinkeby-dai";
import { floatedNumberWithCommas } from "src/utils/numberWithCommas";
// shared components
import { DetailsCard } from "../shared";
import {
  constants,
  myDepositsToolTip,
  myDistributionsToDateToolTip,
  myPercentageOfThisSyndicateToolTip,
  myWithDrawalsToDateTooltip,
  withdrawalsToDepositPercentageToolTip,
} from "../shared/Constants";
import { TokenSelect } from "../shared/tokenSelect";

const Web3 = require("web3");

interface InvestInSyndicateProps {
  web3: any;
  syndicate: any;
  syndicateAction: any;
  syndicateLPDetails: any;
}

const InvestInSyndicate = (props: InvestInSyndicateProps) => {
  const {
    web3: { syndicateInstance, account },
    syndicate,
    syndicateAction,
    syndicateLPDetails,
  } = props;
  const router = useRouter();

  const dispatch = useDispatch();

  // the block on which the contract was deployed.
  // we'll start listening to events starting from here.
  const startBlock = process.env.NEXT_PUBLIC_FROM_BLOCK;

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [
    totalAvailableDistributions,
    setTotalAvailableDistributions,
  ] = useState<string>("0");

  const [depositAmount, setDepositAmount] = useState(0);
  const [depositAmountError, setDepositAmountError] = useState("");
  const [currentERC20] = useState<string>("DAI");
  const [currentERC20Contract, setCurrentERC20Contract] = useState({});
  const [
    depositsAndWithdrawalsAvailable,
    setDepositsAndWithdrawalsAvailable,
  ] = useState<Boolean>(true);

  const {
    myDeposits,
    myPercentageOfThisSyndicate,
    withdrawalsToDepositPercentage,
    myWithdrawalsToDate,
    myDistributionsToDate,
  } = syndicateLPDetails;

  const { withdraw, deposit, generalView } = syndicateAction;

  const sections = [
    {
      header: "My Deposits",
      subText: `${myDeposits} ${currentERC20} ($${floatedNumberWithCommas(
        myDeposits
      )})`,
      toolTip: myDepositsToolTip,
    },
    {
      header: "My % of This Syndicate",
      subText: `${myPercentageOfThisSyndicate}%`,
      toolTip: myPercentageOfThisSyndicateToolTip,
    },
    {
      header: "My Distributions to Date",
      subText: `${myDistributionsToDate} ${currentERC20}`,
      toolTip: myDistributionsToDateToolTip,
    },
    {
      header: "My Withdraws to Date",
      subText: `${myWithdrawalsToDate} ${currentERC20}`,
      toolTip: myWithDrawalsToDateTooltip,
    },
    {
      header: "Total Withdraws / Deposits",
      subText: `${withdrawalsToDepositPercentage}%`,
      toolTip:withdrawalsToDepositPercentageToolTip,
    },
  ];

  /**
   * all syndicates are handled by the Syndicate contract, so the contract
   * address is the same for all of them while the syndicate address that is passed
   * into the contract is different
   */
  const { syndicateAddress } = router.query;
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  // check whether the current syndicate is accepting deposits
  // or withdrawals
  useEffect(() => {
    if (syndicate) {
      const { syndicateOpen, distributionsEnabled } = syndicate;

      // if a syndicate is closed and distributions have not been enabled
      // the LP cannot deposit or withdraw from it.
      const closedToDepositsWithNoDistribution =
        !syndicateOpen && !distributionsEnabled;

      if (closedToDepositsWithNoDistribution) {
        setDepositsAndWithdrawalsAvailable(false);
      }
    }
  }, [syndicate]);

  // get values for the current LP(connected wallet account)
  // when this component initially renders.
  useEffect(() => {
    const lpAccount = account;
    dispatch(
      updateSyndicateLPDetails({
        syndicateInstance,
        lpAccount,
        syndicateAddress,
        syndicate,
        web3,
        totalAvailableDistributions,
      })
    );
  }, [
    syndicate,
    syndicateInstance,
    currentERC20Contract,
    totalAvailableDistributions,
  ]);

  useEffect(() => {
    // set up syndicate contract to listen to events.
    if (syndicateInstance && syndicate) {
      // set up current ERC20Contract and
      // and save it to the local state
      const ERC20Contract = new web3.eth.Contract(
        ERC20ABI,
        syndicate.depositERC20ContractAddress
      );

      setCurrentERC20Contract(ERC20Contract);

      // set up syndicate contract.
      const syndicateContract = new web3.eth.Contract(
        syndicateABI.abi,
        syndicateInstance.address
      );

      // subscribe to deposit and withdraw events
      // we can only trigger an update to syndicate LP details once this
      // event is emitted
      syndicateContract.events
        .lpInvestedInSyndicate({
          filter: { lpAddress: account },
          fromBlock: startBlock,
        })
        .on("data", () => {
          // once event is emitted, dispatch action to save
          // the latest syndicate LP details to the redux store.
          const lpAccount = account;
          dispatch(
            updateSyndicateLPDetails({
              syndicateInstance,
              lpAccount,
              syndicateAddress,
              syndicate,
              web3,
              totalAvailableDistributions,
            })
          );
        })
        .on("error", (error) => console.log({ error }));

      // subscribe to withdraw events.
      syndicateContract.events
        .lpWithdrewDistributionFromSyndicate({
          filter: { lpAddress: account },
          fromBlock: startBlock,
        })
        .on("data", () => {
          // once event is emitted, dispatch action to save
          // the latest syndicate LP details to the redux store.
          const lpAccount = account;
          dispatch(
            updateSyndicateLPDetails({
              syndicateInstance,
              lpAccount,
              syndicateAddress,
              syndicate,
              web3,
              totalAvailableDistributions,
            })
          );
        })
        .on("error", (error) => console.log({ error }));
    }
  }, [syndicateInstance, syndicate]);

  /**
   * whenever we get syndicate details, we neet to trigger calculation of wallet
   * syndicate share.
   */
  useEffect(() => {
    if (syndicate && syndicateInstance) {
      // get total distributions.
      // this updates the distributions available value on the syndicate page
      getTotalDistributions(
        syndicateInstance,
        syndicateAddress,
        syndicate.depositERC20ContractAddress,
        account
      ).then((totalDistributions: string) => {
        setTotalAvailableDistributions(
          web3.utils.fromWei(totalDistributions.toString())
        );
      });
    }
  }, [syndicate, account, syndicateInstance, currentERC20Contract]);

  useEffect(() => {
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
   * The syndicate address is obtained from the page params
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
    try {
      await syndicateInstance.lpInvestInSyndicate(
        syndicateAddress,
        amountToInvest,
        { from: account, gasLimit: 800000 }
      );
    } catch (err) {
      console.log(err);
    }

    // dispatch action to get details about the syndicate
    // These values will be used to update syndicate details
    // under the graph section on the UI.
    const {
      depositERC20ContractAddress,
      profitShareToSyndicateLead,
      profitShareToSyndicateProtocol,
    } = syndicate;
    dispatch(
      setSyndicateDetails(
        syndicateInstance,
        depositERC20ContractAddress,
        profitShareToSyndicateLead,
        profitShareToSyndicateProtocol,
        syndicate
      )
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
        syndicate.depositERC20ContractAddress,
        amountToWithdraw,
        { from: account, gasLimit: 800000 }
      );

      // update redux store with new syndicate details
      // dispatch action to get details about the syndicate
      // These values will be used to update syndicate details
      // under the graph section on the UI.
      const {
        depositERC20ContractAddress,
        profitShareToSyndicateLead,
        profitShareToSyndicateProtocol,
      } = syndicate;

      dispatch(
        setSyndicateDetails(
          syndicateInstance,
          depositERC20ContractAddress,
          profitShareToSyndicateLead,
          profitShareToSyndicateProtocol,
          syndicate
        )
      );

      // TODO: Add success message on the UI.
    } catch (error) {
      console.log({ error });
      // TODO: Add error message on the UI.
    }
  };

  // consolidate all deposit modes
  // the 'view' (generalView state ) and 'deposit more' (deposit state) buttons
  // will load deposit components
  const depositModes = deposit || generalView;

  // handle deposit/withdrawal form submit.
  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (!syndicateInstance) {
      // user needs to connect wallet first
      return dispatch(showWalletModal());
    }

    setSubmitting(true);

    const approvedAllowance = await approveManager(
      currentERC20Contract,
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
    // deposit - page is in deposit mode
    // withdraw - page is in withdraw mode
    // these values are fetched from the redux store.
    try {
      if (depositModes) {
        await investInSyndicate(depositAmount);
      }

      if (withdraw) {
        await withdrawFromSyndicate(depositAmount);
      }

      setSubmitting(false);
    } catch (error) {
      // show error message for failed investment
      console.log({ error });
      setSubmitting(false);
    }
  };

  // set title and texts of section based on
  // whether this is a withdrawal or a deposit.
  const totalDistributionsText = `${floatedNumberWithCommas(
    totalAvailableDistributions
  )} ${currentERC20} ($${floatedNumberWithCommas(
    totalAvailableDistributions
  )}) distributions available.`;
  const {
    depositTitleText,
    depositMoreTitleText,
    depositStatusApprovedText,
    depositStatusNotApprovedText,
    depositDisclaimerText,
    depositLPAccreditedText,
    withdrawalTitleText,
    withdrawalDisclaimerText,
    noSyndicateText,
    depositsAndWithdrawalsUnavailableText,
    depositsAndWithdrawalsUnavailableTitleText,
  } = constants;

  // check if LP address is on the allowed address list
  const { myAddressAllowed } = syndicateLPDetails;

  return (
    <ErrorBoundary>
      <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
        <div className="h-fit-content rounded-t-custom mx-2 p-4 pb-2 md:p-6 bg-gray-9 sm:ml-6 border border-b-0 border-gray-49">
          {syndicate !== null ? (
            depositsAndWithdrawalsAvailable ? (
              <>
                <p className="font-semibold text-xl p-2">
                  {deposit
                    ? depositMoreTitleText
                    : generalView
                    ? depositTitleText
                    : withdrawalTitleText}
                </p>

                <div className="px-2">
                  {/* show this text if whitelist is enabled for deposits */}
                  <p className="py-4 pt-2 text-green-screamin font-ibm">
                    {depositModes
                      ? myAddressAllowed
                        ? depositStatusApprovedText
                        : depositStatusNotApprovedText
                      : withdraw
                      ? totalDistributionsText
                      : null}
                  </p>

                  <form onSubmit={onSubmit}>
                    <div className="flex justify-between my-1">
                      <input
                        name="depositAmount"
                        type="text"
                        placeholder="400"
                        onChange={handleSetAmount}
                        className={`rounded-md bg-gray-9 border border-gray-24 text-white focus:outline-none focus:ring-gray-24 focus:border-gray-24 font-ibm w-7/12 mr-2 ${
                          withdraw ? "mb-5" : "mb-0"
                        }`}
                      />

                      {/* In the new design, this would be a drop down from which
                a user selects currency */}
                      {withdraw ? (
                        <TokenSelect />
                      ) : (
                        <p className="pt-2 w-4/12">{currentERC20}</p>
                      )}
                    </div>

                    {depositAmountError ? (
                      <p className="mr-2 w-full text-red-500 text-sm -mt-3 mb-4">
                        {depositAmountError}
                      </p>
                    ) : null}
                    {/* checkbox for user to confirm they are accredited investor if this is a deposit */}
                    {depositModes ? (
                      <p className="text-sm my-5 text-gray-dim">
                        {depositLPAccreditedText}
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
                        {depositModes
                          ? depositDisclaimerText
                          : withdrawalDisclaimerText}
                      </div>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div>
                <p className="font-semibold text-xl p-2">
                  {depositsAndWithdrawalsUnavailableTitleText}
                </p>
                <p className="p-4 pl-6 text-gray-dim text-sm">
                  {depositsAndWithdrawalsUnavailableText}
                </p>
              </div>
            )
          ) : (
            <div className="flex justify-center">
              <p>{noSyndicateText}</p>
            </div>
          )}
        </div>

        {/* This component should be shown when we have details about user deposits */}
        <DetailsCard
          {...{ title: "My Stats", sections }}
          customStyles={
            "sm:ml-6 p-4 mx-2 sm:px-8 sm:py-4 rounded-b-custom bg-gray-9 border border-gray-49"
          }
          customInnerWidth={"w-full"}
        />

        {syndicate?.syndicateOpen && myDeposits > 0 ? (
          <>
            <p className="sm:ml-2 p-4 mx-2 sm:px-8 sm:py-4 text-xs text-gray-dim leading-4">
              MORE
            </p>
            <div className="flex justify-start py-4 px-6 sm:ml-6 mx-2 rounded-custom bg-gray-9">
              <img
                className="mr-4 h-6"
                src="/images/withdrawDepositIcon.jpeg"
                alt="share"
              />
              <p className="font-medium text-lg">Withdraw My Deposit</p>
            </div>
          </>
        ) : null}
      </div>
    </ErrorBoundary>
  );
};

const mapStateToProps = ({ web3Reducer, syndicateLPDetailsReducer }) => {
  const { web3, syndicateAction } = web3Reducer;
  const {
    syndicateLPDetails,
    syndicateLPDetailsLoading,
  } = syndicateLPDetailsReducer;
  return {
    web3,
    syndicateAction,
    syndicateLPDetails,
    syndicateLPDetailsLoading,
  };
};

InvestInSyndicate.propTypes = {
  web3: PropTypes.any,
  dispatch: PropTypes.any,
  syndicate: PropTypes.object,
};

export default connect(mapStateToProps)(InvestInSyndicate);
