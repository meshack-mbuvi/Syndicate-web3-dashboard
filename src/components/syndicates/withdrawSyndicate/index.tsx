import { amplitudeLogger, Flow } from "@/components/amplitude";
import {
  CLICK_WITHDRAW_MORE,
  ERROR_WITHDRAWING,
  SUCCESSFUL_WITHDRAWAL,
} from "@/components/amplitude/eventNames";
import ErrorBoundary from "@/components/errorBoundary";
import JoinWaitlist from "@/components/JoinWaitlist";
import { ErrorModal } from "@/components/shared";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { getMetamaskError } from "@/helpers";
import { showWalletModal } from "@/state/wallet/actions";
import { updateMemberDepositDetails } from "@/redux/actions/syndicateMemberDetails/memberDepositsInfo";
import { updateMemberWithdrawalDetails } from "@/redux/actions/syndicateMemberDetails/memberWithdrawalsInfo";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { getWeiAmount } from "@/utils/conversions";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { Validate } from "@/utils/validators";
import { getCoinFromContractAddress } from "functions/src/utils/ethereum";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUnavailableState } from "../hooks/useUnavailableState";
import { DetailsCard } from "../shared";
import {
  constants,
  myDepositsToolTip,
  myDistributionsToDateToolTip,
  myPercentageOfThisSyndicateToolTip,
  myWithDrawalsToDateTooltip,
  walletConfirmConstants,
  withdrawalsToDepositPercentageToolTip,
} from "../shared/Constants";
import { SyndicateActionButton } from "../shared/syndicateActionButton";
import { SyndicateActionLoader } from "../shared/syndicateActionLoader";
import { TokenSelect } from "../shared/tokenSelect";
import { UnavailableState } from "../shared/unavailableState";

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

const WithdrawSyndicate: React.FC = () => {
  const {
    tokenDetailsReducer: {
      depositTokenAllowanceDetails,
    },
    initializeContractsReducer: { syndicateContracts },
    syndicateMemberDetailsReducer: {
      memberDepositDetails,
      memberWithdrawalDetails,
      syndicateDistributionTokens,
    },
    syndicatesReducer: { syndicate },
    web3Reducer: {
      web3: { account },
    },
  } = useSelector((state: RootState) => state);

  const router = useRouter();
  const dispatch = useDispatch();

  const { title, message, renderUnavailableState, renderJoinWaitList } =
    useUnavailableState();

  // STATES
  const [withdrawalsAvailable, setWithdrawalsAvailable] =
    useState<boolean>(true);
  const [submittingWithdrawal, setSubmittingWithdrawal] =
    useState<boolean>(false);
  const [metamaskConfirmPending, setMetamaskConfirmPending] =
    useState<boolean>(false);
  const [successfulWithdrawal, setSuccessfulWithdrawal] =
    useState<boolean>(false);
  const [metamaskWithdrawError, setMetamaskWithdrawError] =
    useState<string>("");
  const [withdrawalFailed, setWithdrawalFailed] = useState<boolean>(false);
  const [loadingLPDetails, setLoadingLPDetails] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [amountError, setAmountError] = useState<string>("");
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [
    amountGreaterThanMemberDistributions,
    setAmountGreaterThanMemberDistributions,
  ] = useState<boolean>(false);
  const [
    withdrawalAmountGreaterThanDeposits,
    setWithdrawalAmountGreaterThanDeposits,
  ] = useState<boolean>(false);
  const [
    withdrawalAmountLessThanMinDeposits,
    setWithdrawalAmountLessThanMinDeposits,
  ] = useState<boolean>(false);
  const [
    isSyndicateAllowanceLTWithdrawAmount,
    setAllowanceLessThanWithdrawAmount,
  ] = useState<boolean>(false);

  const [loggerFlow, setLoggerFlow] = useState(Flow.MBR_WITHDRAW_DEP);

  // check whether the connected account is a member
  const [accountIsMember, setAccountIsMember] = useState<boolean>(true);

  // DEFINITIONS
  const { syndicateAddress } = router.query;
  const { memberTotalDeposits, memberPercentageOfSyndicate } =
    memberDepositDetails;

  let tokenDistributions = "";
  let tokenSymbol = "";
  let tokenAddress = "";
  let tokenDecimals = "";

  let selectedToken;
  const [currentDistributionTokenPrice, setCurrentDistributionTokenPrice] =
    useState<string>("1");

  // get current token price
  const getTokenPrice = async (tokenAddress) => {
    const { price } = await getCoinFromContractAddress(tokenAddress);
    setCurrentDistributionTokenPrice(price);
  };

  if (syndicateDistributionTokens) {
    selectedToken = syndicateDistributionTokens.find((token) => token.selected);

    if (selectedToken) {
      tokenDistributions = selectedToken?.tokenDistributions;
      tokenSymbol = selectedToken?.tokenSymbol;
      tokenAddress = selectedToken?.tokenAddress;
      tokenDecimals = selectedToken?.tokenDecimals;

      // we need to get the correct token price
      // since some ERC20s have a value of slightly less or more than 1 USD
      getTokenPrice(tokenAddress);
    }
  }

  const currentTokenAvailableDistributions = tokenDistributions;
  const currentDistributionTokenSymbol = tokenSymbol;
  const currentDistributionTokenDecimals = tokenDecimals;
  const currentDistributionTokenAddress = tokenAddress;

  let memberWithdrawalsToDistributionsPercentage = "0.0";
  let memberDistributionsWithdrawalsToDate = "0.0";
  let memberDistributionsToDate = "0.0";
  let memberAvailableDistributions = "0.0";
  let memberWithdrawalDetailsData;
  if (
    account &&
    !_.isEmpty(memberWithdrawalDetails) &&
    memberWithdrawalDetails[account] &&
    !_.isEmpty(selectedToken) &&
    selectedToken.tokenSymbol
  ) {
    try {
      if (memberWithdrawalDetails[account][selectedToken.tokenSymbol]) {
        memberWithdrawalDetailsData =
          memberWithdrawalDetails[account][selectedToken.tokenSymbol];

        memberWithdrawalsToDistributionsPercentage =
          memberWithdrawalDetailsData.memberWithdrawalsToDistributionsPercentage;
        memberDistributionsWithdrawalsToDate =
          memberWithdrawalDetailsData.memberDistributionsWithdrawalsToDate;
        memberDistributionsToDate =
          memberWithdrawalDetailsData.memberDistributionsToDate;
        memberAvailableDistributions =
          memberWithdrawalDetailsData.memberAvailableDistributions;
      }
    } catch (error) {
      console.log({ error });
    }
  }

  const depositTokenDecimals = syndicate?.syndicateTokenDecimals;
  const depositERC20Symbol = syndicate?.depositERC20TokenSymbol;

  let showDepositLink = false;

  const WithdrawalSections = [
    {
      header: "My Distributions to Date",
      content: `${memberDistributionsToDate} ${currentDistributionTokenSymbol}`,
      tooltip: myDistributionsToDateToolTip,
      screen: "withdrawal",
    },
    {
      header: "My Withdraws to Date",
      content: `${memberDistributionsWithdrawalsToDate} ${currentDistributionTokenSymbol}`,
      tooltip: myWithDrawalsToDateTooltip,
      screen: "withdrawal",
    },
    {
      header: "Total Withdraws / Distributions To Date",
      content: `${memberWithdrawalsToDistributionsPercentage}%`,
      tooltip: withdrawalsToDepositPercentageToolTip,
      screen: "withdrawal",
    },
  ];

  const depositSections = [
    {
      header: "My Deposits",
      content: `${floatedNumberWithCommas(
        memberTotalDeposits,
      )} ${depositERC20Symbol} ($${floatedNumberWithCommas(
        parseFloat(syndicate?.depositERC20Price) *
          parseFloat(memberTotalDeposits),
      )})`,
      tooltip: myDepositsToolTip,
      screen: "deposit",
    },
    {
      header: "My % of This Syndicate",
      content: `${memberPercentageOfSyndicate}%`,
      tooltip: myPercentageOfThisSyndicateToolTip,
      screen: "deposit",
    },
  ];

  // HOOKS
  // set withdrawal amount to 0 when we switch between tokens
  useEffect(() => {
    setAmount(0);
  }, [selectedToken]);

  // check whether the connected account is a member of the syndicate
  useEffect(() => {
    setAccountIsMember(parseInt(memberTotalDeposits) > 0);
  }, [account, memberDepositDetails, syndicate]);

  // check whether the current syndicate is accepting withdrawals
  useEffect(() => {
    if (syndicate) {
      const { depositsEnabled, distributing } = syndicate;

      // if a syndicate is closed and distributions have not been enabled
      // the member cannot withdraw from it.
      if (!depositsEnabled && !distributing) {
        setWithdrawalsAvailable(false);
      } else {
        setWithdrawalsAvailable(true);
      }

      // Amplitude logger: setLoggerFlow
      setLoggerFlow(Flow.MBR_WITHDRAW_DIST);
    }
  }, [syndicate]);

  // get values for the current LP(connected wallet account)
  // when this component initially renders.
  useEffect(() => {
    if (account && syndicateContracts && syndicate) {
      setLoadingLPDetails(true);
      storeMemberWithdrawalDetails();

      dispatch(
        updateMemberDepositDetails({
          syndicateAddress,
          depositTokenDecimals,
        }),
      );

      setLoadingLPDetails(false);
    }
  }, [
    syndicate,
    syndicateContracts,
    currentTokenAvailableDistributions,
    account,
    depositTokenDecimals,
    selectedToken,
  ]);

  // check for errors on the member withdrawal page.
  useEffect(() => {
    if (syndicate && memberDepositDetails) {
      // show error when amount is greater than member's available distributions.
      // or when the amount is greater than member deposits(members is withdrawing their deposits)
      // or when the member's deposits minus the amount exceeds the minimum member deposit
      const amountGreaterThanMemberDistributions =
        parseFloat(amount.toString()) >
        parseFloat(memberAvailableDistributions);
      const amountGreaterThanMemberDeposits = +amount > +memberTotalDeposits;
      const { depositMemberMin } = syndicate;
      const amountLessThanMinDeposits =
        +memberTotalDeposits - +amount < depositMemberMin;

      const amountLessThanMemberDeposit = +amount < +memberTotalDeposits;

      const tokenAllowance =
        depositTokenAllowanceDetails.length &&
        depositTokenAllowanceDetails[0].tokenAllowance;

      if (amountGreaterThanMemberDistributions && syndicate?.distributing) {
        setAmountGreaterThanMemberDistributions(true);
        setWithdrawalAmountGreaterThanDeposits(false);
        setWithdrawalAmountLessThanMinDeposits(false);
        setAllowanceLessThanWithdrawAmount(false);
      } else if (amountGreaterThanMemberDeposits && !syndicate?.distributing) {
        setWithdrawalAmountGreaterThanDeposits(true);
        setAmountGreaterThanMemberDistributions(false);
        setWithdrawalAmountLessThanMinDeposits(false);
        setAllowanceLessThanWithdrawAmount(false);
      } else if (
        amountLessThanMinDeposits &&
        !syndicate?.distributing &&
        amountLessThanMemberDeposit
      ) {
        setWithdrawalAmountLessThanMinDeposits(true);
        setWithdrawalAmountGreaterThanDeposits(false);
        setAmountGreaterThanMemberDistributions(false);
        setAllowanceLessThanWithdrawAmount(false);
      } else if (+tokenAllowance < +amount && !syndicate?.distributing) {
        setAllowanceLessThanWithdrawAmount(true);
        setAmountGreaterThanMemberDistributions(false);
        setWithdrawalAmountGreaterThanDeposits(false);
        setWithdrawalAmountLessThanMinDeposits(false);
      } else {
        setAmountGreaterThanMemberDistributions(false);
        setWithdrawalAmountGreaterThanDeposits(false);
        setWithdrawalAmountLessThanMinDeposits(false);
        setAllowanceLessThanWithdrawAmount(false);
      }
    }
  }, [amount, memberDepositDetails]);

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
  const withdrawalPageTitleText = withdrawalTitleText;

  // conditions under which the skeleton loader should be rendered
  const showSkeletonLoader = !syndicate || loadingLPDetails;

  // set title and texts of section based on
  // whether this is a withdrawal or a deposit.
  let tokenPriceInUSD =
    parseFloat(currentDistributionTokenPrice) *
    parseFloat(memberAvailableDistributions);
  let totalDistributionsText = `${
    memberAvailableDistributions &&
    floatedNumberWithCommas(memberAvailableDistributions)
  } ${currentDistributionTokenSymbol ? currentDistributionTokenSymbol : ""} ($${
    memberAvailableDistributions && floatedNumberWithCommas(tokenPriceInUSD)
  }) distributions available.`;
  if (syndicate?.depositsEnabled) {
    tokenPriceInUSD =
      parseFloat(syndicate?.depositERC20Price) *
      parseFloat(memberTotalDeposits);
    totalDistributionsText = `${floatedNumberWithCommas(memberTotalDeposits)} ${
      currentDistributionTokenSymbol ? currentDistributionTokenSymbol : ""
    } ($${floatedNumberWithCommas(tokenPriceInUSD)}) deposits available.`;
  }

  // conditions for showing validation error message
  // error messages will be shown based on whether the current page
  // is the deposit page or the withdrawal page.
  let showValidationError = false;
  if (
    amountError ||
    amountGreaterThanMemberDistributions ||
    withdrawalAmountGreaterThanDeposits ||
    withdrawalAmountLessThanMinDeposits ||
    isSyndicateAllowanceLTWithdrawAmount
  ) {
    showValidationError = true;
  } else {
    showValidationError = false;
  }

  // show error message depending on what triggered it on the deposit/withdrawal page
  let errorMessageText = amountError;
  if (amountGreaterThanMemberDistributions && syndicate?.distributing) {
    errorMessageText = amountGreaterThanMemberDistributionsText;
  } else if (withdrawalAmountGreaterThanDeposits) {
    errorMessageText = withdrawalAmountGreaterThanMemberDeposits;
  } else if (withdrawalAmountLessThanMinDeposits) {
    errorMessageText = withdrawalAmountLessThanMinDepositErrorText;
  } else if (isSyndicateAllowanceLTWithdrawAmount) {
    errorMessageText = withdrawalAllowanceInsufficientText;
  } else {
    errorMessageText = amountError;
  }

  // disable the withdraw button if
  // the amount is greater than the member's available distributions
  let disableWithrawButton = false;
  if (
    amountGreaterThanMemberDistributions ||
    withdrawalAmountGreaterThanDeposits ||
    withdrawalAmountLessThanMinDeposits ||
    +amount === 0 ||
    isSyndicateAllowanceLTWithdrawAmount
  ) {
    disableWithrawButton = true;
  }

  // set member details section based on state
  let sections = depositSections;
  if (syndicate?.distributing) {
    sections = WithdrawalSections;
  } else if (!syndicate?.distributing) {
    sections = depositSections;
  }

  if (syndicate) {
    const { allowlistEnabled } = syndicate;
    const { myAddressAllowed } = memberDepositDetails;

    // On the withdrawal section, show link to deposit page if
    // allowListEnabled is set and member
    // deposit is zero
    if (syndicate.depositsEnabled) {
      if (allowlistEnabled && +memberTotalDeposits === 0) {
        showDepositLink = myAddressAllowed;
      } else {
        showDepositLink = +memberTotalDeposits === 0;
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
      parseInt(currentDistributionTokenDecimals),
      true,
    );

    try {
      setMetamaskConfirmPending(true);
      /** This method is used by an LP to withdraw distribution from a Syndicate
       * @param syndicateAddress The Syndicate that an LP wants to withdraw from
       * @param withdrawalToken The ERC 20 address to be transferred from the
       * manager to the member.
       * @param amountToWithdraw The amount to withdraw
       */
      if (!syndicate.distributing) {
        return;
      }

      // withdraw distributions
      await syndicateContracts?.DistributionLogicContract.memberClaimDistributions(
        syndicateAddress,
        account,
        [currentDistributionTokenAddress],
        [amountToWithdraw],
        setMetamaskConfirmPending,
        setSubmittingWithdrawal,
      );

      // transaction was successful
      // get syndicate updated values
      dispatch(
        getSyndicateByAddress({ syndicateAddress, ...syndicateContracts }),
      );

      //store updated member details
      storeMemberWithdrawalDetails();

      setSubmittingWithdrawal(false);
      setSuccessfulWithdrawal(true);

      // Amplitude logger: Successful Withdrawal
      amplitudeLogger(SUCCESSFUL_WITHDRAWAL, {
        flow: loggerFlow,
        data: {
          withdrawAmount,
        },
      });
    } catch (error) {
      console.log({ error });
      const { code } = error;
      handleWithdrawalError(code);

      // Amplitude logger: Error withdrawing
      amplitudeLogger(ERROR_WITHDRAWING, {
        flow: loggerFlow,
        error,
      });
    }
  };

  // close the syndicate action loader
  const closeSyndicateActionLoader = () => {
    setMetamaskWithdrawError("");
    setSuccessfulWithdrawal(false);
    setMetamaskConfirmPending(false);
    setAmount(0);

    // Amplitude logger: Click Withdraw more widge
    amplitudeLogger(CLICK_WITHDRAW_MORE, {
      flow: loggerFlow,
      description:
        "How many users click on Withdraw more after a successful withdrawal",
    });
  };

  /** Method to store updated member details in the redux store
   * This will be called whenever member details need to be updated
   * after an action.
   */
  const storeMemberWithdrawalDetails = () => {
    dispatch(
      updateMemberWithdrawalDetails({
        syndicateAddress,
        distributionTokens: [
          {
            tokenAddress,
            tokenDecimals,
            tokenDistributions,
            tokenSymbol,
          },
        ],
        memberAddresses: [account],
      }),
    );
  };

  // handle withdrawal form submit.
  const onSubmit = async (event: any) => {
    event.preventDefault();

    if (!syndicateContracts.DistributionLogicContract) {
      // user needs to connect wallet first
      return dispatch(showWalletModal());
    }

    try {
      await withdrawFromSyndicate(amount);
    } catch (error) {
      // show error message for failed investment
      setShowErrorMessage(true);
      setErrorMessage(actionFailedError);

      // Amplitude logger: Error withdrawing
      amplitudeLogger(ERROR_WITHDRAWING, {
        flow: loggerFlow,
        error,
      });
    }
  };

  const handleSetAmount = (event: any) => {
    event.preventDefault();
    const { value } = event.target;

    setAmount(value);

    const message = Validate(value);
    if (message) {
      setAmountError(`Withdrawal amount ${message}`);
    } else {
      setAmountError("");
    }
  };

  // update states when error is encountered during withdrawals
  const handleWithdrawalError = (code: number) => {
    const errorMessage = getMetamaskError(code, "Withdrawal");

    switch (code) {
      case 4001 || -32602 || -32603 || "INVALID_ARGUMENT":
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

  // set max distributions to withdraw
  const handleSetMaxAmount = (event: any) => {
    event.preventDefault();
    setAmount(+memberAvailableDistributions);

    // Reset Error message
    if (amountError) {
      setAmountError("");
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
            !account || !accountIsMember
              ? "rounded-2xl"
              : `border-b-0 rounded-t-2xl`
          }`}
        >
          {/* Show is read only text if no provider */}
          {renderJoinWaitList ? (
            <JoinWaitlist />
          ) : renderUnavailableState ? (
            <UnavailableState title={title} message={message} />
          ) : withdrawalsAvailable ? (
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
              ) : successfulWithdrawal ? (
                <SyndicateActionLoader
                  contractAddress={syndicateAddress}
                  headerText={withdrawalSuccessTitleText}
                  subText={withdrawalSuccessSubtext}
                  showRetryButton={true}
                  success={true}
                  buttonText={
                    +memberDistributionsToDate ===
                    +memberDistributionsWithdrawalsToDate
                      ? dismissButtonText
                      : withdrawalSuccessButtonText
                  }
                  closeLoader={closeSyndicateActionLoader}
                />
              ) : +memberTotalDeposits === 0 && !showSkeletonLoader ? (
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
                    <div className="flex justify-between my-1">
                      <SkeletonLoader
                        width="full"
                        height="8"
                        borderRadius="rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <img
                        className="mr-2 relative -top-1"
                        src={"/images/deposit.svg"}
                        alt=""
                      />

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
                          {syndicate && syndicate?.distributing ? (
                            <div className="flex w-full">
                              <TokenSelect />
                              <div className="flex relative w-2/3">
                                <input
                                  name="amount"
                                  type="text"
                                  placeholder={memberAvailableDistributions}
                                  defaultValue={amount}
                                  value={amount}
                                  onChange={handleSetAmount}
                                  className="rounded-r-md bg-gray-9 border border-gray-24 border-l-0 text-white font-whyte focus:outline-none focus:ring-gray-24 focus:border-gray-24 flex-grow"
                                />
                                <button
                                  className="flex flex-1 absolute text-base py-3 pr-3 right-0 text-blue-navy"
                                  type="button"
                                  onClick={handleSetMaxAmount}
                                >
                                  Max
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <input
                                name="amount"
                                type="text"
                                placeholder={syndicate?.depositMemberMin}
                                defaultValue={amount}
                                onChange={handleSetAmount}
                                className={`min-w-0 rounded-md bg-gray-9 border border-gray-24 text-white font-whyte focus:outline-none focus:ring-gray-24 focus:border-gray-24 flex-grow mr-6 `}
                              />
                              <p className="flex-shrink-0 flex items-center whitespace-nowrap">
                                {syndicate?.depositERC20Logo && (
                                  <img
                                    className="mr-2 w-5"
                                    src={syndicate?.depositERC20Logo}
                                    alt=""
                                  />
                                )}
                                {depositERC20Symbol}
                              </p>
                            </>
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
        {account && accountIsMember && (
          <DetailsCard
            {...{ title: "My Stats", sections, syndicate, loadingLPDetails }}
            customStyles={
              "p-8 rounded-b-3xl bg-gray-6 border-t border-gray-700 "
            }
            customInnerWidth={"w-full"}
          />
        )}
        {syndicate?.depositsEnabled &&
        account &&
        syndicate.managerCurrent !== account ? (
          <>
            <p className="py-4 px-2 text-xs text-gray-dim leading-4">MORE</p>
            <Link href={`/syndicates/${syndicateAddress}/deposit`}>
              <div className="flex justify-start cursor-pointer items-center py-4 px-6 rounded-custom transition hover:bg-gray-6 bg-gray-9">
                <p className="font-medium text-lg">
                  <a
                    className="flex items-center"
                    href={`/syndicates/${syndicateAddress}/deposit`}
                  >
                    <img
                      className="inline mr-4 h-5"
                      src="/images/deposit.svg"
                      alt="deposit icon"
                    />
                    Deposit into syndicate.
                  </a>
                </p>
              </div>
            </Link>
          </>
        ) : null}
      </div>

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
};

export default WithdrawSyndicate;
