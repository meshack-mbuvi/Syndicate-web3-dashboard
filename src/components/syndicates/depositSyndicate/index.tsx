import { amplitudeLogger, Flow } from "@/components/amplitude";
import {
  APPROVE_DEPOSIT_ALLOWANCE,
  DEPOSIT_MORE,
  DISMISS_TRANSACTION_REJECTED,
  ERROR_APPROVE_ALLOWANCE,
  ERROR_DEPOSIT,
  SUCCESSFUL_DEPOSIT,
} from "@/components/amplitude/eventNames";
import ErrorBoundary from "@/components/errorBoundary";
import FadeIn from "@/components/fadeIn/FadeIn";
import JoinWaitlist from "@/components/JoinWaitlist";
import { ErrorModal } from "@/components/shared";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { getMetamaskError } from "@/helpers";
import { showWalletModal } from "@/redux/actions";
import { setSyndicateDetails } from "@/redux/actions/syndicateDetails";
import { updateMemberDepositDetails } from "@/redux/actions/syndicateMemberDetails/memberDepositsInfo";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { RootState } from "@/redux/store";
import { getWeiAmount } from "@/utils/conversions";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { Validate } from "@/utils/validators";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ERC20ABI from "src/utils/abi/erc20";
import { useDepositChecks } from "../hooks/useDepositChecks";
import { useUnavailableState } from "../hooks/useUnavailableState";
import { DetailsCard } from "../shared";
import {
  constants,
  metamaskConstants,
  myDepositsToolTip,
  myPercentageOfThisSyndicateToolTip,
  walletConfirmConstants,
} from "../shared/Constants";
import { SyndicateActionButton } from "../shared/syndicateActionButton";
import { SyndicateActionLoader } from "../shared/syndicateActionLoader";
import { UnavailableState } from "../shared/unavailableState";
import ManageSyndicate from "./ManageSyndicate";

const {
  actionFailedError,
  allowListEnabledApprovedText,
  allowListDisabledApprovedText,
  allowListEnabledNotApprovedText,
  amountConversionErrorText,
  amountExceededText,
  amountLessThanMinDepositErrorMessage,
  amountMoreThanMaxDepositErrorMessage,
  depositDisclaimerText,
  depositMemberAccreditedText,
  depositMoreTitleText,
  depositSuccessTitleText,
  depositSuccessSubtext,
  depositSuccessButtonText,
  depositSuccessBackButtonText,
  depositTitleText,
  dismissButtonText,
  increaseDepositAllowanceErrorMessage,
  loaderApprovalHeaderText,
  loaderDepositHeaderText,
  loaderGeneralHeaderText,
  maxMemberDepositsText,
  maxMemberDepositsTitleText,
  maxTotalDepositsExceededErrorMessage,
  maxTotalMemberDepositsExceededErrorMessage,
} = constants;

// texts for metamask confirmation pending
const {
  walletPendingConfirmPendingTitleText,
  walletPendingConfirmPendingMessage,
} = walletConfirmConstants;

const DepositSyndicate: React.FC = () => {
  // HOOK DECLARATIONS
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    initializeContractsReducer: { syndicateContracts },
    syndicateMemberDetailsReducer: { memberDepositDetails },
    syndicatesReducer: { syndicate },
    web3Reducer: {
      web3: { account, web3 },
    },
  } = useSelector((state: RootState) => state);

  const depositTokenSymbol = syndicate?.depositERC20TokenSymbol;
  const depositTokenDecimals = syndicate?.tokenDecimals;
  const depositTokenLogo = syndicate?.depositERC20Logo;
  const depositERC20Price = syndicate?.depositERC20Price;

  const { title, message, renderUnavailableState, renderJoinWaitList } =
    useUnavailableState();
  const { depositsAvailable, maxDepositReached } = useDepositChecks();

  const [loadingLPDetails, setLoadingLPDetails] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [amountError, setAmountError] = useState<string>("");
  const [lpCanDeposit, setLPCanDeposit] = useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [metamaskConfirmPending, setMetamaskConfirmPending] =
    useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [allowanceApprovalError, setAllowanceApprovalError] =
    useState<string>("");
  const [approvedAllowanceAmount, setApprovedAllowanceAmount] =
    useState<string>("0");
  const [successfulDeposit, setSuccessfulDeposit] = useState<boolean>(false);
  const [metamaskDepositError, setMetamaskDepositError] = useState<string>("");
  const [depositTokenContract, setDepositTokenContract] = useState<any>({});
  const [submittingAllowanceApproval, setSubmittingAllowanceApproval] =
    useState<boolean>(false);
  const [metamaskApprovalError, setMetamaskApprovalError] =
    useState<string>("");
  const [conversionError, setConversionError] = useState<string>("");
  const [amountLessThanMinDeposit, setAmountLessThanMinDeposit] =
    useState<boolean>(false);
  const [amountMoreThanMaxDeposit, setAmountMoreThanMaxDeposit] =
    useState<boolean>(false);
  const [maxTotalDepositsExceeded, setMaxTotalDepositsExceeded] =
    useState<boolean>(true);
  const [maxTotalLPDepositsExceeded, setMaxTotalLPDepositsExceeded] =
    useState<boolean>(false);
  const [depositAmountChanged, setDepositAmountChanged] =
    useState<boolean>(false);

  // DEFINITIONS
  let depositApprovalText;
  let disableAmountInput = false;

  const { syndicateAddress } = router.query;

  const {
    memberMaxDepositReached,
    memberTotalDeposits,
    memberPercentageOfSyndicate,
    memberAddressAllowed,
  } = memberDepositDetails;

  // either member has hit member deposit limits or syndicate has reached deposit limits
  const depositLimits = maxDepositReached || memberMaxDepositReached;

  const sections = [
    {
      header: "My Deposits",
      subText: `${floatedNumberWithCommas(
        memberTotalDeposits,
      )} ${depositTokenSymbol} ($${floatedNumberWithCommas(
        parseFloat(depositERC20Price) * parseFloat(memberTotalDeposits),
      )})`,
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

  const amountToDeposit = +amount.toString();
  const allowanceAmountApproved = +approvedAllowanceAmount;

  // check if minDeposit, maxDeposit, or maxTotalDeposits has been violated
  // show an error message and disable deposit and approval buttons if this is the case
  let depositMemberMin;
  let depositMemberMax;
  let depositTotalMax;
  if (syndicate) {
    depositMemberMax = syndicate.depositMemberMax;
    depositMemberMin = syndicate.depositMemberMin;
    depositTotalMax = syndicate.depositTotalMax;
  }

  // HOOKS

  // get values for the current LP(connected wallet account)
  // when this component initially renders.
  useEffect(() => {
    if (account && syndicateContracts && syndicate) {
      setLoadingLPDetails(true);
      // push member details to the redux store
      storeMemberDetails();

      setLoadingLPDetails(false);
    }
  }, [account, syndicate, syndicateContracts, depositTokenDecimals]);

  // if the amount changes, new allowance has to be set
  useEffect(() => {
    const depositAmountGreater = amountToDeposit > allowanceAmountApproved;
    const depositAmountLess = amountToDeposit <= allowanceAmountApproved;

    if (depositAmountGreater) {
      if (approved) {
        setAllowanceApprovalError(increaseDepositAllowanceErrorMessage);
        setDepositAmountChanged(true);
        setLPCanDeposit(false);
      }
    } else if (depositAmountChanged && depositAmountLess) {
      setApproved(true);
      setAllowanceApprovalError("");
      setLPCanDeposit(true);
      setDepositAmountChanged(false);
    }
  }, [amount]);

  useEffect(() => {
    checkMemberAllowanceAmount();
  }, [
    account,
    depositTokenContract,
    syndicateContracts,
    approvedAllowanceAmount,
    approved,
    depositTokenDecimals,
  ]);

  // check whether the current deposit amount exceeds max LP deposit allowed
  // or if the deposit amount is less than the min LP deposit allowed.
  // or if the maximum total deposits has been exceeded
  useEffect(() => {
    if (syndicate) {
      const {
        depositMemberMax,
        depositMemberMin,
        depositTotalMax,
        depositTotal,
      } = syndicate;
      const amountToDeposit = parseFloat(amount.toString());
      const minimumDeposit = parseFloat(depositMemberMin);
      const maximumDeposit = parseFloat(depositMemberMax);
      const totalSyndicateDeposits = parseFloat(depositTotal);
      const maxAllowedTotalDeposits = parseFloat(depositTotalMax);
      const lpTotalDeposits = parseFloat(memberTotalDeposits);

      if (amountToDeposit > 0 && amountToDeposit < minimumDeposit) {
        setAmountLessThanMinDeposit(true);
        setMaxTotalDepositsExceeded(false);
        setAmountMoreThanMaxDeposit(false);
        setMaxTotalLPDepositsExceeded(false);
      } else if (amountToDeposit > maximumDeposit) {
        setAmountMoreThanMaxDeposit(true);
        setAmountLessThanMinDeposit(false);
        setMaxTotalDepositsExceeded(false);
        setMaxTotalLPDepositsExceeded(false);
      } else if (
        amountToDeposit + totalSyndicateDeposits >
        maxAllowedTotalDeposits
      ) {
        setMaxTotalDepositsExceeded(true);
        setAmountMoreThanMaxDeposit(false);
        setAmountLessThanMinDeposit(false);
        setMaxTotalLPDepositsExceeded(false);
      } else if (lpTotalDeposits + amountToDeposit > maximumDeposit) {
        setMaxTotalLPDepositsExceeded(true);
        setMaxTotalDepositsExceeded(false);
        setAmountMoreThanMaxDeposit(false);
        setAmountLessThanMinDeposit(false);
      } else {
        setAmountLessThanMinDeposit(false);
        setAmountMoreThanMaxDeposit(false);
        setMaxTotalDepositsExceeded(false);
        setMaxTotalLPDepositsExceeded(false);
      }
    }
  }, [amount, syndicate]);

  useEffect(() => {
    if (syndicateContracts && syndicate) {
      // set up current deposit ERC20Contract and
      // and save it to the local state
      const ERC20Contract = new web3.eth.Contract(
        ERC20ABI,
        syndicate.depositERC20Address,
      );

      setDepositTokenContract(ERC20Contract);
    }
  }, [syndicateContracts, syndicate]);

  // COMPONENT FUNCTIONS

  /** Method to store updated member details in the redux store
   * This will be called whenever member details need to be updated
   * after an action.
   */
  const storeMemberDetails = () => {
    dispatch(
      updateMemberDepositDetails({
        syndicateAddress,
        depositTokenDecimals,
      }),
    );
  };

  // handle deposit form submit.
  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (!syndicateContracts) {
      // user needs to connect wallet first
      return dispatch(showWalletModal());
    }

    if (!lpCanDeposit) {
      // set LP allowance first before making a deposit.
      handleAllowanceApproval(event);
    } else {
      // Call invest functions based on current state.
      // deposit - page is in deposit mode
      // these values are fetched from the redux store.
      try {
        await investInSyndicate(amount);
      } catch (error) {
        // show error message for failed investment
        setShowErrorMessage(true);
        setErrorMessage(actionFailedError);
        setSubmitting(false);
      }
    }
  };

  const handleSetAmount = (event: any) => {
    event.preventDefault();
    const { value } = event.target;

    setAmount(value);

    const message = Validate(value);
    if (message) {
      setAmountError(`Deposit amount ${message}`);
    } else {
      setAmountError("");
    }
  };

  /**
   * This methods is used to invest in LP(syndicate)
   * The account that is investing is obtained from the connected wallet from
   * which funds will be transferred.
   * The syndicate address is obtained from the page params
   * @param {object} data contains amount, and accredited
   */
  const investInSyndicate = async (amount: number) => {
    /**
     * Check that wallet has enough ERC20 token to cater for deposit.
     * Continue deposit if there is enough funds. Otherwise, abort and inform
     * user that they don't have enough funds
     */
    const balance = await checkTokenBalance();
    if (+balance < +amount) {
      setMetamaskDepositError(
        `Your wallet account must have at least ${amount} ${depositTokenSymbol} in order to deposit into this syndicate.`,
      );
      return;
    }

    /**
     * All addresses are allowed, and investments can be rejected after the
     * fact. This is useful if you want to allow anyone to invest in a syndicate
     *  (for example, for a non-profit might enable this because there is
     * no expectation of profits and therefore they wouldn't need to be as
     * concerned about US securities regulations)
     * Addresses must be pre-approved by the manager and added to the
     * allowlist before an LP can invest.
     */

    /**
     * If deposit amount exceeds the allowed investment deposit, this will fail.
     */
    const amountToInvest = getWeiAmount(
      amount.toString(),
      depositTokenDecimals,
      true,
    );

    setMetamaskConfirmPending(true);
    try {
      await syndicateContracts.DepositLogicContract.deposit({
        syndicateAddress: syndicate.syndicateAddress,
        account,
        amount: amountToInvest,
        setMetamaskConfirmPending,
        setSubmitting,
      });

      dispatch(
        getSyndicateByAddress({
          syndicateAddress: syndicate.syndicateAddress,
          ...syndicateContracts,
        }),
      );

      //store updated member details
      storeMemberDetails();

      if (approved) {
        setApproved(false);
      }

      // reset allowance error
      if (allowanceApprovalError) {
        setAllowanceApprovalError("");
      }
      // reset approval amount
      if (approvedAllowanceAmount) {
        setApprovedAllowanceAmount("0");
      }
      // cancel submitting state and show success notification.
      setSubmitting(false);
      setSuccessfulDeposit(true);
      // reset approved allowance states
      // so the LP can set new allowances before investing again
      setLPCanDeposit(false);

      // Amplitude logger: Deposit funds
      amplitudeLogger(SUCCESSFUL_DEPOSIT, {
        flow: Flow.MBR_DEP,
        amount,
      });
    } catch (error) {
      const { code } = error;
      const errorMessage = getMetamaskError(code, "Deposit");
      setMetamaskDepositError(errorMessage);
      setSubmitting(false);

      // Amplitude logger: Deposit funds Error
      amplitudeLogger(ERROR_DEPOSIT, {
        flow: Flow.MBR_DEP,
        amount,
        error,
      });
    }

    // dispatch action to get details about the syndicate
    // These values will be used to update syndicate details
    // under the graph section on the UI.
    const {
      depositERC20Address,
      distributionShareToSyndicateLead,
      distributionShareToSyndicateProtocol,
    } = syndicate;
    dispatch(
      setSyndicateDetails(
        syndicateContracts,
        depositERC20Address,
        distributionShareToSyndicateLead,
        distributionShareToSyndicateProtocol,
        syndicate,
        syndicateAddress,
      ),
    );
  };

  // handle approval of allowances by an LP
  // before a deposit can be made
  const handleAllowanceApproval = async (event: any) => {
    event.preventDefault();
    setMetamaskConfirmPending(true);

    // set correct wei amount to approve
    const amountToApprove = getWeiAmount(
      amount.toString(),
      depositTokenDecimals,
      true,
    );
    try {
      await depositTokenContract.methods
        .approve(
          syndicateContracts.DepositLogicContract._address,
          amountToApprove,
        )
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          // user clicked on confirm
          // show loading state
          setSubmittingAllowanceApproval(true);
          setMetamaskConfirmPending(false);
        })
        .on("receipt", async () => {
          // some times the returned values from the attached event do not have
          // value key, hence the will be undefined.
          // call this function does the job of checking whether the allowance
          // was approved successfully or not.
          await checkMemberAllowanceAmount();
          setSubmittingAllowanceApproval(false);

          // Amplitude logger: Approve Allowance
          amplitudeLogger(APPROVE_DEPOSIT_ALLOWANCE, {
            flow: Flow.MBR_DEP,
            amount,
          });
        })
        .on("error", (error) => {
          // user clicked reject.
          const { code } = error;
          const errorMessage = getMetamaskError(code, "Allowance approval");
          setMetamaskApprovalError(errorMessage);
          setSubmittingAllowanceApproval(false);
          setMetamaskConfirmPending(false);

          // Amplitude logger: Error Approve Allowance
          amplitudeLogger(ERROR_APPROVE_ALLOWANCE, {
            flow: Flow.MBR_DEP,
            amount,
            error,
          });
        });
    } catch (error) {
      // error occurred before wallet prompt.
      const { code } = error;
      const errorMessage = getMetamaskError(code, "Allowance approval");
      setMetamaskConfirmPending(false);
      setMetamaskApprovalError(errorMessage);
      setSubmittingAllowanceApproval(false);
      setMetamaskConfirmPending(false);

      // Amplitude logger: Error Approve Allowance
      amplitudeLogger(ERROR_APPROVE_ALLOWANCE, {
        flow: Flow.MBR_DEP,
        amount,
        error,
      });
    }
  };

  /**
   *
   * @returns {string} balance of the user for the deposit ERC20 token
   */
  const checkTokenBalance = async () => {
    try {
      const balance = await depositTokenContract.methods
        .balanceOf(account.toString())
        .call({ from: account });
      return getWeiAmount(balance, depositTokenDecimals, false);
    } catch {
      return 0;
    }
  };

  // when the connected account is changed, we need to check for new allowances.
  // This check also needs to be done after a deposit has been made
  // as the allowance will be reset
  const checkMemberAllowanceAmount = async () => {
    if (depositTokenContract.methods && syndicateContracts && account) {
      /**
       * Check the approval amount
       *  @returns wei allowance as a string
       * */
      let lpAllowanceAmount;
      try {
        lpAllowanceAmount = await depositTokenContract.methods
          .allowance(
            account.toString(),
            syndicateContracts.DepositLogicContract._address,
          )
          .call({ from: account });
      } catch (error) {
        lpAllowanceAmount = 0;
      }

      try {
        const currentLPAllowanceAmount = getWeiAmount(
          lpAllowanceAmount.toString(),
          depositTokenDecimals,
          false,
        );

        if (currentLPAllowanceAmount > 0) {
          setApprovedAllowanceAmount(`${currentLPAllowanceAmount}`);
          setApproved(true);
          setAllowanceApprovalError("");
          setLPCanDeposit(true);
        } else {
          setApproved(false);
          setApprovedAllowanceAmount("0");
          setAllowanceApprovalError("");
          setLPCanDeposit(false);
        }
      } catch (error) {
        setConversionError(amountConversionErrorText);
      }
    }
  };

  // CONDITIONS
  if (syndicate) {
    const { allowlistEnabled } = syndicate;
    if (allowlistEnabled && memberAddressAllowed) {
      depositApprovalText = allowListEnabledApprovedText;
    } else if (allowlistEnabled && !memberAddressAllowed) {
      depositApprovalText = allowListEnabledNotApprovedText;
      disableAmountInput = true;
    } else if (!allowlistEnabled && memberAddressAllowed) {
      depositApprovalText = allowListDisabledApprovedText;
    } else if (!allowlistEnabled && !memberAddressAllowed) {
      depositApprovalText = allowListDisabledApprovedText;
    }
  }

  let depositTitle = depositTitleText;
  if (parseFloat(memberTotalDeposits) > 0) {
    depositTitle = depositMoreTitleText;
  }

  // conditions under which the skeleton loader should be rendered
  const showSkeletonLoader = !syndicate || loadingLPDetails;

  let showValidationError = false;
  if (
    amountError ||
    allowanceApprovalError ||
    conversionError ||
    amountLessThanMinDeposit ||
    amountMoreThanMaxDeposit ||
    maxTotalDepositsExceeded ||
    maxTotalLPDepositsExceeded
  ) {
    showValidationError = true;
  } else {
    showValidationError = false;
  }

  let errorMessageText = amountError;
  if (allowanceApprovalError && amountError) {
    errorMessageText = amountError;
  } else if (allowanceApprovalError && !amountError) {
    errorMessageText = allowanceApprovalError;
  } else if (conversionError) {
    errorMessageText = conversionError;
  } else if (amountLessThanMinDeposit) {
    errorMessageText = `${amountLessThanMinDepositErrorMessage} ${depositMemberMin} ${depositTokenSymbol}`;
  } else if (amountMoreThanMaxDeposit) {
    errorMessageText = `${amountMoreThanMaxDepositErrorMessage} ${depositMemberMax} ${depositTokenSymbol}`;
  } else if (maxTotalDepositsExceeded) {
    errorMessageText = `${maxTotalDepositsExceededErrorMessage} ${depositTotalMax} ${depositTokenSymbol} ${amountExceededText}`;
  } else if (maxTotalLPDepositsExceeded) {
    errorMessageText = `${maxTotalMemberDepositsExceededErrorMessage} ${depositMemberMax} ${depositTokenSymbol} ${amountExceededText}`;
  } else {
    errorMessageText = amountError;
  }

  // amount to show on the deposit button
  const depositAmountGreater =
    amountToDeposit > allowanceAmountApproved && approved;
  const depositAmountLess =
    amountToDeposit <= allowanceAmountApproved && approved;
  let amountToApprove = "0";
  if (depositAmountGreater) {
    amountToApprove = floatedNumberWithCommas(
      amountToDeposit - allowanceAmountApproved,
    );
  } else if (depositAmountLess) {
    amountToApprove = floatedNumberWithCommas(allowanceAmountApproved);
  } else if (amountToDeposit < 0 || !amountToDeposit) {
    amountToApprove = floatedNumberWithCommas(allowanceAmountApproved);
  } else if (!approved) {
    amountToApprove = floatedNumberWithCommas(amountToDeposit);
  }

  // text to show on approval button
  let approvalButtonText = "Approved";
  if (depositAmountGreater || allowanceAmountApproved === 0) {
    approvalButtonText = "Approve";
  }

  // if the current deposit amount exceeds the already approved amount
  // the approval button should be disabled
  // if the LP is not allowed to deposit, this button will also be disabled.
  let disableApprovalButton = false;
  if (
    (amountToDeposit <= allowanceAmountApproved && approved) ||
    disableAmountInput ||
    (amountToDeposit <= 0 && !approved) ||
    amountMoreThanMaxDeposit ||
    maxTotalDepositsExceeded ||
    amountLessThanMinDeposit ||
    maxTotalLPDepositsExceeded
  ) {
    disableApprovalButton = true;
  }

  // amount to show on the deposit button
  let depositButtonAmount = floatedNumberWithCommas(amountToDeposit);
  if (!amountToDeposit || amountToDeposit <= 0) {
    depositButtonAmount = "0.00";
  }

  // if a new deposit amount is entered, it needs to be approved
  // if no amount has been approved yet, the deposit button should be disabled.
  // button should also be disabled if the deposit amount is 0 or not set
  // if the LP is not on the approved list, we'll disable this button as well.
  let disableDepositButton = false;
  const increasedDepositAmount =
    amountToDeposit > allowanceAmountApproved && approved;
  if (
    !approved ||
    increasedDepositAmount ||
    amountToDeposit <= 0 ||
    disableAmountInput ||
    amountMoreThanMaxDeposit ||
    maxTotalDepositsExceeded ||
    amountLessThanMinDeposit ||
    maxTotalLPDepositsExceeded
  ) {
    disableDepositButton = true;
  }

  // set correct loader header text depending on current state
  let loaderHeaderText;
  if (submitting) {
    loaderHeaderText = loaderDepositHeaderText;
  } else if (submittingAllowanceApproval) {
    loaderHeaderText = loaderApprovalHeaderText;
  } else {
    loaderHeaderText = loaderGeneralHeaderText;
  }

  // set metamask error message
  const { metamaskErrorMessageTitleText } = metamaskConstants;
  let metamaskErrorMessageText = metamaskApprovalError;
  if (metamaskDepositError) {
    metamaskErrorMessageText = metamaskDepositError;
  }

  // close the syndicate action loader
  const closeSyndicateActionLoader = () => {
    logActionLoader();
    setAllowanceApprovalError("");
    setSubmittingAllowanceApproval(false);
    setMetamaskApprovalError("");
    setMetamaskDepositError("");
    setSubmitting(false);
    setSuccessfulDeposit(false);
    setMetamaskConfirmPending(false);
    if (successfulDeposit) {
      setAmount(0);
    }
  };

  const logActionLoader = () => {
    // Amplitude logger: Member clicked "Deposit More" on widget.
    if (successfulDeposit) {
      amplitudeLogger(DEPOSIT_MORE, {
        flow: Flow.MBR_DEP,
        description: "Member clicked deposit more",
      });
    }

    // Amplitude logger: Member clicked "Dismiss" on Transaction Rejected widget.
    if (metamaskApprovalError || metamaskDepositError) {
      amplitudeLogger(DISMISS_TRANSACTION_REJECTED, {
        flow: Flow.MBR_DEP,
        description: "Member clicked dismiss after transaction was rejected",
      });
    }
  };

  // INNER COMPONENTS
  // show buttons based on whether the current state is a deposit or approval
  // we'll default to the approval/deposit state
  const actionButton = (
    <div className="mb-2">
      <div className="mb-4">
        <SyndicateActionButton
          amountError={Boolean(amountError)}
          buttonText={`${approvalButtonText} ${
            amountToApprove ? amountToApprove : floatedNumberWithCommas("0")
          } ${depositTokenSymbol}`}
          disableApprovalButton={disableApprovalButton}
          action="approval"
          approved={approved}
          depositAmountChanged={depositAmountChanged}
        />
      </div>
      <div className="mb-4">
        <SyndicateActionButton
          amountError={Boolean(amountError)}
          buttonText={`Deposit ${depositButtonAmount} ${depositTokenSymbol}`}
          disableDepositButton={disableDepositButton}
          approved={approved}
          depositAmountChanged={depositAmountChanged}
        />
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="w-full mt-4 sm:mt-0 sticky top-44 mb-10">
        <FadeIn>
          <div
            className={`h-fit-content px-8 pb-4 pt-5 bg-gray-9 ${
              !account ? "rounded-2xl" : `border-b-0 rounded-t-2xl`
            }`}
          >
            {renderJoinWaitList ? (
              <JoinWaitlist />
            ) : renderUnavailableState ? (
              <UnavailableState title={title} message={message} />
            ) : (
              depositsAvailable && (
                <>
                  {submittingAllowanceApproval || submitting ? (
                    <SyndicateActionLoader
                      contractAddress={
                        submittingAllowanceApproval
                          ? syndicate?.depositERC20Address
                          : syndicateAddress
                      }
                      headerText={loaderHeaderText}
                    />
                  ) : metamaskApprovalError || metamaskDepositError ? (
                    <SyndicateActionLoader
                      contractAddress={
                        metamaskApprovalError || metamaskDepositError
                          ? syndicate?.depositERC20Address
                          : syndicateAddress
                      }
                      headerText={metamaskErrorMessageTitleText}
                      subText={metamaskErrorMessageText}
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
                  ) : successfulDeposit ? (
                    <SyndicateActionLoader
                      contractAddress={syndicateAddress}
                      headerText={depositSuccessTitleText}
                      subText={depositSuccessSubtext}
                      showRetryButton={true}
                      success={true}
                      buttonText={
                        depositLimits
                          ? depositSuccessBackButtonText
                          : depositSuccessButtonText
                      }
                      closeLoader={closeSyndicateActionLoader}
                    />
                  ) : /* deposits are disabled either when syndicate is closed,
                  or member has made the maximum deposits allowed per member,
                  or the maximum deposits allowed for syndicate have been made
                  */
                  !syndicate?.depositsEnabled ||
                    depositLimits ||
                    router.pathname.endsWith("details") ? (
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
                        <div className="flex flex-col items-center justify-center my-8 mx-6">
                          <p className="font-semibold text-2xl text-center">
                            Deposits are disabled.
                          </p>
                        </div>
                      )}
                    </>
                  ) : memberMaxDepositReached && !showSkeletonLoader ? (
                    <SyndicateActionLoader
                      headerText={maxMemberDepositsTitleText}
                      subText={maxMemberDepositsText}
                      error={true}
                      showRetryButton={false}
                    />
                  ) : (
                    <FadeIn>
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
                            alt="deposit icon"
                          />

                          <p className="font-semibold text-xl p-2">
                            {depositTitle}
                          </p>
                        </div>
                      )}

                      <div>
                        {/* show this text if whitelist is enabled for deposits */}
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
                            {depositApprovalText}
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
                                type="number"
                                placeholder="400"
                                disabled={disableAmountInput}
                                defaultValue={amount}
                                onChange={handleSetAmount}
                                className={`min-w-0 rounded-md bg-gray-9 border border-gray-24 text-white font-whyte focus:outline-none focus:ring-gray-24 focus:border-gray-24 flex-grow mr-6 `}
                              />
                              <p className="flex-shrink-0 flex items-center whitespace-nowrap">
                                {depositTokenLogo && (
                                  <img
                                    className="mr-2 w-5"
                                    src={depositTokenLogo}
                                    alt="deposit logo"
                                  />
                                )}
                                {depositTokenSymbol}
                              </p>
                            </div>
                            <p className="mr-2 w-full text-red-500 text-xs mt-2 mb-4">
                              {showValidationError ? errorMessageText : null}
                            </p>
                            {/* checkbox for user to confirm they are accredited investor if this is a deposit */}
                            <p className="text-sm my-5 text-gray-500">
                              {depositMemberAccreditedText}
                            </p>
                            <div className="mb-2">{actionButton}</div>
                            <div className="flex justify-center">
                              <div className="w-2/3 text-sm my-5 text-gray-500 justify-self-center text-center">
                                {depositDisclaimerText}
                              </div>
                            </div>
                          </form>
                        )}
                      </div>
                    </FadeIn>
                  )}
                </>
              )
            )}
          </div>
        </FadeIn>
        {/* This component should be shown when we have details about user deposits */}
        {account && (
          <DetailsCard
            {...{ sections, syndicate, loadingLPDetails }}
            title="My Stats"
            customStyles="p-8 rounded-b-3xl bg-gray-6 border-t border-gray-700 "
            customInnerWidth="w-full"
          />
        )}

        {/* show this components if we are in details page*/}
        {router.pathname.endsWith("details") ? (
          <ManageSyndicate syndicateAddress={syndicateAddress} />
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

export default DepositSyndicate;
