import { amplitudeLogger, Flow } from "@/components/amplitude";
import {
  CREATE_SYNDICATE,
  ERROR_CREATING_SYNDICATE,
} from "@/components/amplitude/eventNames";
import { MAX_INTEGER } from "@/components/syndicates/shared/Constants";
import { metamaskConstants } from "src/components/syndicates/shared/Constants";
import { getMetamaskError } from "@/helpers";
import { setSubmitting } from "@/redux/actions";
import { resetCreateSyndicateReduxStore } from "@/redux/actions/createSyndicate";
import { RootState } from "@/redux/store";
import { getWeiAmount } from "@/utils/conversions";
import { convertTime12to24, getUnixTimeFromDate } from "@/utils/dateUtils";
import React, {
  Dispatch,
  createContext,
  useContext,
  ReactNode,
  useState,
  SetStateAction,
  useEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import steps, { templateSteps } from "./steps";

interface ProcessingInfo {
  transactionsCount: number;
  currentTransaction: number;
  processingMessage: string;
  showErrorMessage: boolean;
  errorMessage: string;
  processingTitle: string;
  currentTxHash: string;
  setShowErrorMessage: Dispatch<SetStateAction<boolean>>;
}

type CreateSyndicateProviderProps = {
  currentStep: number;
  currentSubStep: number;
  handleNext: () => void;
  handleBack: () => void;
  steps: any[];
  buttonsDisabled: boolean;
  handleCreateSyndicate: (event: any) => void;
  handleAddToAllowlist: (event: any) => void;
  showWalletConfirmationText: boolean;
  showErrorMessage: boolean;
  errorMessage: string;
  showSuccessView: boolean;
  setButtonsDisabled: Dispatch<SetStateAction<boolean>>;
  setCurrentSubStep: Dispatch<SetStateAction<number>>;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  processingInfo: ProcessingInfo;
  continueDisabled: boolean;
  setContinueDisabled: Dispatch<SetStateAction<boolean>>;
  resetCreateSyndicateStore: () => void;

  // template stuff
  templateSteps: any[];
  currentTemplateStep: number;
  currentTemplateSubstep: number[];
  legalEntity: boolean;
  templateMaxTotalError: string;
  currentTemplate: any;
  handleTemplateNext: () => void;
  handleTemplateBack: () => void;
  handleTemplateSubstepNext: (step: number, substep: number) => void;
  resetTemplateSubsteps: () => void;
  setCurrentTemplateStep: Dispatch<SetStateAction<number>>;
  setCurrentTemplateSubstep: Dispatch<SetStateAction<number[]>>;
  setLegalEntity: Dispatch<SetStateAction<boolean>>;
  setTemplateMaxTotalError: Dispatch<SetStateAction<string>>;
  setCurrentTemplate: Dispatch<SetStateAction<any>>;
};

const CreateSyndicateContext = createContext<
  Partial<CreateSyndicateProviderProps>
>({});

export const useCreateSyndicateContext =
  (): Partial<CreateSyndicateProviderProps> =>
    useContext(CreateSyndicateContext);

const CreateSyndicateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [continueDisabled, setContinueDisabled] = useState(false);
  const [showWalletConfirmationText, setShowWalletConfirmationText] =
    useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showSuccessView, setShowSuccessView] = useState(false);
  const [transactionsCount, setTransactionsCount] = useState(1);
  const [currentTransaction, setCurrentTransaction] = useState(1);
  const [processingMessage, setProcessingMessage] = useState("");
  const [processingTitle, setProcessingTitle] = useState("");
  const [currentTxHash, setCurrentTxHash] = useState("");

  const dispatch = useDispatch();

  // syndicate template states
  const [currentTemplateStep, setCurrentTemplateStep] = useState<number>(0);
  const [currentTemplateSubstep, setCurrentTemplateSubstep] = useState<
    number[]
  >([]);
  const [legalEntity, setLegalEntity] = useState<boolean>(false);
  const [templateMaxTotalError, setTemplateMaxTotalError] =
    useState<string>("");
  const [currentTemplate, setCurrentTemplate] = useState([]);

  /**
   * Get create syndicate data from the store
   */
  const {
    initializeContractsReducer: {
      syndicateContracts: { ManagerLogicContract },
    },
    initializeContractsReducer: { syndicateContracts },
    web3Reducer: { web3: web3Instance },
    syndicateOffChainDataReducer: {
      createSyndicate: {
        syndicateOffChainData: {
          type,
          syndicateName,
          email,
          country,
          organization,
        },
      },
    },
    tokenAndDepositLimitReducer: {
      createSyndicate: {
        tokenAndDepositsLimits: {
          depositTotalMax,
          numMembersMax,
          depositMemberMin,
          depositMemberMax,
          depositTokenDetails: { depositTokenAddress, depositTokenDecimals },
        },
      },
    },
    feesAndDistributionReducer: {
      createSyndicate: {
        feesAndDistribution: {
          expectedAnnualOperatingFees,
          profitShareToSyndicateLead,
          syndicateProfitSharePercent,
        },
      },
    },
    allowlistReducer: {
      createSyndicate: {
        allowlist: { isAllowlistEnabled, memberAddresses },
      },
    },
    modifiableReducer: {
      createSyndicate: { modifiable },
    },
    transferableReducer: {
      createSyndicate: { transferable },
    },
    closeDateAndTimeReducer: {
      createSyndicate: {
        closeDateAndTime: { selectedDate, selectedTimeValue, selectedTimezone },
      },
    },
  } = useSelector((state: RootState) => state);

  const { account } = web3Instance;

  const resetCreateSyndicateStore = () => {
    dispatch(resetCreateSyndicateReduxStore());
    setCurrentStep(0);
    setCurrentSubStep(0);
    setButtonsDisabled(false);
    setShowWalletConfirmationText(false);
    setShowErrorMessage(false);
    setErrorMessage("");
    setShowSuccessView(false);
    setTransactionsCount(1);
    setCurrentTransaction(1);
    setProcessingMessage("");

    // template resets
    setCurrentTemplateStep(0);
    resetTemplateSubsteps();
  };

  useEffect(() => {
    // checks if the allowlist is enabled to allow two transactions
    if (
      isAllowlistEnabled &&
      memberAddresses.length > 0 &&
      memberAddresses?.some((val) => Boolean(val))
    ) {
      setTransactionsCount(2);
    } else {
      setTransactionsCount(1);
    }
  }, [isAllowlistEnabled, memberAddresses, transactionsCount]);

  const handleAddToAllowlist = async (event) => {
    event.preventDefault();
    dispatch(setSubmitting(true));
    try {
      // create new copy of split array
      // convert comma separated string into array
      const splitArr = memberAddresses;
      // get last element in array
      const lastElement = splitArr[splitArr.length - 1];
      // create new copy of split array
      const newSplitArr = [...splitArr];
      // check if empty string
      if (!lastElement) {
        newSplitArr.pop();
      }
      // perform validations outside the class functions
      if (!account.trim() || !newSplitArr.length) {
        return;
      }
      setCurrentTransaction(2);
      setCurrentTxHash("");
      setProcessingTitle("Waiting for confirmation");
      setProcessingMessage(
        "Please confirm the second transaction in your wallet. This adds members to your allowlist.",
      );
      await syndicateContracts.AllowlistLogicContract.managerAllowAddresses(
        account,
        newSplitArr,
        account,
        (transactionHash: string) => {
          setCurrentTxHash(transactionHash);
          setProcessingTitle("Processing");
          setProcessingMessage(
            "Adding addresses to allowlist, please wait for the transaction to complete",
          );
          dispatch(setSubmitting(true));
        },
      );
      setShowErrorMessage(false);
      setShowSuccessView(true);
      dispatch(setSubmitting(false));
    } catch (error) {
      const { code } = error;
      if (code) {
        const errorMessage = getMetamaskError(code, "Member deposit modified.");
        setErrorMessage(errorMessage);
        setShowErrorMessage(true);
        dispatch(setSubmitting(false));
      } else {
        // alert any other contract error
        setErrorMessage(metamaskConstants.metamaskUnknownErrorMessage);
        setShowErrorMessage(true);
        dispatch(setSubmitting(false));
      }
    }
  };

  /**
   * This method implements the manager steps to create a syndicate
   * @param event
   */
  const handleCreateSyndicate = async (event) => {
    event.preventDefault();
    // Go to processing

    setProcessingTitle("Waiting for confirmation");
    setProcessingMessage("Authorize allocation with wallet extension");
    handleNext();

    // template next page
    handleTemplateNext();
    // template reset substeps
    resetTemplateSubsteps();

    // get syndicateProtocolProfitSharePercent
    const syndicateProtocolProfitSharePercent = syndicateProfitSharePercent;

    /**
     * Convert maxDeposits, totalMaxDeposits and syndicateProfitSharePercent
     * to wei since the contract does not take normal javascript numbers
     */
    const syndicateDistributionShareBasisPoints = `${
      parseFloat(String(syndicateProtocolProfitSharePercent)) * 100
    }`;

    /// 2% management fee (200 basis points).
    /// This is displayed in the UI as "Expected Annual Operating Fees"
    /// on the Create Syndicate page.
    // SO to get the correct value from the UI, we take the % passed
    // and multiply by 100 eg 2% would be (2/100)* 10000=> 2 * 100 = 200 basis points

    // use the user provided values, otherwise use defaults for min and max fields.
    const formattedDepositMemberMin = depositMemberMin
      ? getWeiAmount(depositMemberMin, depositTokenDecimals, true)
      : getWeiAmount("0", depositTokenDecimals, true);

    const formattedDepositMemberMax = depositMemberMax
      ? getWeiAmount(depositMemberMax, depositTokenDecimals, true)
      : MAX_INTEGER;

    const formattedNumMembersMax = numMembersMax
      ? numMembersMax.toString()
      : MAX_INTEGER;

    const formattedDepositTotalMax = depositTotalMax
      ? getWeiAmount(depositTotalMax, depositTokenDecimals, true)
      : MAX_INTEGER;

    const formattedManagerManagementFeeBasisPoints = `${
      parseFloat(String(expectedAnnualOperatingFees)) * 100
    }`;

    const formattedManagerDistributionShareBasisPoints = `${
      parseFloat(String(profitShareToSyndicateLead)) * 100
    }`;

    const isoDateString = `${
      new Date(selectedDate).toISOString().split("T")[0]
    }T${convertTime12to24(selectedTimeValue)}:00${selectedTimezone.timezone}`;
    const formattedCloseDate = getUnixTimeFromDate(new Date(isoDateString));

    // submit offchain data
    const encode = (data) => {
      return Object.keys(data)
        .map(
          (key) =>
            encodeURIComponent(key) + "=" + encodeURIComponent(data[key]),
        )
        .join("&");
    };

    // off-chain data should be submitted if its provided.
    if (syndicateName || email) {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "offChainData",
          name: syndicateName,
          email,
          syndicateAddress: account,
          country,
          organization,
          type,
        }),
      });
    }

    // The name of CreateSyndicate function and order of function parameters
    // has changed in the recent version so we need to find the correct function
    // to call based on the contract version

    try {
      setButtonsDisabled(true);
      const syndicateData = {
        managerManagementFeeBasisPoints:
          formattedManagerManagementFeeBasisPoints,
        managerDistributionShareBasisPoints:
          formattedManagerDistributionShareBasisPoints,
        syndicateDistributionShareBasisPoints,
        numMembersMax: formattedNumMembersMax,
        depositERC20Address: depositTokenAddress,
        depositMemberMin: formattedDepositMemberMin,
        depositMemberMax: formattedDepositMemberMax,
        depositTotalMax: formattedDepositTotalMax,
        dateCloseUnixTime: formattedCloseDate,
        allowlistEnabled: isAllowlistEnabled,
        modifiable,
        transferable,
      };
      await ManagerLogicContract.createSyndicate(
        syndicateData,
        account,
        (transactionHash: string) => {
          setCurrentTxHash(transactionHash);
          setProcessingTitle("Processing");
          setProcessingMessage(
            "Creating your syndicate, please wait for the transaction to complete",
          );
          dispatch(setSubmitting(true));
        },
      );
      // if there are multiple transaction, handle the
      if (transactionsCount === 1) {
        setShowErrorMessage(false);
        setShowSuccessView(true);
        dispatch(setSubmitting(false));
        // Amplitude logger: How many users started filling out the form to create a Syndicate
        amplitudeLogger(CREATE_SYNDICATE, {
          flow: Flow.MGR_CREATE_SYN,
        });
      } else if (transactionsCount === 2) {
        setProcessingTitle("Transaction 1 completed");
        setCurrentTransaction(2);
      }
    } catch (error) {
      setCurrentTxHash("");
      setButtonsDisabled(false);
      setShowWalletConfirmationText(false);
      if (error.code) {
        const { code } = error;
        const errorMessage = getMetamaskError(code, "Create Syndicate");
        setErrorMessage(errorMessage);
        setShowErrorMessage(true);
        dispatch(setSubmitting(false));
        // Amplitude logger: Error creating a Syndicate
        amplitudeLogger(ERROR_CREATING_SYNDICATE, {
          flow: Flow.MGR_CREATE_SYN,
          error,
        });
      } else {
        // alert any other contract error
        setErrorMessage(metamaskConstants.metamaskUnknownErrorMessage);
        setShowErrorMessage(true);
        dispatch(setSubmitting(false));
      }
    }
  };

  const handleNext = () => {
    const subSteps = steps?.[currentStep]?.subSteps;
    if (currentStep === steps?.length - 1) {
      return;
    }
    if (currentSubStep === subSteps?.length - 1 || !subSteps) {
      // move to the next step
      setCurrentStep((prev) => prev + 1);
      setCurrentSubStep(0);
    } else {
      // move to the next
      setCurrentSubStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    // Reset Errors on going back
    if (showErrorMessage) {
      setShowErrorMessage(false);
      setErrorMessage("");
    }
    // Handle navigation logic
    if (currentStep === 1 && currentSubStep === 0) {
      setCurrentStep(0);
      const firstSubSteps = steps?.[0]?.subSteps;
      setCurrentSubStep(firstSubSteps?.length - 1);
    } else if (currentStep === 0) {
      if (currentSubStep !== 0) {
        setCurrentSubStep((prev) => prev - 1);
      } else if (currentSubStep === 0) {
        setCurrentSubStep(0);
      }
    } else {
      if (currentSubStep !== 0) {
        setCurrentSubStep((prev) => prev - 1);
      } else {
        setCurrentStep((prev) => prev - 1);
        setCurrentSubStep(steps?.[currentStep - 1]?.subSteps?.length - 1 || 0);
      }
    }
    // Allow continue button if gone back to allow continue to next step
    if (continueDisabled) {
      setContinueDisabled(false);
    }
  };

  // handle next when templates are in use
  const handleTemplateNext = () => {
    setCurrentTemplateStep((prev) => prev + 1);
  };

  // handle template substep next
  const handleTemplateSubstepNext = (step: number, substep: number) => {
    setCurrentTemplateSubstep([step, substep]);
  };

  // handle back when templates are in use
  const handleTemplateBack = () => {
    if (currentTemplateStep === 0) {
      resetCreateSyndicateStore();
    } else if (currentTemplateStep > 0) {
      // clear error if one exists
      if (showErrorMessage) {
        setShowErrorMessage(false);
        setErrorMessage("");
      }
      setCurrentTemplateStep((prev) => prev - 1);
      resetTemplateSubsteps();
    }
  };

  // handle resetting template substeps
  const resetTemplateSubsteps = () => {
    setCurrentTemplateSubstep([]);
  };
  return (
    <CreateSyndicateContext.Provider
      value={{
        handleBack,
        handleNext,
        currentStep,
        currentSubStep,
        steps,
        buttonsDisabled,
        handleCreateSyndicate,
        handleAddToAllowlist,
        showWalletConfirmationText,
        showErrorMessage,
        errorMessage,
        showSuccessView,
        setButtonsDisabled,
        setCurrentSubStep,
        setCurrentStep,
        processingInfo: {
          transactionsCount,
          currentTransaction,
          processingMessage,
          showErrorMessage,
          errorMessage,
          currentTxHash,
          processingTitle,
          setShowErrorMessage,
        },
        continueDisabled,
        setContinueDisabled,
        resetCreateSyndicateStore,

        //template stuff
        templateSteps,
        currentTemplateStep,
        currentTemplateSubstep,
        legalEntity,
        templateMaxTotalError,
        currentTemplate,
        handleTemplateNext,
        handleTemplateBack,
        handleTemplateSubstepNext,
        resetTemplateSubsteps,
        setCurrentTemplateStep,
        setLegalEntity,
        setCurrentTemplateSubstep,
        setTemplateMaxTotalError,
        setCurrentTemplate,
      }}
    >
      {children}
    </CreateSyndicateContext.Provider>
  );
};

export default CreateSyndicateProvider;
