import { Flow, amplitudeLogger } from '@/components/amplitude';
import {
  CREATE_INVESTMENT_CLUB,
  ERROR_INVESTMENT_CLUB_CREATION
} from '@/components/amplitude/eventNames';
import { metamaskConstants } from '@/components/syndicates/shared/Constants';
import { getMetamaskError } from '@/helpers';
import { AppState } from '@/state';
import {
  resetClubCreationReduxState,
  setClubCreationReceipt,
  setTransactionHash
} from '@/state/createInvestmentClub/slice';
import { getWeiAmount } from '@/utils/conversions';
import { useRouter } from 'next/router';
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import steps from './steps';

type CreateInvestmentClubProviderProps = {
  handleNext: () => void;
  handleBack: () => void;
  currentStep: number;
  steps: typeof steps;
  reviewStep: boolean;
  lastStep: boolean;
  firstStep: boolean;
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
  preClubCreationStep: string;
  setPreClubCreationStep: Dispatch<SetStateAction<string>>;
  resetCreationStates: () => void;
  setCurrentStep: (index: number) => void;
  isWalletConfrimed: boolean;
  setConfirmWallet: Dispatch<SetStateAction<boolean>>;
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
      web3: { account, activeNetwork }
    },
    initializeContractsReducer: {
      syndicateContracts: { clubERC20Factory, clubERC20FactoryNative }
    },
    createInvestmentClubSliceReducer: {
      investmentClubName,
      investmentClubSymbol,
      tokenCap,
      mintEndTime: { value: endMintTime },
      membersCount,
      tokenDetails: { depositToken, depositTokenSymbol }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [backBtnDisabled, setBackBtnDisabled] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);
  const [isWalletConfrimed, setConfirmWallet] = useState(false);

  const [processingModalTitle, setProcessingTitle] = useState('');
  const [processingModalDescription, setProcessingDescription] = useState('');
  const [errorModalMessage, setErrorModalMessage] = useState('');
  // show initial steps in create flow
  const [preClubCreationStep, setPreClubCreationStep] =
    useState<string>('invite');

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
    setPreClubCreationStep('invite');
    setShowModal(() => ({
      waitingConfirmationModal: false,
      transactionModal: false,
      errorModal: false,
      warningModal: false
    }));
  };

  const reviewStep = currentStep === steps.length - 1;
  const lastStep = currentStep === steps.length - 2;
  const firstStep = currentStep === 0;

  useEffect(() => {
    if (!nextBtnDisabled) {
      document.addEventListener('keypress', keyPressEnter);
      return () => {
        document.removeEventListener('keypress', keyPressEnter);
      };
    }
  });

  const handleNext = () => {
    setShowNextButton(true);
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setNextBtnDisabled(false);
    setShowNextButton(true);
    if (currentStep > 0) {
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

  const onTxReceipt = (receipt) => {
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
      const isNativeDeposit =
        depositTokenSymbol == activeNetwork.nativeCurrency.symbol;
      const _tokenCap = isNativeDeposit
        ? getWeiAmount((+tokenCap * 10000).toString(), 18, true)
        : getWeiAmount(tokenCap, 18, true);
      const startTime = parseInt((new Date().getTime() / 1000).toString()); // convert to seconds
      if (isNativeDeposit) {
        await clubERC20FactoryNative.createERC20(
          account,
          investmentClubName,
          investmentClubSymbol,
          startTime,
          endMintTime,
          _tokenCap,
          +membersCount,
          onTxConfirm,
          onTxReceipt
        );
      } else {
        await clubERC20Factory.createERC20(
          account,
          investmentClubName,
          investmentClubSymbol,
          /* depositDetails.depositToken */ depositToken,
          startTime,
          endMintTime,
          _tokenCap,
          +membersCount,
          onTxConfirm,
          onTxReceipt
        );
      }
      amplitudeLogger(CREATE_INVESTMENT_CLUB, {
        flow: Flow.CLUB_CREATION
      });
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
      amplitudeLogger(ERROR_INVESTMENT_CLUB_CREATION, {
        flow: Flow.CLUB_CREATION,
        error
      });
    }
  };

  const keyPressEnter = (e) => {
    // This should work only when in create IC(Investment club)
    if (!router.pathname.endsWith('clubprivatebetainvite')) return;

    // it triggers by pressing the enter key
    if ((nextBtnDisabled || showNextButton) && e.keyCode === 13) {
      if (reviewStep) {
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
        steps,
        reviewStep,
        lastStep,
        firstStep,
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
        preClubCreationStep,
        setPreClubCreationStep,
        resetCreationStates,
        setCurrentStep,
        isWalletConfrimed,
        setConfirmWallet
      }}
    >
      {children}
    </CreateInvestmentClubContext.Provider>
  );
};

export default CreateInvestmentClubProvider;
