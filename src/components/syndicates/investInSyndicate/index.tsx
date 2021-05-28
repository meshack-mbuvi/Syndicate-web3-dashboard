import ErrorBoundary from "@/components/errorBoundary";
import { getSyndicateByAddress } from "@/redux/actions/syndicates";
import { showWalletModal } from "@/redux/actions/web3Provider";
import { Validate } from "@/utils/validators";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { ErrorModal } from "src/components/shared/ErrorModal";
import { SkeletonLoader } from "src/components/skeletonLoader";
import { getMetamaskError } from "src/helpers/metamaskError";
import { setSyndicateDetails } from "src/redux/actions/syndicateDetails";
import { updateSyndicateLPDetails } from "src/redux/actions/syndicateLPDetails";
// utils and helpers
import { toEther } from "src/utils";
import { getWeiAmount } from "src/utils/conversions";
import { ERC20TokenDetails } from "src/utils/ERC20Methods";
import { floatedNumberWithCommas } from "src/utils/numberWithCommas";
import { TokenMappings } from "src/utils/tokenMappings";
// shared components
import { DetailsCard } from "../shared";
import {
  constants,
  metamaskConstants,
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
import ERC20ABI from "src/utils/abi/erc20";
import { RootState } from "@/redux/store";
import { checkAccountAllowance } from "src/helpers/approveAllowance";

const Web3 = require("web3");

interface InvestInSyndicateProps {
  web3: any;
  syndicate: any;
  syndicateAction: any;
  syndicateLPDetails: any;
  syndicateContractInstance: any;
}

const InvestInSyndicate = (props: InvestInSyndicateProps) => {
  const {
    web3: { account },
    syndicate,
    syndicateAction,
    syndicateLPDetails,
  } = props;
  const router = useRouter();
  const { syndicateContractInstance } = useSelector(
    (state: RootState) => state.syndicateInstanceReducer
  );
  const { distributionTokensAllowanceDetails } = useSelector(
    (state: RootState) => state.tokenDetailsReducer
  );

  const dispatch = useDispatch();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [
    totalAvailableDistributions,
    setTotalAvailableDistributions,
  ] = useState<string>("0");

  const [amount, setAmount] = useState<number>(0);
  const [amountError, setAmountError] = useState<string>("");

  const [currentERC20Decimals, setCurrentERC20Decimals] = useState<number>(18);
  const [currentERC20, setCurrentERC20] = useState<string>("DAI");
  const [currentERC20Contract, setCurrentERC20Contract] = useState<any>({});
  const [
    depositsAndWithdrawalsAvailable,
    setDepositsAndWithdrawalsAvailable,
  ] = useState<Boolean>(true);
  const [
    submittingAllowanceApproval,
    setSubmittingAllowanceApproval,
  ] = useState<boolean>(false);
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState<boolean>(
    false
  );
  const [approved, setApproved] = useState<boolean>(false);
  const [allowanceApprovalError, setAllowanceApprovalError] = useState<string>(
    ""
  );
  const [
    approvedAllowanceAmount,
    setApprovedAllowanceAmount,
  ] = useState<string>("0");
  const [depositAmountChanged, setDepositAmountChanged] = useState<boolean>(
    false
  );
  const [depositsAvailable, setDepositsAvailable] = useState<boolean>(true);

  const [lpCanDeposit, setLPCanDeposit] = useState<boolean>(false);
  const [conversionError, setConversionError] = useState<string>("");
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [maxLPsZero, setMaxLPsZero] = useState<boolean>(false);

  // convert deposit and allowance values to floats for more accurate calculations.
  const amountToDeposit = parseFloat(amount.toString());
  const allowanceAmountApproved = parseFloat(approvedAllowanceAmount);

  // check maximum and minimum deposits to disallow deposits
  const [
    amountLessThanMinDeposit,
    setAmountLessThanMinDeposit,
  ] = useState<boolean>(false);
  const [
    amountMoreThanMaxDeposit,
    setAmountMoreThanMaxDeposit,
  ] = useState<boolean>(false);

  const [
    maxTotalDepositsExceeded,
    setMaxTotalDepositsExceeded,
  ] = useState<boolean>(true);

  const [
    maxTotalLPDepositsExceeded,
    setMaxTotalLPDepositsExceeded,
  ] = useState<boolean>(false);

  // handle metamask errors
  const [metamaskApprovalError, setMetamaskApprovalError] = useState<string>(
    ""
  );
  const [metamaskDepositError, setMetamaskDepositError] = useState<string>("");

  // deposit/withdrawal success state
  const [successfulDeposit, setSuccessfulDeposit] = useState<boolean>(false);
  const [successfulWithdrawal, setSuccessfulWithdrawal] = useState<boolean>(
    false
  );

  // set metamask loading state
  const [metamaskConfirmPending, setMetamaskConfirmPending] = useState<boolean>(
    false
  );

  // withdrawal page states
  const [
    amountGreaterThanMemberDistributions,
    setAmountGreaterThanMemberDistributions,
  ] = useState<boolean>(false);

  // distributions states
  const [
    currentDistributionTokenSymbol,
    setCurrentDistributionTokenSymbol,
  ] = useState<string>("");

  const [
    currentDistributionTokenDecimals,
    setCurrentDistributionTokenDecimals,
  ] = useState<number>(18);
  const [
    currentDistributionTokenAddress,
    setCurrentDistributionTokenAddress,
  ] = useState<string>("");

  const {
    myDeposits,
    myPercentageOfThisSyndicate,
    withdrawalsToDepositPercentage,
    myWithdrawalsToDate,
    myDistributionsToDate,
    maxDepositReached,
  } = syndicateLPDetails;

  const {
    depositTitleText,
    depositMoreTitleText,
    allowListDisabledApprovedText,
    allowListDisabledNotApprovedText,
    allowListEnabledApprovedText,
    allowListEnabledNotApprovedText,
    depositDisclaimerText,
    depositLPAccreditedText,
    withdrawalTitleText,
    withdrawalDisclaimerText,
    depositsAndWithdrawalsUnavailableText,
    depositsAndWithdrawalsUnavailableTitleText,
    loaderWithdrawalHeaderText,
    loaderDepositHeaderText,
    loaderApprovalHeaderText,
    increaseDepositAllowanceErrorMessage,
    loaderGeneralHeaderText,
    amountConversionErrorText,
    actionFailedError,
    depositsUnavailableText,
    depositsUnavailableTitleText,
    connectWalletMessageTitle,
    connectWalletMessage,
    connectWalletWithdrawMessage,
    connectWalletDepositMessage,
    depositsUnavailableMaxLPsZeroText,
    maxMemberDepositsTitleText,
    maxMemberDepositsText,
    nonMemberWithdrawalTitleText,
    nonMemberWithdrawalText,
    amountGreaterThanMemberDistributionsText,
    withdrawalSuccessTitleText,
    withdrawalSuccessSubtext,
    withdrawalSuccessButtonText,
  } = constants;

  // get the state of the current syndicate action
  // This is used to show withdrawal or deposit components.
  const { withdraw, deposit, generalView } = syndicateAction;

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

  /**
   * all syndicates are handled by the Syndicate contract, so the contract
   * address is the same for all of them while the syndicate address that is passed
   * into the contract is different
   */
  const { syndicateAddress } = router.query;
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  const getTokenDecimals = async (tokenAddress) => {
    // set token decimals based on the token address
    const ERC20Details = new ERC20TokenDetails(tokenAddress);
    const tokenDecimals = await ERC20Details.getTokenDecimals();
    if (tokenDecimals !== null) {
      setCurrentERC20Decimals(parseInt(tokenDecimals));
    }
  };

  // set token symbol based on deposit token address
  // we'll manually map the token symbol for now.
  // we'll also set the token decimals of the deposit/Withdrawal ERC20 token here
  useEffect(() => {
    if (syndicate) {
      // set token symbol based on token address
      const tokenAddress = syndicate.depositERC20ContractAddress;
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

  /** Method to store updated member details in the redux store
   * This will be called whenever member details need to be updated
   * after an action.
   */
  const storeMemberDetails = () => {
    dispatch(
      updateSyndicateLPDetails({
        syndicateContractInstance,
        account,
        syndicateAddress,
        syndicate,
        web3,
        totalAvailableDistributions,
        currentERC20Decimals,
        currentDistributionTokenDecimals,
      })
    );
  };

  // check whether the current deposit amount exceeds max LP deposit allowed
  // or if the deposit amount is less than the min LP deposit allowed.
  // or if the maximum total deposits has been exceeded
  useEffect(() => {
    if (syndicate) {
      const {
        minDeposit,
        maxDeposit,
        totalDeposits,
        maxTotalDeposits,
      } = syndicate;
      const amountToDeposit = parseFloat(amount.toString());
      const minimumDeposit = parseFloat(minDeposit);
      const maximumDeposit = parseFloat(maxDeposit);
      const totalSyndicateDeposits = parseFloat(totalDeposits);
      const maxAllowedTotalDeposits = parseFloat(maxTotalDeposits);
      const lpTotalDeposits = parseFloat(myDeposits);

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

  // check for errors on the member withdrawal page.
  useEffect(() => {
    if (withdraw && syndicateLPDetails) {
      // show error when amount is greater than member's available distributions.
      const amountGreaterThanMemberDistributions =
        +amount > +myDistributionsToDate;
      if (amountGreaterThanMemberDistributions) {
        setAmountGreaterThanMemberDistributions(true);
      } else {
        setAmountGreaterThanMemberDistributions(false);
      }
    }
  }, [amount, syndicateLPDetails]);
  // check whether the current syndicate is accepting deposits
  // or withdrawals
  useEffect(() => {
    if (syndicate) {
      const { syndicateOpen, distributionsEnabled, maxLPs } = syndicate;

      // if a syndicate is closed and distributions have not been enabled
      // the LP cannot deposit or withdraw from it.
      const closedToDepositsWithNoDistribution =
        !syndicateOpen && !distributionsEnabled;

      if (closedToDepositsWithNoDistribution) {
        setDepositsAndWithdrawalsAvailable(false);
      } else {
        setDepositsAndWithdrawalsAvailable(true);
      }

      // if the syndicate is closed, deposits are not available.
      // This check is important should a member try to access the deposit/details page of a closed syndicate.
      if (!syndicateOpen) {
        setDepositsAvailable(false);
        setMaxLPsZero(false);
      } else {
        setDepositsAvailable(true);
        setMaxLPsZero(false);
      }

      // if the maxLPs value for the syndicate is set to zero,
      // then deposits are not available for the syndicate even though it's open
      if (parseInt(maxLPs) < 1) {
        setMaxLPsZero(true);
        setDepositsAvailable(false);
      } else {
        setMaxLPsZero(false);
        setDepositsAvailable(true);
      }
    }
  }, [syndicate]);

  const [loadingLPDetails, setLoadingLPDetails] = useState<boolean>(false);

  // get values for the current LP(connected wallet account)
  // when this component initially renders.
  useEffect(() => {
    if (account && syndicateContractInstance) {
      setLoadingLPDetails(true);
      // push member details to the redix store
      storeMemberDetails();
      setLoadingLPDetails(false);
    }
  }, [
    syndicate,
    syndicateContractInstance,
    currentERC20Contract,
    totalAvailableDistributions,
    account,
  ]);

  useEffect(() => {
    if (syndicateContractInstance?.methods && syndicate) {
      // set up current deposit ERC20Contract and
      // and save it to the local state
      const ERC20Contract = new web3.eth.Contract(
        ERC20ABI,
        syndicate.depositERC20ContractAddress
      );

      setCurrentERC20Contract(ERC20Contract);
    }
  }, [syndicateContractInstance, syndicate]);

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

  useEffect(() => {
    /**
     * When contract instance is null or undefined, we can't access syndicate
     * address so we need to connect to wallet first which will handle contract
     * instantiation.
     */
    if (!syndicateContractInstance) {
      dispatch(showWalletModal());
    }
  }, [syndicateContractInstance]);

  const handleSetAmount = (event: any) => {
    event.preventDefault();
    const { value } = event.target;

    setAmount(value);

    const message = Validate(value);
    if (message) {
      setAmountError(
        `${withdraw ? "Withdrawal amount" : "Deposit amount"} ${message}`
      );
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
    const amountToInvest = toEther(amount);
    setMetamaskConfirmPending(true);
    try {
      await syndicateContractInstance.methods
        .lpInvestInSyndicate(syndicateAddress, amountToInvest)
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          // user has confirmed the transaction so we should start loader state.
          // show loading modal
          setMetamaskConfirmPending(false);
          setSubmitting(true);
        })
        .on("receipt", () => {
          // transaction was succesful
          // get syndicate updated values

          dispatch(
            getSyndicateByAddress(syndicateAddress, syndicateContractInstance)
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
        })
        .on("error", (error) => {
          const { code } = error;
          const errorMessage = getMetamaskError(code, "Deposit");
          setMetamaskDepositError(errorMessage);
          setSubmitting(false);
        });
    } catch (error) {
      const { code } = error;
      const errorMessage = getMetamaskError(code, "Deposit");
      setMetamaskDepositError(errorMessage);
      setSubmitting(false);
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
        syndicateContractInstance,
        depositERC20ContractAddress,
        profitShareToSyndicateLead,
        profitShareToSyndicateProtocol,
        syndicate,
        syndicateAddress
      )
    );
  };

  /** method used by an LP to withdraw from a syndicate
   * @param withdrawAmount The amount to withdraw from the syndicate.
   * If withdrawal amount exceeds the amount of unclaimed distribution, this would fail.
   */
  const withdrawFromSyndicate = async (withdrawAmount: number) => {
    const amountToWithdraw = getWeiAmount(
      withdrawAmount.toString(),
      currentDistributionTokenDecimals,
      true
    );

    try {
      const { totalDeposits } = syndicate;

      // get member details
      const syndicateLPInfo = await syndicateContractInstance.methods
        .getSyndicateLPInfo(syndicateAddress, account)
        .call();

      // get total distributions
      const totalSyndicateDistributions = await syndicateContractInstance.methods
        .getTotalDistributions(
          syndicateAddress,
          web3.utils.toChecksumAddress(currentDistributionTokenAddress)
        )
        .call();

      // get eligible withdrawal amount
      const eligibleWithdrawal = await syndicateContractInstance.methods
        .calculateEligibleWithdrawal(
          syndicateLPInfo[0],
          totalDeposits,
          syndicateLPInfo[1],
          totalSyndicateDistributions
        )
        .call();

      // check if manager has set an allowance
      const managerDepositTokenAllowance = await checkAccountAllowance(
        currentDistributionTokenAddress,
        syndicateAddress,
        syndicateContractInstance._address
      );

      // check if the syndicate has distributions set
      const { distributionsEnabled } = syndicate;

      setMetamaskConfirmPending(true);
      /** This method is used by an LP to withdraw a deposit or distribution from a Syndicate
       * @param syndicateAddress The Syndicate that an LP wants to withdraw from
       * @param currentDistributionTokenAddress The ERC 20 address to be transferred from the
       * manager to the member.
       * @param amountToWithdraw The amount to withdraw
       */
      await syndicateContractInstance.methods
        .lpWithdrawFromSyndicate(
          syndicateAddress,
          currentDistributionTokenAddress,
          amountToWithdraw
        )
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

  // update states when error is encountered during withdrawals
  const handleWithdrawalError = (code: number) => {
    const errorMessage = getMetamaskError(code, "Withdrawal");
    setMetamaskDepositError(errorMessage);
    setSubmittingWithdrawal(false);
    setSuccessfulWithdrawal(false);
  };

  // consolidate all deposit modes
  // the 'view' (generalView state) and 'deposit more' (deposit state) buttons
  // will load deposit components.
  const depositModes = deposit || generalView;

  // handle approval of allowances by an LP
  // before a deposit can be made
  const handleAllowanceApproval = async (event: any) => {
    event.preventDefault();
    setMetamaskConfirmPending(true);

    // set correct wei amount to approve
    const amountToApprove = getWeiAmount(
      amount.toString(),
      currentERC20Decimals,
      true
    );
    try {
      await currentERC20Contract.methods
        .approve(syndicateContractInstance._address, amountToApprove)
        .send({ from: account, gasLimit: 800000 })
        .on("transactionHash", () => {
          // user clicked on confirm
          // show loading state
          setSubmittingAllowanceApproval(true);
          setMetamaskConfirmPending(false);
        })
        .on("receipt", (receipt) => {
          // approval transaction successful
          const { Approval } = receipt.events;
          const { returnValues } = Approval;
          const { value } = returnValues;
          const lpApprovedAllowance = getWeiAmount(
            value,
            currentERC20Decimals,
            false
          );

          setApprovedAllowanceAmount(`${lpApprovedAllowance}`);
          setAllowanceApprovalError("");
          setApproved(true);
          setLPCanDeposit(true);
          setSubmittingAllowanceApproval(false);
        })
        .on("error", (error) => {
          // user clicked reject.
          const { code } = error;
          const errorMessage = getMetamaskError(code, "Allowance approval");
          setMetamaskApprovalError(errorMessage);
          setSubmittingAllowanceApproval(false);
          setMetamaskConfirmPending(false);
        });
    } catch (error) {
      // error occured before wallet prompt.
      const { code } = error;
      const errorMessage = getMetamaskError(code, "Allowance approval");
      setMetamaskConfirmPending(false);
      setMetamaskApprovalError(errorMessage);
      setSubmittingAllowanceApproval(false);
      setMetamaskConfirmPending(false);
    }
  };

  // handle deposit/withdrawal form submit.
  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (!syndicateContractInstance) {
      // user needs to connect wallet first
      return dispatch(showWalletModal());
    }

    if (depositModes && !lpCanDeposit) {
      // set LP allowance first before making a deposit.
      handleAllowanceApproval(event);
    } else {
      // Call invest or withdrawal functions based on current state.
      // deposit - page is in deposit mode
      // withdraw - page is in withdraw mode
      // these values are fetched from the redux store.
      try {
        if (depositModes) {
          await investInSyndicate(amount);
        }

        if (withdraw) {
          await withdrawFromSyndicate(amount);
        }
      } catch (error) {
        // show error message for failed investment
        setShowErrorMessage(true);
        setErrorMessage(actionFailedError);
        setSubmitting(false);
      }
    }
  };

  // set title and texts of section based on
  // whether this is a withdrawal or a deposit.
  const totalDistributionsText = `${floatedNumberWithCommas(
    totalAvailableDistributions
  )} ${
    currentDistributionTokenSymbol ? currentDistributionTokenSymbol : ""
  } ($${floatedNumberWithCommas(
    totalAvailableDistributions
  )}) distributions available.`;

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

  // when the connected account is changed, we need to check for new allowances.
  // This check also needs to be done after a deposit has been made
  // as the allowance will be reset
  const checkLPAllowanceAmount = async () => {
    if (currentERC20Contract.methods && syndicateContractInstance && account) {
      /**
       * Check the approval amount
       *  @returns wei allowance as a string
       * */
      const lpAllowanceAmount = await currentERC20Contract.methods
        .allowance(account.toString(), syndicateContractInstance._address)
        .call({ from: account });

      try {
        const currentLPAllowanceAmount = getWeiAmount(
          lpAllowanceAmount.toString(),
          currentERC20Decimals,
          false
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
  useEffect(() => {
    checkLPAllowanceAmount();
  }, [
    account,
    currentERC20Contract,
    syndicateContractInstance,
    approvedAllowanceAmount,
    approved,
  ]);

  // check if LP address is on the allowed address list
  // if allowlist is enabled.
  // if allowlist is disabled, any address can deposit.
  // set correct status text to display.
  const { myAddressAllowed } = syndicateLPDetails;
  let depositApprovalText;
  let disableAmountInput = false;

  if (syndicate) {
    const { allowlistEnabled } = syndicate;
    if (allowlistEnabled && myAddressAllowed) {
      depositApprovalText = allowListEnabledApprovedText;
    } else if (allowlistEnabled && !myAddressAllowed) {
      depositApprovalText = allowListEnabledNotApprovedText;
      disableAmountInput = true;
    } else if (!allowlistEnabled && myAddressAllowed) {
      depositApprovalText = allowListDisabledApprovedText;
    } else if (!allowlistEnabled && !myAddressAllowed) {
      depositApprovalText = allowListDisabledNotApprovedText;
      disableAmountInput = true;
    }
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

  // disable the withdraw button if
  // the amount is greater than the member's available distributions
  let disableWithrawButton = false;
  if (amountGreaterThanMemberDistributions) {
    disableWithrawButton = true;
  }

  // amount to show on the deposit button
  const depositAmountGreater =
    amountToDeposit > allowanceAmountApproved && approved;
  const depositAmountLess =
    amountToDeposit <= allowanceAmountApproved && approved;
  let amountToApprove = 0;
  if (depositAmountGreater) {
    amountToApprove = floatedNumberWithCommas(
      amountToDeposit - allowanceAmountApproved
    );
  } else if (depositAmountLess) {
    amountToApprove = floatedNumberWithCommas(allowanceAmountApproved);
  } else if (amountToDeposit < 0 || !amountToDeposit) {
    amountToApprove = floatedNumberWithCommas(allowanceAmountApproved);
  } else if (!approved) {
    amountToApprove = floatedNumberWithCommas(amountToDeposit);
  } else {
  }

  // text to show on approval button
  let approvalButtonText = "Approved";
  if (depositAmountGreater || allowanceAmountApproved === 0) {
    approvalButtonText = "Approve";
  }

  // amount to show on the deposit button
  let depositButtonAmount = floatedNumberWithCommas(amountToDeposit);
  if (!amountToDeposit || amountToDeposit <= 0) {
    depositButtonAmount = "0.00";
  }

  // show buttons based on whether the current state is a deposit/withdrawal or approval
  // we'll default to the approval/deposit state
  let actionButton = (
    <div className="mb-2">
      <div className="mb-4">
        <SyndicateActionButton
          amountError={Boolean(amountError)}
          buttonText={`${approvalButtonText} ${
            amountToApprove ? amountToApprove : floatedNumberWithCommas("0")
          } ${currentERC20}`}
          disableApprovalButton={disableApprovalButton}
          action="approval"
          approved={approved}
          depositAmountChanged={depositAmountChanged}
        />
      </div>
      <div className="mb-4">
        <SyndicateActionButton
          amountError={Boolean(amountError)}
          buttonText={`Deposit ${depositButtonAmount} ${currentERC20}`}
          disableDepositButton={disableDepositButton}
        />
      </div>
    </div>
  );

  // change action button when the current state is a withdrawal
  if (withdraw) {
    actionButton = (
      <div className="mb-4">
        <SyndicateActionButton
          amountError={Boolean(amountError)}
          buttonText="Continue"
          disableWithdrawButton={disableWithrawButton}
        />
      </div>
    );
  }

  // set correct loader header text depending on current state
  let loaderHeaderText;
  if (submitting) {
    loaderHeaderText = loaderDepositHeaderText;
  } else if (submittingAllowanceApproval) {
    loaderHeaderText = loaderApprovalHeaderText;
  } else if (submittingWithdrawal) {
    loaderHeaderText = loaderWithdrawalHeaderText;
  } else {
    loaderHeaderText = loaderGeneralHeaderText;
  }

  // set LP details section based on state
  let sections = depositSections;
  if (withdraw) {
    sections = WithdrawalSections;
  }

  // check if minDeposit, maxDeposit, or maxTotalDeposits has been violated
  // show an error message and disable deposit and approval buttons if this is the case
  if (syndicate) {
    var { minDeposit, maxDeposit, maxTotalDeposits } = syndicate;
  }

  // get error message texts.
  const {
    amountLessThanMinDepositErrorMessage,
    amountMoreThanMaxDepositErrorMessage,
    maxTotalDepositsExceededErrorMessage,
    maxTotalLPDepositsExceededErrorMessage,
    amountExceededText,
  } = constants;

  // show error message depending on what triggered it on the deposit/withdrawal page
  let errorMessageText = amountError;
  if (depositModes) {
    if (allowanceApprovalError && amountError) {
      errorMessageText = amountError;
    } else if (allowanceApprovalError && !amountError) {
      errorMessageText = allowanceApprovalError;
    } else if (conversionError) {
      errorMessageText = conversionError;
    } else if (amountLessThanMinDeposit) {
      errorMessageText = `${amountLessThanMinDepositErrorMessage} ${minDeposit} ${currentERC20}`;
    } else if (amountMoreThanMaxDeposit) {
      errorMessageText = `${amountMoreThanMaxDepositErrorMessage} ${maxDeposit} ${currentERC20}`;
    } else if (maxTotalDepositsExceeded) {
      errorMessageText = `${maxTotalDepositsExceededErrorMessage} ${maxTotalDeposits} ${currentERC20} ${amountExceededText}`;
    } else if (maxTotalLPDepositsExceeded) {
      errorMessageText = `${maxTotalLPDepositsExceededErrorMessage} ${maxDeposit} ${currentERC20} ${amountExceededText}`;
    } else {
      errorMessageText = amountError;
    }
  } else if (withdraw) {
    if (amountGreaterThanMemberDistributions) {
      errorMessageText = amountGreaterThanMemberDistributionsText;
    } else {
      errorMessageText = amountError;
    }
  }

  // set correct text to show when the wallet account is not connected
  let noWalletAccountText = connectWalletMessage;
  if (depositModes) {
    noWalletAccountText = connectWalletDepositMessage;
  } else if (withdraw) {
    noWalletAccountText = connectWalletWithdrawMessage;
  }

  // component to show any unavailable state for deposits, withdrawals,
  // and instances where the wallet account is not connected.
  const UnavailableState = ({
    title,
    message,
  }: {
    title: string;
    message: string;
  }) => {
    return (
      <div>
        <p className="font-semibold text-xl p-2">{title}</p>
        <p className="p-4 pl-6 text-gray-dim text-sm">{message}</p>
      </div>
    );
  };

  // set appropriate text for a syndicate that is closed
  // or one that's open but has maxLPs set to zero
  let unavailableForDepositsText = depositsUnavailableText;
  if (maxLPsZero) {
    unavailableForDepositsText = depositsUnavailableMaxLPsZeroText;
  }

  //set deposit title
  let depositTitle = depositTitleText;
  if (parseFloat(myDeposits) > 0) {
    depositTitle = depositMoreTitleText;
  }

  // set metamask error message
  const { metamaskErrorMessageTitleText } = metamaskConstants;
  let metamaskErrorMessageText = metamaskApprovalError;
  if (metamaskDepositError) {
    metamaskErrorMessageText = metamaskDepositError;
  }

  // close the syndicate action loader
  const closeSyndicateActionLoader = () => {
    setAllowanceApprovalError("");
    setSubmittingAllowanceApproval(false);
    setMetamaskApprovalError("");
    setMetamaskDepositError("");
    setSubmitting(false);
    setSuccessfulDeposit(false);
    setSuccessfulWithdrawal(false);
    setMetamaskConfirmPending(false);
  };

  // texts for deposit and approval success/error states
  const {
    depositSuccessTitleText,
    depositSuccessSubtext,
    depositSuccessButtonText,
    dismissButtonText,
  } = constants;

  // texts for metamask confirmation pending
  const {
    walletPendingConfirmPendingTitleText,
    walletPendingConfirmPendingMessage,
  } = walletConfirmConstants;

  // conditions for showing validation error message
  // error messages will be shown based on whether the current page
  // is the deposit page or the withdrawal page.
  let showValidationError = false;
  if (depositModes) {
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
  } else if (withdraw) {
    if (amountError || amountGreaterThanMemberDistributions) {
      showValidationError = true;
    } else {
      showValidationError = false;
    }
  }

  // conditions under which the skeleton loader should be rendered
  const showSkeletonLoader =
    !syndicate ||
    loadingLPDetails ||
    (withdraw && !distributionTokensAllowanceDetails.length);

  return (
    <ErrorBoundary>
      <div className="w-full md:w-1/2 mt-4 sm:mt-0">
        <div
          className={`h-fit-content  mx-2 p-4 pb-2 md:p-6 bg-gray-7 sm:ml-6 border ${
            !account ? "rounded-custom" : `border-b-0 rounded-t-custom`
          } border-gray-49`}
        >
          {!account ? (
            <UnavailableState
              title={connectWalletMessageTitle}
              message={noWalletAccountText}
            />
          ) : (!depositsAvailable && depositModes) ||
            (depositModes && maxLPsZero) ? (
            <UnavailableState
              title={depositsUnavailableTitleText}
              message={unavailableForDepositsText}
            />
          ) : depositsAndWithdrawalsAvailable ? (
            <>
              {submittingAllowanceApproval ||
              submitting ||
              submittingWithdrawal ? (
                <SyndicateActionLoader
                  contractAddress={
                    submittingAllowanceApproval
                      ? syndicate?.depositERC20ContractAddress
                      : syndicateAddress
                  }
                  headerText={loaderHeaderText}
                />
              ) : metamaskApprovalError || metamaskDepositError ? (
                <SyndicateActionLoader
                  contractAddress={
                    metamaskApprovalError || metamaskDepositError
                      ? syndicate?.depositERC20ContractAddress
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
              ) : successfulDeposit && depositModes ? (
                <SyndicateActionLoader
                  contractAddress={syndicateAddress}
                  headerText={depositSuccessTitleText}
                  subText={depositSuccessSubtext}
                  showRetryButton={true}
                  success={true}
                  buttonText={depositSuccessButtonText}
                  closeLoader={closeSyndicateActionLoader}
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
              ) : maxDepositReached && depositModes && !showSkeletonLoader ? (
                <SyndicateActionLoader
                  headerText={maxMemberDepositsTitleText}
                  subText={maxMemberDepositsText}
                  error={true}
                  showRetryButton={false}
                />
              ) : withdraw && +myDeposits === 0 && !showSkeletonLoader ? (
                <SyndicateActionLoader
                  headerText={nonMemberWithdrawalTitleText}
                  subText={nonMemberWithdrawalText}
                  error={true}
                  showRetryButton={false}
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
                    <p className="font-semibold text-xl p-2">
                      {depositModes
                        ? depositTitle
                        : withdraw
                        ? withdrawalTitleText
                        : null}
                    </p>
                  )}

                  <div className="px-2">
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
                      <p className="py-4 pt-2 text-green-screamin font-ibm">
                        {depositModes
                          ? depositApprovalText
                          : withdraw
                          ? totalDistributionsText
                          : null}
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
                            disabled={depositModes ? !myAddressAllowed : false}
                            defaultValue={amount}
                            onChange={handleSetAmount}
                            className={`rounded-md bg-gray-9 border border-gray-24 text-white font-whyte focus:outline-none focus:ring-gray-24 focus:border-gray-24 w-7/12 mr-2 `}
                          />
                          {withdraw ? (
                            <TokenSelect
                              setTotalTokenDistributions={
                                setTotalTokenDistributions
                              }
                            />
                          ) : (
                            <p className="pt-2 w-4/12">{currentERC20}</p>
                          )}
                        </div>
                        <p className="mr-2 w-full text-red-500 text-xs mt-2 mb-4">
                          {showValidationError ? errorMessageText : null}
                        </p>
                        {/* checkbox for user to confirm they are accredited investor if this is a deposit */}
                        {depositModes ? (
                          <p className="text-sm my-5 text-gray-dim">
                            {depositLPAccreditedText}
                          </p>
                        ) : null}
                        <div className="mb-2">{actionButton}</div>
                        <div className="flex justify-center">
                          <div className="w-2/3 text-sm my-5 text-gray-dim justify-self-center text-center">
                            {depositModes
                              ? depositDisclaimerText
                              : withdrawalDisclaimerText}
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
        {account ? (
          <DetailsCard
            {...{ title: "My Stats", sections, syndicate, loadingLPDetails }}
            customStyles={
              "sm:ml-6 p-4 mx-2 sm:px-8 sm:py-4 rounded-b-custom bg-gray-9 border border-gray-49"
            }
            customInnerWidth={"w-full"}
          />
        ) : null}

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
      {/* Error message modal */}
      <ErrorModal
        {...{
          show: showErrorMessage,
          setShowErrorMessage,
          setErrorMessage,
          errorMessage,
        }}
      ></ErrorModal>
    </ErrorBoundary>
  );
};

const mapStateToProps = ({
  web3Reducer,
  syndicateLPDetailsReducer,
  syndicateInstanceReducer: { syndicateContractInstance },
}) => {
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
    syndicateContractInstance,
  };
};

InvestInSyndicate.propTypes = {
  web3: PropTypes.any,
  dispatch: PropTypes.any,
  syndicate: PropTypes.object,
  syndicateContractInstance: PropTypes.object,
};

export default connect(mapStateToProps)(InvestInSyndicate);
