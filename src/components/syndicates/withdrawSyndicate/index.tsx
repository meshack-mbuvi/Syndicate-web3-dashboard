import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import ErrorBoundary from "@/components/errorBoundary";
import { ErrorModal } from "@/components/shared";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { getWeiAmount } from "@/utils/conversions";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { floatedNumberWithCommas } from "@/utils/numberWithCommas";
import { showWalletModal } from "@/redux/actions";
import { ERC20TokenDetails } from "@/utils/ERC20Methods";
import { Validate } from "@/utils/validators";
import { getMetamaskError } from "@/helpers";
import { TokenMappings } from "@/utils/tokenMappings";
import { updateSyndicateMemberInfo } from "@/redux/actions/syndicateMemberDetails/updateMemberInfo";

import {
  constants,
  myDepositsToolTip,
  myDistributionsToDateToolTip,
  myPercentageOfThisSyndicateToolTip,
  myWithDrawalsToDateTooltip,
  walletConfirmConstants,
  withdrawalsToDepositPercentageToolTip,
} from "../shared/Constants";
import { DetailsCard } from "../shared";
import { SyndicateActionLoader } from "../shared/syndicateActionLoader";
import { UnavailableState } from "../shared/unavailableState";
import { SyndicateActionButton } from "../shared/syndicateActionButton";
import { TokenSelect } from "../shared/tokenSelect";
import { useUnavailableState } from "../hooks/useUnavailableState";


const {
  actionFailedError,
  amountGreaterThanMemberDistributionsText,
  depositsAndWithdrawalsUnavailableText,
  depositsAndWithdrawalsUnavailableTitleText,
  dismissButtonText,
  loaderGeneralHeaderText,
  loaderWithdrawalHeaderText,
  nonMemberWithdrawalText,
  nonMemberWithdrawalTitleText,
  withdrawalAllowanceInsufficientText,
  withdrawalAmountGreaterThanMemberDeposits,
  withdrawalAmountLessThanMinDepositErrorText,
  withdrawalDepositTitleText,
  withdrawalDisclaimerText,
  withdrawalSuccessButtonText,
  withdrawalSuccessSubtext,
  withdrawalSuccessTitleText,
  withdrawalsUnavailableTitleText,
  withdrawalTitleText,
} = constants;

// texts for metamask confirmation pending
const {
  walletPendingConfirmPendingTitleText,
  walletPendingConfirmPendingMessage,
} = walletConfirmConstants;


const WithdrawSyndicate = () => {
  const {
    tokenDetailsReducer: { distributionTokensAllowanceDetails },
    syndicateInstanceReducer: { syndicateContractInstance },
    syndicateLPDetailsReducer: { syndicateLPDetails },
    syndicatesReducer: { syndicate },
    web3Reducer: {
      web3: { account },
      syndicateAction,
    },
  } = useSelector((state: RootState) => state);

  const router = useRouter();
  const dispatch = useDispatch();

  const { title, message, renderUnavailableState } = useUnavailableState();

  // STATES
  const [withdrawalsAvailable, setWithdrawalsAvailable] = useState<Boolean>(true);
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState<boolean>(false);
  const [currentDistributionTokenDecimals, setCurrentDistributionTokenDecimals] = useState<number>(18);
  const [currentDistributionTokenAddress, setCurrentDistributionTokenAddress] = useState<string>("");
  const [metamaskConfirmPending, setMetamaskConfirmPending] = useState<boolean>(false);
  const [successfulWithdrawal, setSuccessfulWithdrawal] = useState<boolean>(false);
  const [metamaskWithdrawError, setMetamaskWithdrawError] = useState<string>("");
  const [withdrawalFailed, setWithdrawalFailed] = useState<boolean>(false);
  const [loadingLPDetails, setLoadingLPDetails] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [currentERC20, setCurrentERC20] = useState<string>("DAI");
  const [amountError, setAmountError] = useState<string>("");
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [totalAvailableDistributions, setTotalAvailableDistributions] = useState<string>("0");
  const [currentDistributionTokenSymbol, setCurrentDistributionTokenSymbol] = useState<string>("");
  const [amountGreaterThanMemberDistributions, setAmountGreaterThanMemberDistributions] = useState<boolean>(false);
  const [withdrawalAmountGreaterThanDeposits, setWithdrawalAmountGreaterThanDeposits] = useState<boolean>(false);
  const [withdrawalAmountLessThanMinDeposits, setWithdrawalAmountLessThanMinDeposits] = useState<boolean>(false);
  const [currentERC20Decimals, setCurrentERC20Decimals] = useState<number>(18);


  // DEFINITIONS
  const { syndicateAddress } = router.query;
  const { withdraw } = syndicateAction;
  const {
    myDeposits,
    withdrawalsToDepositPercentage,
    myDistributionsToDate,
    myWithdrawalsToDate,
    myPercentageOfThisSyndicate,
  } = syndicateLPDetails;

  let showDepositLink = false;

  const WithdrawalSections = [
    {
      header: "My Distributions to Date",
      subText: `${myDistributionsToDate} ${currentERC20}`,
      tooltip: myDistributionsToDateToolTip,
      screen: "withdrawal",
    },
    {
      header: "My Withdraws to Date",
      subText: `${myWithdrawalsToDate} ${currentERC20}`,
      tooltip: myWithDrawalsToDateTooltip,
      screen: "withdrawal",
    },
    {
      header: "Total Withdraws / Deposits",
      subText: `${withdrawalsToDepositPercentage}%`,
      tooltip: withdrawalsToDepositPercentageToolTip,
      screen: "withdrawal",
    },
  ];

  const depositSections = [
    {
      header: "My Deposits",
      subText: `${myDeposits} ${currentERC20} ($${myDeposits})`,
      tooltip: myDepositsToolTip,
      screen: "deposit",
    },
    {
      header: "My % of This Syndicate",
      subText: `${myPercentageOfThisSyndicate}%`,
      tooltip: myPercentageOfThisSyndicateToolTip,
      screen: "deposit",
    },
  ];

  // HOOKS

  // check whether the current syndicate is accepting withdrawals
  useEffect(() => {
    if (syndicate) {
      const {
        depositsEnabled,
        distributionsEnabled,
      } = syndicate;

      // if a syndicate is closed and distributions have not been enabled
      // the member cannot withdraw from it.
      if (!depositsEnabled && !distributionsEnabled) {
        setWithdrawalsAvailable(false);
      } else {
        setWithdrawalsAvailable(true);
      }
    }
  }, [syndicate]);

  // get values for the current LP(connected wallet account)
  // when this component initially renders.
  useEffect(() => {
    if (account && syndicateContractInstance && syndicate) {
      setLoadingLPDetails(true);
      // storing member details when totalAvailableDistributions is undefined will reset its previous value when withdrawal is in progress.
      if (totalAvailableDistributions && +myDistributionsToDate === 0) {
        storeMemberDetails();
      }

      setLoadingLPDetails(false);
    }
  }, [
    syndicate,
    syndicateContractInstance,
    totalAvailableDistributions,
    account,
  ]);

  // set token symbol based on deposit token address
  // we'll manually map the token symbol for now.
  // we'll also set the token decimals of the deposit/Withdrawal ERC20 token here
  useEffect(() => {
    if (syndicate) {
      // set token symbol based on token address
      const tokenAddress = syndicate.depositERC20Address;
      const mappedTokenAddress = Object.keys(TokenMappings).find(
        (key) => key.toLowerCase() == tokenAddress.toLowerCase()
      );
      if (mappedTokenAddress) {
        setCurrentERC20(TokenMappings[mappedTokenAddress]);
      }

      // set token decimal places.
      getTokenDecimals(tokenAddress);
    }
  }, [syndicate]);

  // check for errors on the member withdrawal page.
  useEffect(() => {
    if (syndicate && syndicateLPDetails) {
      // show error when amount is greater than member's available distributions.
      // or when the amount is greater than member deposits(members is withdrawing their deposits)
      // or when the member's deposits minus the amount exceeds the minimum member deposit.
      const amountGreaterThanMemberDistributions =
        +amount > +myDistributionsToDate;
      const amountGreaterThanMemberDeposits = +amount > +myDeposits;
      const { depositMinMember } = syndicate;
      const amountLessThanMinDeposits =
        +myDeposits - +amount < depositMinMember;

      if (
        amountGreaterThanMemberDistributions &&
        syndicate?.distributionsEnabled
      ) {
        setAmountGreaterThanMemberDistributions(true);
        setWithdrawalAmountGreaterThanDeposits(false);
        setWithdrawalAmountLessThanMinDeposits(false);
      } else if (
        amountGreaterThanMemberDeposits &&
        !syndicate?.distributionsEnabled
      ) {
        setWithdrawalAmountGreaterThanDeposits(true);
        setAmountGreaterThanMemberDistributions(false);
        setWithdrawalAmountLessThanMinDeposits(false);
      } else if (
        amountLessThanMinDeposits &&
        !syndicate?.distributionsEnabled
      ) {
        setWithdrawalAmountLessThanMinDeposits(true);
        setWithdrawalAmountGreaterThanDeposits(false);
        setAmountGreaterThanMemberDistributions(false);
      } else {
        setAmountGreaterThanMemberDistributions(false);
        setWithdrawalAmountGreaterThanDeposits(false);
        setWithdrawalAmountLessThanMinDeposits(false);
      }
    }
  }, [amount, syndicateLPDetails]);


  // CONDITIONS

  // set correct loader header text depending on current state
  let loaderHeaderText;
  if (submittingWithdrawal) {
    loaderHeaderText = loaderWithdrawalHeaderText;
  } else {
    loaderHeaderText = loaderGeneralHeaderText;
  }

  // set metamask error message
  let metamaskErrorMessageText = metamaskWithdrawError;
  if (metamaskWithdrawError) {
    metamaskErrorMessageText = metamaskWithdrawError;
  }

  // set correct title text to show on the withdrawal page
  let withdrawalPageTitleText = withdrawalTitleText;
  if (syndicate && syndicate.depositsEnabled) {
    withdrawalPageTitleText = withdrawalDepositTitleText;
  }

  // conditions under which the skeleton loader should be rendered
  const showSkeletonLoader =
    !syndicate ||
    loadingLPDetails ||
    (withdraw &&
      syndicate &&
      syndicate.distributionsEnabled &&
      !distributionTokensAllowanceDetails.length);

  // set title and texts of section based on
  // whether this is a withdrawal or a deposit.
  let totalDistributionsText = `${floatedNumberWithCommas(
    totalAvailableDistributions
  )} ${
    currentDistributionTokenSymbol ? currentDistributionTokenSymbol : ""
  } ($${floatedNumberWithCommas(
    totalAvailableDistributions
  )}) distributions available.`;
  if (syndicate?.depositsEnabled) {
    totalDistributionsText = `${myDeposits} ${
      currentDistributionTokenSymbol ? currentDistributionTokenSymbol : ""
    } ($${myDeposits}) deposits available.`;
  }

  // conditions for showing validation error message
  // error messages will be shown based on whether the current page
  // is the deposit page or the withdrawal page.
  let showValidationError = false;
  if (
    amountError ||
    amountGreaterThanMemberDistributions ||
    withdrawalAmountGreaterThanDeposits ||
    withdrawalAmountLessThanMinDeposits
  ) {
    showValidationError = true;
  } else {
    showValidationError = false;
  }

  // show error message depending on what triggered it on the deposit/withdrawal page
  let errorMessageText = amountError;
  if (
    amountGreaterThanMemberDistributions &&
    syndicate?.distributionsEnabled
  ) {
    errorMessageText = amountGreaterThanMemberDistributionsText;
  } else if (withdrawalAmountGreaterThanDeposits) {
    errorMessageText = withdrawalAmountGreaterThanMemberDeposits;
  } else if (withdrawalAmountLessThanMinDeposits) {
    errorMessageText = withdrawalAmountLessThanMinDepositErrorText;
  } else {
    errorMessageText = amountError;
  }

  // disable the withdraw button if
  // the amount is greater than the member's available distributions
  let disableWithrawButton = false;
  if (
    amountGreaterThanMemberDistributions ||
    withdrawalAmountGreaterThanDeposits ||
    withdrawalAmountLessThanMinDeposits
  ) {
    disableWithrawButton = true;
  }

  // set LP details section based on state
  let sections = depositSections;
  if (withdraw && syndicate?.distributionsEnabled) {
    sections = WithdrawalSections;
  } else if (withdraw && !syndicate?.distributionsEnabled) {
    sections = depositSections;
  }

  if (syndicate) {
    const { allowlistEnabled } = syndicate;
    const { myAddressAllowed } = syndicateLPDetails;

    // On the withdrawal section, show link to deposit page if
    // allowListEnabled is set and member
    // deposit is zero
    if (syndicate.depositsEnabled) {
      if (allowlistEnabled && withdraw && +myDeposits === 0) {
        showDepositLink = myAddressAllowed;
      } else {
        showDepositLink = withdraw && +myDeposits === 0;
      }
    }
  }


  // FUNCTIONS

  /** method used by  Member to withdraw from a syndicate
   * @param withdrawAmount The amount to withdraw from the syndicate.
   * If withdrawal amount exceeds the amount of unclaimed distribution, this would fail.
   */
  const withdrawFromSyndicate = async (withdrawAmount: number) => {
    const amountToWithdraw = getWeiAmount(
      withdrawAmount.toString(),
      currentDistributionTokenDecimals,
      true
    );

    // set tokens to withdraw
    let withdrawalToken = syndicate?.depositERC20Address;
    if (syndicate?.distributionsEnabled) {
      withdrawalToken = currentDistributionTokenAddress;
    }

    try {
      setMetamaskConfirmPending(true);
      /** This method is used by an LP to withdraw a deposit or distribution from a Syndicate
       * @param syndicateAddress The Syndicate that an LP wants to withdraw from
       * @param withdrawalToken The ERC 20 address to be transferred from the
       * manager to the member.
       * @param amountToWithdraw The amount to withdraw
       */
      await syndicateContractInstance.methods
        .memberWithdraw(syndicateAddress, withdrawalToken, amountToWithdraw)
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          // user has confirmed the transaction so we should start loader state.
          // show loading modal
          setMetamaskConfirmPending(false);
          setSubmittingWithdrawal(true);
        })
        .on("receipt", () => {
          // transaction was succesful
          // get syndicate updated values
          dispatch(
            getSyndicateByAddress(syndicateAddress, syndicateContractInstance)
          );

          //store updated member details
          storeMemberDetails();

          setSubmittingWithdrawal(false);
          setSuccessfulWithdrawal(true);
        })
        .on("error", (error) => {
          const { code } = error;
          handleWithdrawalError(code);
        });
    } catch (error) {
      const { code } = error;
      handleWithdrawalError(code);
    }
  };

  // close the syndicate action loader
  const closeSyndicateActionLoader = () => {
    setMetamaskWithdrawError("");
    setSuccessfulWithdrawal(false);
    setMetamaskConfirmPending(false);
  };

  /** Method to store updated member details in the redux store
   * This will be called whenever member details need to be updated
   * after an action.
   */
   const storeMemberDetails = () => {
    dispatch(
      updateSyndicateMemberInfo({
        syndicateAddress,
        totalAvailableDistributions,
        currentERC20Decimals,
        currentDistributionTokenDecimals,
      })
    );
  };

  // handle deposit/withdrawal form submit.
  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (!syndicateContractInstance) {
      // user needs to connect wallet first
      return dispatch(showWalletModal());
    }

    // Call invest or withdrawal functions based on current state.
    // deposit - page is in deposit mode
    // withdraw - page is in withdraw mode
    // these values are fetched from the redux store.
    try {
      if (withdraw) {
        await withdrawFromSyndicate(amount);
      }
    } catch (error) {
      // show error message for failed investment
      setShowErrorMessage(true);
      setErrorMessage(actionFailedError);
    }
  };

  const handleSetAmount = (event: any) => {
    event.preventDefault();
    const { value } = event.target;

    setAmount(value);

    const message = Validate(value);
    if (message) {
      setAmountError(
        `Withdrawal amount ${message}`
      );
    } else {
      setAmountError("");
    }
  };

  /**
   * set total available distributions for the token that is currently selected
   * from the withdrawal page select drop-down.
   * @param tokenSymbol the symbol of the currently selected distribution token
   * @param tokenDistributions the total available distributions of the token
   */
   const setTotalTokenDistributions = async (
    tokenSymbol: string,
    tokenDistributions: string,
    tokenAddress: string
  ) => {
    // set total distributions available and token symbol for the selected token.
    // this updates the distributions available value on the syndicate details page.
    setTotalAvailableDistributions(tokenDistributions);
    setCurrentDistributionTokenSymbol(tokenSymbol);
    setCurrentDistributionTokenAddress(tokenAddress);

    // set token decimals
    if (tokenAddress) {
      const distributionTokenDetails = new ERC20TokenDetails(tokenAddress);
      const distributionTokenDecimals = await distributionTokenDetails.getTokenDecimals();
      setCurrentDistributionTokenDecimals(distributionTokenDecimals);
    }
  };

  // update states when error is encountered during withdrawals
  const handleWithdrawalError = (code: number) => {
    switch (code) {
      case 4001 || -32602 || -32603 || "INVALID_ARGUMENT":
        var errorMessage = getMetamaskError(code, "Withdrawal");
        setMetamaskWithdrawError(errorMessage);
        setSubmittingWithdrawal(false);
        setSuccessfulWithdrawal(false);
        return;
      default:
        setMetamaskWithdrawError(withdrawalAllowanceInsufficientText);
        setSubmittingWithdrawal(false);
        setSuccessfulWithdrawal(false);
        setWithdrawalFailed(true);
        return;
    }
  };

  const getTokenDecimals = async (tokenAddress) => {
    // set token decimals based on the token address
    const ERC20Details = new ERC20TokenDetails(tokenAddress);
    const tokenDecimals = await ERC20Details.getTokenDecimals();
    if (tokenDecimals !== null) {
      setCurrentERC20Decimals(parseInt(tokenDecimals));
    }
  };

  // INNER COMPONENTS
  const actionButton = (
    <div className="mb-4">
      <SyndicateActionButton
        amountError={Boolean(amountError)}
        buttonText="Continue"
        disableWithdrawButton={disableWithrawButton}
      />
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="w-full mt-4 sm:mt-0 sticky top-44 mb-10">
        <div
          className={`h-fit-content px-8 pb-4 pt-5 bg-gray-9 ${
            !account ? "rounded-2xl" : `border-b-0 rounded-t-2xl`
          }`}
        >
          {/* Show is read only text if no provider */}
          {renderUnavailableState ?
            (<UnavailableState title={title} message={message} />) :
          withdrawalsAvailable ? (
            <>
              {submittingWithdrawal ? (
                <SyndicateActionLoader
                  contractAddress={syndicateAddress}
                  headerText={loaderHeaderText}
                />
              ) : metamaskWithdrawError ? (
                <SyndicateActionLoader
                  contractAddress={syndicateAddress}
                  headerText={withdrawalsUnavailableTitleText}
                  subText={
                    withdrawalFailed
                      ? withdrawalAllowanceInsufficientText
                      : metamaskErrorMessageText
                  }
                  error={true}
                  showRetryButton={true}
                  buttonText={dismissButtonText}
                  closeLoader={closeSyndicateActionLoader}
                />
              ) : metamaskConfirmPending ? (
                <SyndicateActionLoader
                  headerText={walletPendingConfirmPendingTitleText}
                  subText={walletPendingConfirmPendingMessage}
                  pending={true}
                />
              ) : successfulWithdrawal && withdraw ? (
                <SyndicateActionLoader
                  contractAddress={syndicateAddress}
                  headerText={withdrawalSuccessTitleText}
                  subText={withdrawalSuccessSubtext}
                  showRetryButton={true}
                  success={true}
                  buttonText={withdrawalSuccessButtonText}
                  closeLoader={closeSyndicateActionLoader}
                />
              ) : withdraw && +myDeposits === 0 && !showSkeletonLoader ? (
                <SyndicateActionLoader
                  headerText={nonMemberWithdrawalTitleText}
                  subText={nonMemberWithdrawalText}
                  error={true}
                  showRetryButton={false}
                  showlinkToDeposit={showDepositLink}
                />
              ) : (
                <>
                  {showSkeletonLoader ? (
                    <div className="flex justify-between my-1 px-2">
                      <SkeletonLoader
                        width="full"
                        height="8"
                        borderRadius="rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <img className="mr-2 relative -top-1" src={"/images/deposit.svg"} />

                      <p className="font-semibold text-xl p-2">
                        {withdrawalPageTitleText}
                      </p>
                    </div>
                  )}

                  <div className="">
                    {showSkeletonLoader ? (
                      <div className="flex justify-between my-1">
                        <SkeletonLoader
                          width="full"
                          height="12"
                          borderRadius="rounded-md"
                        />
                      </div>
                    ) : (
                      <p className="inline-block my-3 px-4 py-2 text-white font-ibm bg-green-500 bg-opacity-20 rounded-3xl">
                        {totalDistributionsText}
                      </p>
                    )}

                    {showSkeletonLoader ? (
                      <div className="flex justify-between my-1">
                        <SkeletonLoader
                          width="full"
                          height="14"
                          borderRadius="rounded-md"
                        />
                      </div>
                    ) : (
                      <form onSubmit={onSubmit}>
                        <div className="flex justify-between my-1">
                          <input
                            name="amount"
                            type="text"
                            placeholder="400"
                            defaultValue={amount}
                            onChange={handleSetAmount}
                            className={`min-w-0 rounded-md bg-gray-9 border border-gray-24 text-white font-whyte focus:outline-none focus:ring-gray-24 focus:border-gray-24 flex-grow mr-6 `}
                          />
                          {syndicate && syndicate.distributionsEnabled ? (
                            <TokenSelect
                              setTotalTokenDistributions={
                                setTotalTokenDistributions
                              }
                            />
                          ) : (
                            <p className="flex-shrink-0 flex items-center whitespace-nowrap">
                              {currentERC20 === "DAI" &&
                                <img className="mr-2" src={"/images/dai-symbol.svg"} />}
                              {currentERC20}
                            </p>
                          )}
                        </div>
                        <p className="mr-2 w-full text-red-500 text-xs mt-2 mb-4">
                          {showValidationError ? errorMessageText : null}
                        </p>
                        <div className="mb-2">{actionButton}</div>
                        <div className="flex justify-center">
                          <div className="w-2/3 text-sm my-5 text-gray-500 justify-self-center text-center">
                            {withdrawalDisclaimerText}
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <UnavailableState
              title={depositsAndWithdrawalsUnavailableTitleText}
              message={depositsAndWithdrawalsUnavailableText}
            />
          )}
        </div>

        {/* This component should be shown when we have details about user deposits */}
        {account && (
          <DetailsCard
            {...{ title: "My Stats", sections, syndicate, loadingLPDetails }}
            customStyles={
              "p-8 rounded-b-3xl bg-gray-6 border-t border-gray-700 "
            }
            customInnerWidth={"w-full"}
          />
        )}
      </div>

      {withdraw && syndicate?.depositsEnabled ? (
          <>
            <p className="sm:ml-2 p-4 mx-2 sm:px-8 sm:py-4 text-xs text-gray-dim leading-4">
              MORE
            </p>
            <div className="flex justify-start items-center py-4 px-6 sm:ml-6 mx-2 rounded-custom bg-gray-9">
              <p className="font-medium text-lg">
                <Link href={`/syndicates/${syndicateAddress}/deposit`}>
                  <a className="flex items-center">
                    <img
                      className="inline mr-4 h-5"
                      src="/images/deposit.svg"
                      alt="deposit icon"
                    />
                    Deposit into syndicate.
                  </a>
                </Link>
              </p>
            </div>
          </>
        ) : null}

      {/* Error message modal */}
      <ErrorModal
        {...{
          show: showErrorMessage,
          handleClose: () => {
            setShowErrorMessage(false);
            setErrorMessage("");
          },
          errorMessage,
        }}
      />
    </ErrorBoundary>
  );
}

export default WithdrawSyndicate;
