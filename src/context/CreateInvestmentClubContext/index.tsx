import { amplitudeLogger, Flow } from '@/components/amplitude';
import {
  CLUB_CREATION,
  CREATE_ON_CHAIN_CLUB_CLICK,
  DEPOSIT_TOKEN_AMOUNT_NEXT_CLICK,
  NAME_SYMBOL_NEXT_CLICK,
  REVIEW_CLICK
} from '@/components/amplitude/eventNames';
import { metamaskConstants } from '@/components/syndicates/shared/Constants';
import { getMetamaskError } from '@/helpers';
import useSubmitReqsToFactory from '@/hooks/clubs/useSubmitReqsToFactory';
import { useLocalStorage } from '@/hooks/utils/useLocalStorage';
import { AppState } from '@/state';
import {
  resetClubCreationReduxState,
  setClubCreationReceipt,
  setTransactionHash
} from '@/state/createInvestmentClub/slice';
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
import {
  CategorySteps,
  CreateActiveSteps,
  CreateSteps,
  investmentClubSteps
} from './steps';

type CreateInvestmentClubProviderProps = {
  handleNext: () => void;
  handleBack: () => void;
  currentStep: number;
  steps: CategorySteps[];
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

  // states to distinguish between Invesment Club and DAO
  isCreatingInvestmentClub: boolean;
  setIsCreatingInvestmentClub: Dispatch<SetStateAction<boolean>>;
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
      web3: { activeNetwork, account }
    },
    createInvestmentClubSliceReducer: {
      mintEndTime: { mintTime },
      tokenDetails: { depositTokenSymbol, depositTokenLogo }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
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

  const [
    { waitingConfirmationModal, transactionModal, errorModal, warningModal },
    setShowModal
  ] = useState({
    waitingConfirmationModal: false,
    transactionModal: false,
    errorModal: false,
    warningModal: false
  });

  const resetCreationStates = () => {
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

  useEffect(() => {
    if (!nextBtnDisabled) {
      document.addEventListener('keypress', keyPressEnter);
      return () => {
        document.removeEventListener('keypress', keyPressEnter);
      };
    }
  });

  useEffect(() => {
    setStepCategories(investmentClubSteps.map((step) => step.category));
    setStepNames(investmentClubSteps.map((s) => s.step));
  }, []);

  useEffect(() => {
    resetClubCreationReduxState();
    setCurrentStep(0);
  }, [activeNetwork]);

  const handleNext = () => {
    if (!editingStep) {
      switch (currentStep) {
        case 0:
          amplitudeLogger(CREATE_ON_CHAIN_CLUB_CLICK, {
            flow: Flow.CLUB_CREATE
          });
          break;
        case 1:
          amplitudeLogger(NAME_SYMBOL_NEXT_CLICK, {
            flow: Flow.CLUB_CREATE
          });
          break;
        case 2:
          amplitudeLogger(DEPOSIT_TOKEN_AMOUNT_NEXT_CLICK, {
            flow: Flow.CLUB_CREATE
          });
          break;
        case 3:
          break;
        case 4:
          break;
        case 5:
          amplitudeLogger(REVIEW_CLICK, {
            flow: Flow.CLUB_CREATE
          });
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
      setCurrentStep(editingStep);
      setEditingStep(null);
      setShowNextButton(true);
    } else if (currentStep < investmentClubSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setShowNextButton(true);

    if (currentStep > 1) {
      setNextBtnDisabled(false);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onTxConfirm = (transactionHash: string) => {
    // Change modal title and description after confirming tx
    setProcessingTitle('Pending confirmation');
    setProcessingDescription(
      'This could take up to a few minutes depending on network congestion and the gas fees you set.'
    );
    dispatch(setTransactionHash(transactionHash));
  };

  const [, saveNewClub] = useLocalStorage('newlyCreatedClub');
  const onTxReceipt = (receipt) => {
    const {
      tokenAddress,
      name,
      symbol,
      depositToken,
      endTime,
      startTime,
      tokenCap
    } = receipt.events.ERC20ClubCreated.returnValues;

    // save to local storage
    saveNewClub({
      tokenAddress,
      name,
      symbol,
      account,
      depositToken,
      endTime,
      startTime,
      tokenCap,
      activeNetwork,
      depositTokenSymbol,
      depositTokenLogo
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

  const onTxFail = () => {
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

  const handleCreateInvestmentClub = async () => {
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

      amplitudeLogger(CLUB_CREATION, {
        flow: Flow.CLUB_CREATE,
        transaction_status: 'Success'
      });
      return await submitCreateClub();
    } catch (error) {
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
      amplitudeLogger(CLUB_CREATION, {
        flow: Flow.CLUB_CREATE,
        transaction_status: 'Failure'
      });
    }
  };

  const keyPressEnter = (e) => {
    // This should work only when in create IC(Investment club)
    if (!router.pathname.endsWith('clubprivatebetainvite')) return;

    // it triggers by pressing the enter key
    if ((nextBtnDisabled || showNextButton) && e.keyCode === 13) {
      if (isReviewStep) {
        handleCreateInvestmentClub();
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
        steps: investmentClubSteps,
        stepsCategories,
        stepsNames,
        isReviewStep,
        isFirstStep,
        editingStep,
        setEditingStep,
        backBtnDisabled,
        nextBtnDisabled,
        handleCreateInvestmentClub,
        setBackBtnDisabled,
        setNextBtnDisabled,
        showNextButton,
        setShowNextButton,
        waitingConfirmationModal,
        transactionModal,
        errorModal,
        warningModal,
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
        setIsCustomDate
      }}
    >
      {children}
    </CreateInvestmentClubContext.Provider>
  );
};

export default CreateInvestmentClubProvider;
