import ErrorBoundary from "@/components/errorBoundary";
import { getTotalDistributions } from "@/helpers";
import { Validate } from "@/utils/validators";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";

// ABI
import syndicateABI from "src/contracts/Syndicate.json";
import {
  approveManager,
  increaseAllowance,
} from "src/helpers/approveAllowance";
import { setSyndicateDetails } from "src/redux/actions/syndicateDetails";
import { updateSyndicateLPDetails } from "src/redux/actions/syndicateLPDetails";
// actions
import { showWalletModal } from "@/redux/actions/web3Provider";
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
import { SyndicateActionButton } from "../shared/syndicateActionButton";
import { SyndicateActionLoader } from "../shared/syndicateActionLoader";
import { TokenMappings } from "src/utils/tokenMappings";
import { ErrorModal } from "src/components/shared/ErrorModal";
import { SkeletonLoader } from "src/components/skeletonLoader";

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
  // we'll start listening to events from here.
  const startBlock = process.env.NEXT_PUBLIC_FROM_BLOCK;

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [
    totalAvailableDistributions,
    setTotalAvailableDistributions,
  ] = useState<string>("0");

  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [depositAmountError, setDepositAmountError] = useState("");
  const [currentERC20, setCurrentERC20] = useState<string>("DAI");
  const [currentERC20Contract, setCurrentERC20Contract] = useState({
    methods: {
      allowance: (address: string, syndicateAddress: string) => {
        return {
          call: ({ from: any }) => {
            return 0;
          },
        };
      },
    },
  });
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

  // convert deposit and allowance values to floats for more accurate calculations.
  const amountToDeposit = parseFloat(depositAmount.toString());
  const allowanceAmountApproved = parseFloat(approvedAllowanceAmount);

  // if there is a change in the deposit amount
  // an updated allowance amount has to be calculated
  // set new allowanceAmount to be used when increasing LP allowance.
  let newAllowanceAmount = 0;
  const allowanceDifference = amountToDeposit - allowanceAmountApproved;
  if (allowanceDifference > 0) {
    newAllowanceAmount = allowanceDifference;
  }

  const {
    myDeposits,
    myPercentageOfThisSyndicate,
    withdrawalsToDepositPercentage,
    myWithdrawalsToDate,
    myDistributionsToDate,
  } = syndicateLPDetails;

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
    loaderWithdrawalHeaderText,
    loaderDepositHeaderText,
    loaderApprovalHeaderText,
    increaseDepositAllowanceErrorMessage,
    loaderGeneralHeaderText,
    amountConversionErrorText,
    actionFailedError,
    depositStatusAllowApprovedText,
    depositsUnavailableText,
    depositsUnavailableTitleText,
    connectWalletMessageTitle,
    connectWalletMessage,
    connectWalletWithdrawMessage,
    connectWalletDepositMessage,
  } = constants;

  // get the state of the current syndicate action
  // This is used to show withdrawal or deposit components.
  const { withdraw, deposit, generalView } = syndicateAction;

  const WithdrawalSections = [
    {
      header: "My Distributions to Date",
      subText: `${myDistributionsToDate} ${currentERC20}`,
      toolTip: myDistributionsToDateToolTip,
      screen: "withdrawal",
    },
    {
      header: "My Withdraws to Date",
      subText: `${myWithdrawalsToDate} ${currentERC20}`,
      toolTip: myWithDrawalsToDateTooltip,
      screen: "withdrawal",
    },
    {
      header: "Total Withdraws / Deposits",
      subText: `${withdrawalsToDepositPercentage}%`,
      toolTip: withdrawalsToDepositPercentageToolTip,
      screen: "withdrawal",
    },
  ];

  const depositSections = [
    {
      header: "My Deposits",
      subText: `${myDeposits} ${currentERC20} ($${floatedNumberWithCommas(
        myDeposits
      )})`,
      toolTip: myDepositsToolTip,
      screen: "deposit",
    },
    {
      header: "My % of This Syndicate",
      subText: `${myPercentageOfThisSyndicate}%`,
      toolTip: myPercentageOfThisSyndicateToolTip,
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

  // set token symbol based on deposit token address
  // we'll manually map the token symbol for now.
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
    }
  }, [syndicate]);
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

      // if the syndicate is closed, deposits are not available.
      // This check is important should a member try to access the deposit/details page of a closed syndicate.
      if (!syndicateOpen) {
        setDepositsAvailable(false);
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
          // update state after an invest event has been triggered.
          // once an LP makes a deposit, a new allowance has to be set
          // for them to be able to make another deposit.
          // to avoid too many unneccessary re-renders, we'll check if a
          // value is true before unsetting it.
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
          // reset loading state if the deposit loading state is true
          if (setSubmitting) {
            setSubmitting(false);
          }
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

      // reset approved allowance states
      // so the LP can set new allowances before investing again
      setLPCanDeposit(false);
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
          syndicate,
          syndicateAddress
        )
      );

      // TODO: Add success message on the UI.
    } catch (error) {
      console.log({ error });
      // TODO: Add error message on the UI.
    }
  };

  // consolidate all deposit modes
  // the 'view' (generalView state) and 'deposit more' (deposit state) buttons
  // will load deposit components.
  const depositModes = deposit || generalView;

  // handle approval of allowances by an LP
  // before a deposit can be made
  const handleAllowanceApproval = async (event: any) => {
    event.preventDefault();
    setSubmittingAllowanceApproval(true);

    let approvedAllowance = 0;
    let increasedAllowance = 0;

    if (approved && !lpCanDeposit) {
      increasedAllowance = await increaseAllowance(
        currentERC20Contract,
        account,
        syndicateInstance.address,
        newAllowanceAmount
      );
      try {
        // get total LP allowance after increasing it.
        const lpApprovedAllowance = web3.utils.fromWei(
          increasedAllowance.toString()
        );
        setApprovedAllowanceAmount(`${lpApprovedAllowance}`);
        setAllowanceApprovalError("");
        setApproved(true);
        setLPCanDeposit(true);
      } catch (error) {
        setConversionError(amountConversionErrorText);
      }
    } else if (!approved && !lpCanDeposit) {
      approvedAllowance = await approveManager(
        currentERC20Contract,
        account,
        syndicateInstance.address,
        depositAmount
      );

      try {
        // get total approved allowance for the LP.
        const lpApprovedAllowance = web3.utils.fromWei(
          approvedAllowance.toString()
        );
        setApprovedAllowanceAmount(`${lpApprovedAllowance}`);
        setAllowanceApprovalError("");
        setApproved(true);
        setLPCanDeposit(true);
      } catch (error) {
        setConversionError(amountConversionErrorText);
      }

      if (approvedAllowance === 0) {
        return;
      }
    }
    setSubmittingAllowanceApproval(false);
  };

  // handle deposit/withdrawal form submit.
  const onSubmit = async (event: any) => {
    event.preventDefault();
    if (!syndicateInstance) {
      // user needs to connect wallet first
      return dispatch(showWalletModal());
    }

    if (depositModes && !lpCanDeposit) {
      // set LP allowance first before making a deposit.
      handleAllowanceApproval(event);
    } else {
      setSubmitting(true);
      setSubmittingWithdrawal(true);
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
  )} ${currentERC20} ($${floatedNumberWithCommas(
    totalAvailableDistributions
  )}) distributions available.`;

  // if the depositAmount changes, new allowance has to be set
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
  }, [depositAmount]);

  // when the connected account is changed, we need to check for new allowances.
  // This check also needs to be done after a deposit has been made
  // as the allowance will be reset
  const checkLPAllowanceAmount = async () => {
    if (currentERC20Contract.methods && syndicateInstance) {
      /**
       * Check the approval amount
       *  @returns wei allowance as a string
       * */
      const lpAllowanceAmount = await currentERC20Contract.methods
        .allowance(account.toString(), syndicateInstance.address)
        .call({ from: account });

      try {
        const currentLPAllowanceAmount = web3.utils.fromWei(
          lpAllowanceAmount.toString()
        );

        if (parseInt(currentLPAllowanceAmount) > 0) {
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
    syndicateInstance,
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
      depositApprovalText = depositStatusAllowApprovedText;
    } else if (allowlistEnabled && !myAddressAllowed) {
      depositApprovalText = depositStatusNotApprovedText;
      disableAmountInput = true;
    } else if (!allowlistEnabled) {
      depositApprovalText = depositStatusApprovedText;
    }
  }

  // if the current deposit amount exceeds the already approved amount
  // the approval button should be disabled
  // if the LP is not allowed to deposit, this button will also be disabled.
  let disableApprovalButton = false;
  if (
    (amountToDeposit <= allowanceAmountApproved && approved) ||
    disableAmountInput ||
    (amountToDeposit <= 0 && !approved)
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
    disableAmountInput
  ) {
    disableDepositButton = true;
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
  }

  // text to show on approval button
  let approvalButtonText = "Approved";
  if (depositAmountGreater || allowanceAmountApproved == 0) {
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
          amountError={Boolean(depositAmountError)}
          buttonText={`${approvalButtonText} ${amountToApprove} ${currentERC20}`}
          disableApprovalButton={disableApprovalButton}
          action="approval"
          approved={approved}
          depositAmountChanged={depositAmountChanged}
        />
      </div>
      <div className="mb-4">
        <SyndicateActionButton
          amountError={Boolean(depositAmountError)}
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
          amountError={Boolean(depositAmountError)}
          buttonText="Continue"
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

  // show error message depending on what triggered it
  let errorMessageText = depositAmountError;
  if (allowanceApprovalError) {
    errorMessageText = allowanceApprovalError;
  } else if (conversionError) {
    errorMessageText = conversionError;
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
  const UnavailableState = ({ title, message }) => {
    return (
      <div>
        <p className="font-semibold text-xl p-2">{title}</p>
        <p className="p-4 pl-6 text-gray-dim text-sm">{message}</p>
      </div>
    );
  };

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
          ) : !depositsAvailable && depositModes ? (
            <UnavailableState
              title={depositsUnavailableTitleText}
              message={depositsUnavailableText}
            />
          ) : depositsAndWithdrawalsAvailable ? (
            <>
              {submittingAllowanceApproval || submitting ? (
                <SyndicateActionLoader
                  contractAddress={
                    submittingAllowanceApproval
                      ? syndicate?.depositERC20ContractAddress
                      : syndicateAddress
                  }
                  headerText={loaderHeaderText}
                />
              ) : (
                <>
                  <p className="font-semibold text-xl p-2">
                    {deposit
                      ? depositMoreTitleText
                      : generalView
                      ? depositTitleText
                      : withdraw
                      ? withdrawalTitleText
                      : null}
                  </p>

                  <div className="px-2">
                    {/* show this text if whitelist is enabled for deposits */}
                    <p className="py-4 pt-2 text-green-screamin font-ibm">
                      {depositModes
                        ? depositApprovalText
                        : withdraw
                        ? totalDistributionsText
                        : null}
                    </p>

                    {!syndicate ? (
                      <div className="flex justify-between my-1">
                        <SkeletonLoader width="full" height="10" />
                      </div>
                    ) : (
                      <form onSubmit={onSubmit}>
                        <div className="flex justify-between my-1">
                          <input
                            name="depositAmount"
                            type="text"
                            placeholder="400"
                            disabled={disableAmountInput}
                            defaultValue={depositAmount}
                            onChange={handleSetAmount}
                            className={`rounded-md bg-gray-9 border border-gray-24 text-white focus:outline-none focus:ring-gray-24 focus:border-gray-24 font-ibm w-7/12 mr-2 ${
                              withdraw ? "mb-5" : "mb-0"
                            }`}
                          />
                          {withdraw ? (
                            <TokenSelect />
                          ) : (
                            <p className="pt-2 w-4/12">{currentERC20}</p>
                          )}
                        </div>

                        {depositAmountError ||
                        allowanceApprovalError ||
                        conversionError ? (
                          <p className="mr-2 w-full text-red-500 text-xs mt-2 mb-4">
                            {errorMessageText}
                          </p>
                        ) : null}
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
            {...{ title: "My Stats", sections, syndicate }}
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
