import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { constants, metamaskConstants, walletConfirmConstants } from "../shared/Constants";


interface ILoaderProp {
  // the contract address the etherscan link should point to
  contractAddress?: string | string[];
  headerText: string;
  subText?: string;
  showRetryButton?: boolean;
  error?: boolean;
  closeLoader?: Function;
  buttonText?: string;
  success?: boolean;
  pending?: boolean;
  retryButtonClasses?: string;
}

const {
  depositSuccessTitleText,
  depositSuccessSubtext,
  depositSuccessButtonText,
  dismissButtonText,
  loaderApprovalHeaderText,
  loaderDepositHeaderText,
  loaderWithdrawalHeaderText,
  loaderGeneralHeaderText,
  maxMemberDepositsText,
  maxMemberDepositsTitleText,
  nonMemberWithdrawalText,
  nonMemberWithdrawalTitleText,
} = constants;

const { metamaskErrorMessageTitleText } = metamaskConstants;

// texts for metamask confirmation pending
const {
  walletPendingConfirmPendingTitleText,
  walletPendingConfirmPendingMessage,
} = walletConfirmConstants;


export const useSyndicateActionLoader = () => {
  const router = useRouter();

  const defaultProps = { headerText: loaderGeneralHeaderText }
  const [actionLoaderProps, setActionLoaderProps] = useState<ILoaderProp>(defaultProps);
  const [renderActionLoaders, setRenderActionLoaders] = useState<boolean>(true);

  const [submittingAllowanceApproval, setSubmittingAllowanceApproval] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [metamaskApprovalError, setMetamaskApprovalError] = useState<string>("");
  const [metamaskDepositError, setMetamaskDepositError] = useState<string>("");
  const [metamaskConfirmPending, setMetamaskConfirmPending] = useState<boolean>(false);
  const [successfulDeposit, setSuccessfulDeposit] = useState<boolean>(false);
  const [metamaskWithdrawError, setMetamaskWithdrawError] = useState<string>("");

  const {
    syndicatesReducer: { syndicate },
    syndicateLPDetailsReducer: { syndicateLPDetails },
    web3Reducer: {
      syndicateAction,
    },
  } = useSelector((state: RootState) => state);

  const { deposit, generalView } = syndicateAction;
  const { maxDepositReached } = syndicateLPDetails;
  const depositModes = deposit || generalView;

  useEffect(() => {
    const { syndicateAddress } = router.query;

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
    let metamaskErrorMessageText = metamaskApprovalError;
    if (metamaskDepositError) {
      metamaskErrorMessageText = metamaskDepositError;
    } else if (metamaskWithdrawError) {
      metamaskErrorMessageText = metamaskWithdrawError;
    }

    if (submittingAllowanceApproval || submitting) {
      setActionLoaderProps({
        headerText: loaderHeaderText,
        contractAddress: submittingAllowanceApproval ? syndicate?.depositERC20ContractAddress : syndicateAddress,
      })
    } else if (metamaskApprovalError || metamaskDepositError || metamaskWithdrawError) {
      setActionLoaderProps({
        contractAddress: metamaskApprovalError || metamaskDepositError ? syndicate?.depositERC20ContractAddress : syndicateAddress,
        headerText: metamaskErrorMessageTitleText,
        subText: metamaskErrorMessageText,
        error: true,
        showRetryButton: true,
        buttonText: dismissButtonText,
        closeLoader: closeSyndicateActionLoader
      })
    } else if (metamaskConfirmPending) {
      setActionLoaderProps({
        headerText: walletPendingConfirmPendingTitleText,
        subText: walletPendingConfirmPendingMessage,
        pending: true,
      })
    } else if (successfulDeposit && depositModes) {
      setActionLoaderProps({
        contractAddress: syndicateAddress,
        headerText: depositSuccessTitleText,
        subText: depositSuccessSubtext,
        showRetryButton: true,
        success: true,
        buttonText: depositSuccessButtonText,
        closeLoader: closeSyndicateActionLoader,
      })
    } else if (maxDepositReached && maxDepositReached) {
      setActionLoaderProps({
        headerText: maxMemberDepositsTitleText,
        subText: maxMemberDepositsText,
        error: true,
        showRetryButton: false,
      })
    } else {
      setRenderActionLoaders(false)
    }
  }, [])

  // close the syndicate action loader
  const closeSyndicateActionLoader = () => {
    setSubmittingAllowanceApproval(false);
    setMetamaskApprovalError("");
    setMetamaskDepositError("");
    setMetamaskWithdrawError("");
    setSubmitting(false);
    setSuccessfulDeposit(false);
    setMetamaskConfirmPending(false);
  };

  return { renderActionLoaders, actionLoaderProps }
}
