import ErrorBoundary from "@/components/errorBoundary";
import JoinWaitlist from "@/components/JoinWaitlist";
import { ErrorModal } from "@/components/shared";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { getMetamaskError } from "@/helpers";
import { showWalletModal } from "@/redux/actions";
import { updateMemberDepositDetails } from "@/redux/actions/syndicateMemberDetails/memberDepositsInfo";
import { updateMemberWithdrawalDetails } from "@/redux/actions/syndicateMemberDetails/memberWithdrawalsInfo";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { getWeiAmount } from "@/utils/conversions";
import { ERC20TokenDetails } from "@/utils/ERC20Methods";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { TokenMappings } from "@/utils/tokenMappings";
import { Validate } from "@/utils/validators";
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

  const {
    title,
    message,
    renderUnavailableState,
    renderJoinWaitList,
  } = useUnavailableState();

  // STATES
  const [withdrawalsAvailable, setWithdrawalsAvailable] = useState<boolean>(
    true,
  );
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState<boolean>(
    false,
  );
  const [metamaskConfirmPending, setMetamaskConfirmPending] = useState<boolean>(
    false,
  );
  const [successfulWithdrawal, setSuccessfulWithdrawal] = useState<boolean>(
    false,
  );
  const [metamaskWithdrawError, setMetamaskWithdrawError] = useState<string>(
    "",
  );
  const [withdrawalFailed, setWithdrawalFailed] = useState<boolean>(false);
  const [loadingLPDetails, setLoadingLPDetails] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [depositERC20Symbol, setDepositERC20Symbol] = useState<string>("DAI");
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
  const [depositTokenDecimals, setDepositTokenDecimals] = useState<number>(18);

  // DEFINITIONS
  const { syndicateAddress } = router.query;
  const {
    memberTotalDeposits,
    memberPercentageOfSyndicate,
  } = memberDepositDetails;

  const {
    memberWithdrawalsToDepositPercentage,
    memberDistributionsToDate,
    memberDistributionsWithdrawalsToDate,
  } = memberWithdrawalDetails;

  if (syndicateDistributionTokens) {
    const selectedToken = syndicateDistributionTokens.find(
      (token) => token.selected,
    );

    if (selectedToken) {
      var {
        tokenDistributions,
        tokenSymbol,
        tokenAddress,
        tokenDecimals,
      } = selectedToken;
    }
  }

  const currentTokenAvailableDistributions = tokenDistributions;
  const currentDistributionTokenSymbol = tokenSymbol;
  const currentDistributionTokenDecimals = tokenDecimals;
  const currentDistributionTokenAddress = tokenAddress;

  let showDepositLink = false;

  const WithdrawalSections = [
    {
      header: "My Distributions to Date",
      subText: `${memberDistributionsToDate} ${currentDistributionTokenSymbol}`,
      tooltip: myDistributionsToDateToolTip,
      screen: "withdrawal",
    },
    {
      header: "My Withdraws to Date",
      subText: `${memberDistributionsWithdrawalsToDate} ${currentDistributionTokenSymbol}`,
      tooltip: myWithDrawalsToDateTooltip,
      screen: "withdrawal",
    },
    {
      header: "Total Withdraws / Deposits",
      subText: `${memberWithdrawalsToDepositPercentage}%`,
      tooltip: withdrawalsToDepositPercentageToolTip,
      screen: "withdrawal",
    },
  ];

  const depositSections = [
    {
      header: "My Deposits",
      subText: `${memberTotalDeposits} ${depositERC20Symbol} ($${memberTotalDeposits})`,
      tooltip: myDepositsToolTip,
      screen: "deposit",
    },
    {
      header: "My % of This Syndicate",
      subText: `${memberPercentageOfSyndicate}%`,
      tooltip: myPercentageOfThisSyndicateToolTip,
      screen: "deposit",
    },
  ];

  // HOOKS

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
  ]);

  // set token symbol based on deposit token address
  // we'll manually map the token symbol for now.
  // we'll also set the token decimals of the deposit/Withdrawal ERC20 token here
  useEffect(() => {
    if (syndicate) {
      // set token symbol based on token address
      const tokenAddress = syndicate.depositERC20Address;
      // set token decimal places.
      getTokenDecimals(tokenAddress);
      const mappedTokenAddress = Object.keys(TokenMappings).find(
        (key) => key.toLowerCase() == tokenAddress.toLowerCase(),
      );
      if (mappedTokenAddress) {
        setDepositERC20Symbol(TokenMappings[mappedTokenAddress]);
      }
    }
  }, [syndicate]);

  // check for errors on the member withdrawal page.
  useEffect(() => {
    if (syndicate && memberDepositDetails) {
      // show error when amount is greater than member's available distributions.
      // or when the amount is greater than member deposits(members is withdrawing their deposits)
      // or when the member's deposits minus the amount exceeds the minimum member deposit.
      const amountGreaterThanMemberDistributions =
        +amount > +memberDistributionsToDate;
      const amountGreaterThanMemberDeposits = +amount > +memberTotalDeposits;
      const { depositMinMember } = syndicate;
      const amountLessThanMinDeposits =
        +memberTotalDeposits - +amount < depositMinMember;

      const amountLessThanMemberDeposit = +amount < +memberTotalDeposits;

      if (amountGreaterThanMemberDistributions && syndicate?.distributing) {
        setAmountGreaterThanMemberDistributions(true);
        setWithdrawalAmountGreaterThanDeposits(false);
        setWithdrawalAmountLessThanMinDeposits(false);
      } else if (amountGreaterThanMemberDeposits && !syndicate?.distributing) {
        setWithdrawalAmountGreaterThanDeposits(true);
        setAmountGreaterThanMemberDistributions(false);
        setWithdrawalAmountLessThanMinDeposits(false);
      } else if (
        amountLessThanMinDeposits &&
        !syndicate?.distributing &&
        amountLessThanMemberDeposit
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
  let withdrawalPageTitleText = withdrawalTitleText;
  if (syndicate && syndicate.depositsEnabled) {
    withdrawalPageTitleText = withdrawalDepositTitleText;
  }

  // conditions under which the skeleton loader should be rendered
  const showSkeletonLoader =
    !syndicate ||
    loadingLPDetails ||
    (syndicate &&
      syndicate.distributing &&
      !distributionTokensAllowanceDetails.length);

  // set title and texts of section based on
  // whether this is a withdrawal or a deposit.
  let totalDistributionsText = `${floatedNumberWithCommas(
    currentTokenAvailableDistributions,
  )} ${
    currentDistributionTokenSymbol ? currentDistributionTokenSymbol : ""
  } ($${floatedNumberWithCommas(
    currentTokenAvailableDistributions,
  )}) distributions available.`;
  if (syndicate?.depositsEnabled) {
    totalDistributionsText = `${memberTotalDeposits} ${
      currentDistributionTokenSymbol ? currentDistributionTokenSymbol : ""
    } ($${memberTotalDeposits}) deposits available.`;
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
  if (amountGreaterThanMemberDistributions && syndicate?.distributing) {
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
    withdrawalAmountLessThanMinDeposits ||
    +amount === 0
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
      currentDistributionTokenDecimals,
      true,
    );

    try {
      setMetamaskConfirmPending(true);
      /** This method is used by an LP to withdraw a deposit or distribution from a Syndicate
       * @param syndicateAddress The Syndicate that an LP wants to withdraw from
       * @param withdrawalToken The ERC 20 address to be transferred from the
       * manager to the member.
       * @param amountToWithdraw The amount to withdraw
       */
      if (syndicate.depositsEnabled) {
        const depositAmountToWithdraw = getWeiAmount(
          withdrawAmount.toString(),
          syndicate.tokenDecimals,
          true,
        );

        // withdraw deposits
        await syndicateContracts?.DepositLogicContract.withdrawMemberDeposit(
          syndicateAddress,
          depositAmountToWithdraw,
          account,
          setMetamaskConfirmPending,
          setSubmittingWithdrawal,
        );
      } else {
        // withdraw distributions
        await syndicateContracts?.DistributionLogicContract.memberClaimDistribution(
          syndicateAddress,
          account,
          currentDistributionTokenAddress,
          amountToWithdraw,
          setMetamaskConfirmPending,
          setSubmittingWithdrawal,
        );
      }

      // transaction was succesful
      // get syndicate updated values
      dispatch(
        getSyndicateByAddress({ syndicateAddress, ...syndicateContracts }),
      );

      //store updated member details
      storeMemberWithdrawalDetails();

      setSubmittingWithdrawal(false);
      setSuccessfulWithdrawal(true);
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
  const storeMemberWithdrawalDetails = () => {
    dispatch(
      updateMemberWithdrawalDetails({
        syndicateAddress,
        currentTokenAvailableDistributions,
        currentDistributionTokenDecimals,
        currentDistributionTokenAddress,
      }),
    );
  };

  // handle withdrawal form submit.
  const onSubmit = async (event: any) => {
    event.preventDefault();

    if (!syndicateContracts.DepositLogicContract) {
      // user needs to connect wallet first
      return dispatch(showWalletModal());
    }

    try {
      await withdrawFromSyndicate(amount);
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
      setAmountError(`Withdrawal amount ${message}`);
    } else {
      setAmountError("");
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
      setDepositTokenDecimals(parseInt(tokenDecimals));
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
                  buttonText={withdrawalSuccessButtonText}
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
                    <div className="flex justify-between my-1 px-2">
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
                          <input
                            name="amount"
                            type="text"
                            placeholder="400"
                            defaultValue={amount}
                            onChange={handleSetAmount}
                            className={`min-w-0 rounded-md bg-gray-9 border border-gray-24 text-white font-whyte focus:outline-none focus:ring-gray-24 focus:border-gray-24 flex-grow mr-6 `}
                          />
                          {syndicate && syndicate?.distributing ? (
                            <TokenSelect />
                          ) : (
                            <p className="flex-shrink-0 flex items-center whitespace-nowrap">
                              {depositERC20Symbol === "DAI" && (
                                <img
                                  className="mr-2"
                                  src={"/images/dai-symbol.svg"}
                                />
                              )}
                              {depositERC20Symbol}
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
        {syndicate?.depositsEnabled ? (
          <>
            <p className="py-4 px-2 text-xs text-gray-dim leading-4">MORE</p>
            <Link href={`/syndicates/${syndicateAddress}/deposit`}>
              <div className="flex justify-start cursor-pointer items-center py-4 px-6 rounded-custom transition hover:bg-gray-6 bg-gray-9">
                <p className="font-medium text-lg">
                  <a className="flex items-center">
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
