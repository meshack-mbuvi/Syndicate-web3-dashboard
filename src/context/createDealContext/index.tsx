import { metamaskConstants } from '@/components/syndicates/shared/Constants';
import { SelectedTimeWindow } from '@/features/deals/components/create/window';
import { getMetamaskError } from '@/helpers';
import { AppState } from '@/state';
import { acronymGenerator } from '@/utils/acronymGenerator';
import { getWeiAmount } from '@/utils/conversions';
import moment from 'moment';
import { generateSlug } from 'random-word-slugs';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react';
import { useSelector } from 'react-redux';
import { TransactionReceipt } from 'web3-core';

type CreateDealProviderProps = {
  // deal details
  name: string;
  handleNameChange: (name: string) => void;
  handleShuffle: (e: any) => void;
  // details: string;
  // handleDetailsChange: (details: string) => void;
  commitmentGoal: string;
  handleCommitmentGoalChange: (goal: string) => void;
  minimumCommitment: string;
  handleMinimumCommitmentChange: (minGoal: string) => void;
  destinationAddress: string;
  handleDestinationAddressChange: (address: string) => void;
  ensName: string;
  selectedTimeWindow: SelectedTimeWindow;
  handleSelectedTimeWindowChange: (time: SelectedTimeWindow) => void;
  customDate: Date;
  handleCustomDateChange: (date: Date) => void;
  customTime: string;
  handleCustomTimeChange: (time: string) => void;
  endTime: string;
  tokenSymbol: string;
  handleTokenSymbolChange: (tokenSymbol: string) => void;
  commitmentGoalTokenSymbol: string;
  commitmentGoalTokenLogo: string;

  // field errors
  nameError: string;
  setNameError: Dispatch<SetStateAction<string>>;
  commitmentGoalError: string;
  setCommitmentGoalError: Dispatch<SetStateAction<string>>;
  minimumCommitmentError: string;
  setMinimumCommitmentError: Dispatch<SetStateAction<string>>;
  destinationAddressError: string;
  setDestinationAddressError: Dispatch<SetStateAction<string>>;

  // navigation
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  handleNext: () => void;
  handleBack: () => void;
  showNextButton: boolean;
  showBackButton: boolean;
  isReviewStep: boolean;
  isSuccessStep: boolean;
  isEditingField: boolean;
  setIsEditingField: Dispatch<SetStateAction<boolean>>;
  resetCreateFlowState: () => void;
  handleGoToStep: (step: number) => void;

  // deal creation progress steps
  isCreateDealDisabled: boolean;
  handleCreateDeal: () => void;
  transactionHash: string;
  showAwaitingConfirmationModal: boolean;

  showTransactionModal: boolean;
  showErrorModal: boolean;
  showWarningModal: boolean;
  setShowModal: Dispatch<
    SetStateAction<{
      showAwaitingConfirmationModal: boolean;
      showTransactionModal: boolean;
      showErrorModal: boolean;
      showWarningModal: boolean;
    }>
  >;
  processingModalTitle: string;
  processingModalDescription: string;
  errorModalMessage: string;
  createdDealAddress: string;
  dealUrl: string;
  isNextButtonDisabled: boolean;
};

const CreateDealContext = createContext<Partial<CreateDealProviderProps>>({});

export const useCreateDealContext = (): Partial<CreateDealProviderProps> =>
  useContext(CreateDealContext);

const CreateDealProvider: React.FC = ({ children }) => {
  const {
    web3Reducer: {
      web3: { web3, account, activeNetwork }
    },
    initializeContractsReducer: {
      syndicateContracts: { erc20DealFactory }
    }
  } = useSelector((state: AppState) => state);

  // deal details
  const [name, setName] = useState('');
  // const [details, handleDetailsChange] = useState('');
  const [commitmentGoal, handleCommitmentGoalChange] = useState('');
  const [minimumCommitment, handleMinimumCommitmentChange] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [ensName, setEnsName] = useState('');
  const [selectedTimeWindow, setSelectedTimeWindow] =
    useState<SelectedTimeWindow>(SelectedTimeWindow.DAY);
  const [customDate, setCustomDate] = useState<Date>();
  const [customTime, setCustomTime] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [endTime, setEndTime] = useState('');
  // update this once we add support for more tokens.
  const commitmentGoalTokenSymbol = 'USDC';
  const commitmentGoalTokenLogo = '/images/prodTokenLogos/USDCoin.svg';

  // field errors
  const [nameError, setNameError] = useState('');
  const [commitmentGoalError, setCommitmentGoalError] = useState('');
  const [minimumCommitmentError, setMinimumCommitmentError] = useState('');
  const [destinationAddressError, setDestinationAddressError] = useState('');

  // progress states
  const [processingModalTitle, setProcessingTitle] = useState('');
  const [processingModalDescription, setProcessingDescription] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [errorModalMessage, setErrorModalMessage] = useState('');

  const [
    {
      showAwaitingConfirmationModal,
      showTransactionModal,
      showErrorModal,
      showWarningModal
    },
    setShowModal
  ] = useState({
    showAwaitingConfirmationModal: false,
    showTransactionModal: false,
    showErrorModal: false,
    showWarningModal: false
  });
  const [createdDealAddress, setCreatedDealAddress] = useState('');
  const [dealUrl, setDealUrl] = useState('');

  // navigation
  const [currentStep, setCurrentStep] = useState(0);
  const [showNextButton, setShowNextButton] = useState(true);
  const [showBackButton, setShowBackButton] = useState(false);
  const [isEditingField, setIsEditingField] = useState(false);
  const [isCreateDealDisabled, setIsCreateDealDisabled] = useState(false);
  const isReviewStep = currentStep === 4;
  const isSuccessStep = currentStep > 4;

  // change handlers

  const handleNameChange = (name: string): void => {
    setName(name);
    if (!isReviewStep) {
      setTokenSymbol(acronymGenerator(name));
    }
  };

  const handleDestinationAddressChange = (address: string): void => {
    // check if ens address is valid.
    if (address.endsWith('.eth')) {
      web3.eth.ens
        .getAddress(address)
        .then(function (resolvedAddress: string) {
          setDestinationAddress(resolvedAddress);
          setEnsName(address);
          setDestinationAddressError('');
        })
        .catch(() => {
          setDestinationAddressError('Invalid address');
        });
    }

    // check if non-ens address is valid
    if (!address.endsWith('.eth') && !web3.utils.isAddress(address)) {
      setDestinationAddressError('Invalid address');
    } else {
      setDestinationAddressError('');
    }
    setDestinationAddress(address);
  };

  const handleSelectedTimeWindowChange = (time: SelectedTimeWindow): void => {
    setSelectedTimeWindow(time);
    if (time != SelectedTimeWindow.CUSTOM && !isReviewStep) {
      handleNext();
    }
  };
  const handleCustomDateChange = (date: Date): void => {
    setCustomDate(date);
  };

  const handleCustomTimeChange = (time: string): void => {
    setCustomTime(time);
  };

  const handleTokenSymbolChange = (dealTokenSymbol: string): void => {
    setTokenSymbol(dealTokenSymbol);
  };

  // shuffles to generate a random name for a deal
  const handleShuffle = (e: any): void => {
    e.preventDefault();
    const slug = generateSlug(2, {
      format: 'title',
      categories: {
        noun: [
          'media',
          'science',
          'sports',
          'technology',
          'thing',
          'time',
          'transportation',
          'animals'
        ],
        adjective: [
          'appearance',
          'color',
          'quantity',
          'shapes',
          'size',
          'sounds',
          'taste',
          'touch'
        ]
      }
    });
    handleNameChange(slug);
  };

  // back and forth navigation
  const handleNext = (): void => {
    setCurrentStep((currentStep) => currentStep + 1);
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

  useEffect(() => {
    // do not show/disable back button if on the first step
    if (currentStep === 0 || isReviewStep || isSuccessStep) {
      setShowBackButton(false);
    } else {
      setShowBackButton(true);
    }

    // do not show next button on the review step
    // or the success step.
    if (isReviewStep || isSuccessStep) {
      setShowNextButton(false);
    } else {
      setShowNextButton(true);
    }

    // disable create button if field values are missing
    if (
      !name ||
      nameError /*  || !details */ ||
      !commitmentGoal ||
      !minimumCommitment ||
      !destinationAddress ||
      destinationAddressError ||
      (selectedTimeWindow === SelectedTimeWindow.CUSTOM &&
        (!customTime || !customDate)) ||
      !tokenSymbol
    ) {
      setIsCreateDealDisabled(true);
    } else {
      setIsCreateDealDisabled(false);
    }
  }, [
    currentStep,
    name,
    // details,
    commitmentGoal,
    minimumCommitment,
    destinationAddressError,
    destinationAddress,
    nameError,
    tokenSymbol,
    customTime,
    customDate,
    selectedTimeWindow,
    isReviewStep,
    isSuccessStep
  ]);

  // set correct start and close times for deal
  useEffect(() => {
    const startDate = moment();
    if (selectedTimeWindow === SelectedTimeWindow.DAY) {
      setEndTime(moment(startDate).add(24, 'hours').valueOf().toString());
    } else if (selectedTimeWindow === SelectedTimeWindow.WEEK) {
      setEndTime(moment(startDate).add(7, 'days').valueOf().toString());
    } else if (selectedTimeWindow === SelectedTimeWindow.MONTH) {
      setEndTime(moment(startDate).add(1, 'months').valueOf().toString());
    } else if (selectedTimeWindow === SelectedTimeWindow.CUSTOM) {
      if (customTime && customDate) {
        const dateString = new Date(customDate).toDateString();
        setEndTime(
          moment(dateString + ' ' + customTime)
            .valueOf()
            .toString()
        );
      }
    }
  }, [selectedTimeWindow, customDate, customTime]);

  const onTxConfirm = (transactionHash: string): void => {
    // Change modal title and description after confirming tx
    setProcessingTitle('Pending confirmation');
    setProcessingDescription(
      'This could take up to a few minutes depending on network congestion and the gas fees you set.'
    );
    setTransactionHash(transactionHash);
  };

  const onTxReceipt = (receipt: TransactionReceipt): void => {
    if (receipt.events) {
      const { returnValues } = receipt.events.ERC20ClubCreated;
      const tokenAddress = returnValues?.tokenAddress;
      setCreatedDealAddress(tokenAddress);

      // create deal url
      setDealUrl(
        `/deals/${tokenAddress.toLowerCase()}?chain=${activeNetwork.network}`
      );
    }

    setTransactionHash('');
    setShowModal(() => ({
      showAwaitingConfirmationModal: false,
      showTransactionModal: false,
      showErrorModal: false,
      showWarningModal: false
    }));
    // show success component
    handleNext();
  };

  const onTxFail = () => {
    setShowModal(() => ({
      showAwaitingConfirmationModal: false,
      showTransactionModal: false,
      showErrorModal: true,
      showWarningModal: false
    }));
  };

  const handleCreateDeal = async (): Promise<void> => {
    try {
      setProcessingTitle('Confirm in wallet');
      setProcessingDescription(
        'Confirm the creation of this deal in your wallet.'
      );
      setShowModal(() => ({
        showAwaitingConfirmationModal: true,
        showTransactionModal: false,
        showErrorModal: false,
        showWarningModal: false
      }));

      // v0 uses USDC only
      const commitTokenDecimals = 6;

      // set up deal params
      const dealParams = {
        dealName: name,
        dealTokenSymbol: tokenSymbol,
        dealDestination: destinationAddress,
        dealGoal: parseFloat(
          getWeiAmount(commitmentGoal, commitTokenDecimals, true)
        ),
        minPerMember: parseFloat(
          getWeiAmount(minimumCommitment, commitTokenDecimals, true)
        ),
        startTime: Math.floor(new Date().getTime() / 1000).toString(),
        endTime: Math.floor(+endTime / 1000).toString()
      };

      await erc20DealFactory.createDeal(
        account,
        dealParams,
        onTxConfirm,
        onTxReceipt,
        onTxFail
      );
    } catch (error: any) {
      const { code } = error;
      if (code) {
        const errorMessage = getMetamaskError(code, 'Deal creation');
        setErrorModalMessage(errorMessage);
      } else {
        // alert any other contract error
        setErrorModalMessage(metamaskConstants.metamaskUnknownErrorMessage);
      }
      setShowModal({
        showAwaitingConfirmationModal: false,
        showTransactionModal: false,
        showErrorModal: true,
        showWarningModal: false
      });
    }
  };

  // go to the next step on enter button press
  useEffect(() => {
    document.addEventListener('keypress', keyPressEnter);
    return (): void => {
      document.removeEventListener('keypress', keyPressEnter);
    };
  });

  const keyPressEnter = (e: any) => {
    if (!isReviewStep && !isSuccessStep && e.keyCode === 13) {
      handleNext();
    }
  };

  const resetCreateFlowState = (): void => {
    setCurrentStep(0);

    // reset fields.
    // feel free to remove these if this is not necessary
    setName('');
    handleCommitmentGoalChange('');
    handleMinimumCommitmentChange('');
    setDestinationAddress('');
    setEnsName('');
    setSelectedTimeWindow(SelectedTimeWindow.DAY);
    setCustomDate(new Date());
    setCustomTime('');
    setTokenSymbol('');
    setEndTime('');
  };

  return (
    <CreateDealContext.Provider
      value={{
        // deal details
        name,
        handleNameChange,
        handleShuffle,
        // details,
        // handleDetailsChange,
        minimumCommitment,
        handleMinimumCommitmentChange,
        commitmentGoal,
        handleCommitmentGoalChange,
        destinationAddress,
        ensName,
        handleDestinationAddressChange,
        selectedTimeWindow,
        handleSelectedTimeWindowChange,
        customDate,
        handleCustomDateChange,
        customTime,
        handleCustomTimeChange,
        endTime,
        tokenSymbol,
        handleTokenSymbolChange,
        commitmentGoalTokenLogo,
        commitmentGoalTokenSymbol,

        // field errors
        nameError,
        setNameError,
        commitmentGoalError,
        setCommitmentGoalError,
        destinationAddressError,
        setDestinationAddressError,
        minimumCommitmentError,
        setMinimumCommitmentError,

        // navigation
        handleNext,
        handleBack,
        showNextButton,
        showBackButton,
        currentStep,
        setCurrentStep,
        isReviewStep,
        isSuccessStep,
        isEditingField,
        setIsEditingField,
        resetCreateFlowState,
        handleGoToStep,

        // creation steps
        isCreateDealDisabled,
        handleCreateDeal,
        showAwaitingConfirmationModal,
        // might not need this
        showTransactionModal,
        showWarningModal,
        processingModalDescription,
        processingModalTitle,
        transactionHash,
        errorModalMessage,
        showErrorModal,
        setShowModal,
        createdDealAddress,
        dealUrl
      }}
    >
      {children}
    </CreateDealContext.Provider>
  );
};

export default CreateDealProvider;
