import { amplitudeLogger, Flow } from '@/components/amplitude';
import {
  CLUB_CREATION,
  DEPOSIT_TOKEN_AMOUNT_NEXT_CLICK,
  NAME_SYMBOL_NEXT_CLICK,
  REVIEW_CLICK
} from '@/components/amplitude/eventNames';
import { metamaskConstants } from '@/components/syndicates/shared/Constants';
import { getMetamaskError } from '@/helpers/metamaskError/index';
import useSubmitReqsToFactory from '@/hooks/clubs/useSubmitReqsToFactory';
import { AppState } from '@/state';
import {
  resetClubCreationReduxState,
  setClubCreationReceipt,
  setTransactionHash
} from '@/state/createInvestmentClub/slice';
import { TokenGateOption } from '@/state/createInvestmentClub/types';
import { useRouter } from 'next/router';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateActiveSteps, CreateSteps, investmentClubSteps } from './steps';

type CreateInvestmentClubProviderProps = {
  handleNext: () => void;
  handleBack: () => void;
  currentStep: number;
  stepsCategories: CreateActiveSteps[];
  stepsNames: CreateSteps[];
  isReviewStep: boolean;
  isFirstStep: boolean;
  editingStep: number;
  setEditingStep: Dispatch<SetStateAction<number>>;
  showNextButton: boolean;
  setShowNextButton: Dispatch<SetStateAction<boolean>>;
  backBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  handleCreateInvestmentClub: () => void;
  setNextBtnDisabled: Dispatch<SetStateAction<boolean>>;
  setBackBtnDisabled: Dispatch<SetStateAction<boolean>>;
  animationsRefs: Record<string, any>;
  waitingConfirmationModal: boolean;
  transactionModal: boolean;
  errorModal: boolean;
  warningModal: boolean;
  setShowModal: Dispatch<SetStateAction<Record<string, boolean>>>;
  processingModalTitle: string;
  processingModalDescription: string;
  errorModalMessage: string;
  resetCreationStates: () => void;
  setCurrentStep: (index: number) => void;
  isWalletConfirmed: boolean;
  setConfirmWallet: Dispatch<SetStateAction<boolean>>;
  setShowSaveButton: Dispatch<SetStateAction<boolean>>;
  showSaveButton: boolean;
  isCustomDate: boolean;
  setIsCustomDate: Dispatch<SetStateAction<boolean>>;
  handleGoToStep: (step: number) => void;

  // states to distinguish between Invesment Club and DAO
  isCreatingInvestmentClub: boolean;
  setIsCreatingInvestmentClub: Dispatch<SetStateAction<boolean>>;

  hasErrors: boolean;
};

const CreateInvestmentClubContext = createContext<
  Partial<CreateInvestmentClubProviderProps>
>({});

export const useCreateInvestmentClubContext =
  (): Partial<CreateInvestmentClubProviderProps> =>
    useContext(CreateInvestmentClubContext);

const CreateInvestmentClubProvider: React.FC = ({ children }) => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    },
    createInvestmentClubSliceReducer: {
      mintEndTime: { mintTime }
    },
    createInvestmentClubSliceReducer: {
      investmentClubName,
      investmentClubSymbol,
      membersCount,
      tokenDetails: { depositToken, depositTokenSymbol },
      tokenCap,
      tokenRules,
      tokenGateOption,
      logicalOperator
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
  const [editingStep, setEditingStep] = useState<number>(null);
  const [backBtnDisabled, setBackBtnDisabled] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);
  const [isWalletConfirmed, setConfirmWallet] = useState(false);

  const [processingModalTitle, setProcessingTitle] = useState('');
  const [processingModalDescription, setProcessingDescription] = useState('');
  const [errorModalMessage, setErrorModalMessage] = useState('');
  const [showSaveButton, setShowSaveButton] = useState(true);

  const [isCreatingInvestmentClub, setIsCreatingInvestmentClub] =
    useState(true);
  const [stepsCategories, setStepCategories] = useState<CreateActiveSteps[]>(
    []
  );
  const [stepsNames, setStepNames] = useState<CreateSteps[]>([]);
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [hasErrors, setHasErrors] = useState(true);

  const [
    { waitingConfirmationModal, transactionModal, errorModal, warningModal },
    setShowModal
  ] = useState({
    waitingConfirmationModal: false,
    transactionModal: false,
    errorModal: false,
    warningModal: false
  });

  const resetCreationStates = (): void => {
    dispatch(resetClubCreationReduxState());
    setCurrentStep(0);
    setShowModal(() => ({
      waitingConfirmationModal: false,
      transactionModal: false,
      errorModal: false,
      warningModal: false
    }));
  };

  const isReviewStep = currentStep === investmentClubSteps.length - 1;
  const isFirstStep = currentStep === 0;

  // @ts-expect-error TS(7030): Not all code paths return a value.
  useEffect(() => {
    if (!nextBtnDisabled) {
      document.addEventListener('keypress', keyPressEnter);
      return () => {
        document.removeEventListener('keypress', keyPressEnter);
      };
    }
  });

  // Check whether all fields have been filled in.
  useEffect(() => {
    if (
      investmentClubName &&
      investmentClubSymbol &&
      mintTime &&
      membersCount &&
      depositTokenSymbol &&
      tokenCap &&
      tokenRules
    ) {
      setHasErrors(false);
    } else {
      setHasErrors(true);
    }
    return () => {
      setHasErrors(true);
    };
  }, [
    investmentClubName,
    investmentClubSymbol,
    membersCount,
    depositToken,
    depositTokenSymbol,
    tokenCap,
    tokenRules,
    tokenGateOption,
    logicalOperator
  ]);

  useEffect(() => {
    setStepCategories(investmentClubSteps.map((step) => step.category));
    setStepNames(investmentClubSteps.map((s) => s.step));
  }, []);

  useEffect(() => {
    resetClubCreationReduxState();
    setCurrentStep(0);
  }, [activeNetwork]);

  const handleNext = (): void => {
    if (!editingStep) {
      switch (currentStep) {
        case 0:
          void amplitudeLogger(NAME_SYMBOL_NEXT_CLICK, {
            flow: Flow.CLUB_CREATE
          });
          break;
        case 1:
          void amplitudeLogger(DEPOSIT_TOKEN_AMOUNT_NEXT_CLICK, {
            flow: Flow.CLUB_CREATE
          });
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          if (tokenGateOption === TokenGateOption.UNRESTRICTED) {
            void amplitudeLogger(REVIEW_CLICK, {
              flow: Flow.CLUB_CREATE,
              token_gating: false
            });
          } else {
            void amplitudeLogger(REVIEW_CLICK, {
              flow: Flow.CLUB_CREATE,
              token_gating: true
            });
          }
          break;
        default:
      }
    }

    if (editingStep && mintTime !== 'Custom') {
      setShowNextButton(false);
    } else {
      setShowNextButton(true);
    }

    if (editingStep) {
    } else if (currentStep < investmentClubSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = (): void => {
    if (currentStep > 0) {
      setCurrentStep((currentStep) => currentStep - 1);
    }
  };

  const handleGoToStep = (step: number): void => {
    if (currentStep !== step) {
      setCurrentStep(step);
    }
  };

  const onTxConfirm = (transactionHash: string): void => {
    // Change modal title and description after confirming tx
    setProcessingTitle('Pending confirmation');
    setProcessingDescription(
      'This could take up to a few minutes depending on network congestion and the gas fees you set.'
    );
    dispatch(setTransactionHash(transactionHash));
  };

  const onTxReceipt = (receipt: any): void => {
    void amplitudeLogger(CLUB_CREATION, {
      flow: Flow.CLUB_CREATE,
      transaction_status: 'Success'
    });

    dispatch(
      setClubCreationReceipt(receipt.events.ERC20ClubCreated.returnValues)
    );
    dispatch(setTransactionHash(''));
    setShowModal(() => ({
      waitingConfirmationModal: false,
      transactionModal: true,
      errorModal: false,
      warningModal: false
    }));
    setConfirmWallet(false);
  };

  const onTxFail = (): void => {
    void amplitudeLogger(CLUB_CREATION, {
      flow: Flow.CLUB_CREATE,
      transaction_status: 'Failure'
    });
    setShowModal(() => ({
      waitingConfirmationModal: false,
      transactionModal: false,
      errorModal: true,
      warningModal: false
    }));
  };

  const { submitCreateClub } = useSubmitReqsToFactory(
    onTxConfirm,
    onTxReceipt,
    onTxFail
  );

  const handleCreateInvestmentClub = async (): Promise<void> => {
    try {
      setProcessingTitle('Confirm in wallet');
      setProcessingDescription(
        'Confirm the creation of this investment club in your wallet.'
      );
      setShowModal(() => ({
        waitingConfirmationModal: true,
        transactionModal: false,
        errorModal: false,
        warningModal: false
      }));
      return await submitCreateClub();
    } catch (error: any) {
      const { code } = error;
      if (code) {
        const errorMessage = getMetamaskError(code, 'Club creation');
        setErrorModalMessage(errorMessage);
      } else {
        // alert any other contract error
        setErrorModalMessage(metamaskConstants.metamaskUnknownErrorMessage);
      }
      setShowModal({
        waitingConfirmationModal: false,
        transactionModal: false,
        errorModal: false,
        warningModal: false
      });
    }
  };

  const keyPressEnter = (e: any): void => {
    // This should work only when in create IC(Investment club)
    if (!router.pathname.endsWith('clubprivatebetainvite')) return;

    // it triggers by pressing the enter key
    if ((nextBtnDisabled || showNextButton) && e.keyCode === 13) {
      if (isReviewStep) {
        void handleCreateInvestmentClub();
      } else {
        handleNext();
      }
    }
  };

  return (
    <CreateInvestmentClubContext.Provider
      value={{
        handleNext,
        handleBack,
        currentStep,
        stepsCategories,
        stepsNames,
        isReviewStep,
        isFirstStep,
        editingStep,
        setEditingStep,
        backBtnDisabled,
        handleCreateInvestmentClub,
        setBackBtnDisabled,
        setNextBtnDisabled,
        showNextButton,
        setShowNextButton,
        waitingConfirmationModal,
        transactionModal,
        errorModal,
        warningModal,
        // @ts-expect-error TS(2322): Type 'Dispatch<SetStateAction<{ waitingConfirmatio... Remove this comment to see the full error message
        setShowModal,
        processingModalTitle,
        processingModalDescription,
        errorModalMessage,
        resetCreationStates,
        setCurrentStep,
        isWalletConfirmed,
        setConfirmWallet,
        showSaveButton,
        setShowSaveButton,
        isCreatingInvestmentClub,
        setIsCreatingInvestmentClub,
        isCustomDate,
        setIsCustomDate,
        handleGoToStep,
        hasErrors
      }}
    >
      {children}
    </CreateInvestmentClubContext.Provider>
  );
};

export default CreateInvestmentClubProvider;
