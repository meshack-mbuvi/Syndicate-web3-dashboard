import { metamaskConstants } from "@/components/syndicates/shared/Constants";
import { getMetamaskError } from "@/helpers";
import useUSDCDetails from "@/hooks/useUSDCDetails";
import { AppState } from "@/state";
import {
  setClubCreationReceipt,
  setTransactionHash,
} from "@/state/createInvestmentClub/slice";
import { getWeiAmount } from "@/utils/conversions";
import router from "next/router";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import steps from "./steps";

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
  setShowModal: Dispatch<SetStateAction<Record<string, boolean>>>;
  processingModalTitle: string;
  processingModalDescription: string;
  errorModalMessage: string;
  showByInvitationOnly: boolean;
  setShowByInvitationOnly: Dispatch<SetStateAction<boolean>>;
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
      web3: { account },
    },
    initializeContractsReducer: {
      syndicateContracts: { clubERC20Factory },
    },
    createInvestmentClubSliceReducer: {
      investmentClubName,
      investmentClubSymbol,
      tokenCap,
      mintEndTime: { value: endMintTime },
      membersCount,
    },
  } = useSelector((state: AppState) => state);

  const { depositTokenAddress } = useUSDCDetails();
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [backBtnDisabled, setBackBtnDisabled] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);

  const [processingModalTitle, setProcessingTitle] = useState("");
  const [processingModalDescription, setProcessingDescription] = useState("");
  const [errorModalMessage, setErrorModalMessage] = useState("");
  // show by invitation only box
  const [showByInvitationOnly, setShowByInvitationOnly] =
    useState<boolean>(true);

  const [
    { waitingConfirmationModal, transactionModal, errorModal },
    setShowModal,
  ] = useState({
    waitingConfirmationModal: false,
    transactionModal: false,
    errorModal: false,
  });

  const reviewStep = currentStep === steps.length - 1;
  const lastStep = currentStep === steps.length - 2;
  const firstStep = currentStep === 0;

  useEffect(() => {
    if (!nextBtnDisabled) {
      document.addEventListener("keypress", keyPressEnter);
      return () => {
        document.removeEventListener("keypress", keyPressEnter);
      };
    }
  });

  const handleNext = () => {
    setShowNextButton(true);
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setNextBtnDisabled(false);
    setShowNextButton(true);
    setCurrentStep((prev) => prev - 1);
  };

  const onTxConfirm = (transactionHash: string) => {
    // Change modal title and description after confirming tx
    setProcessingTitle("Pending confirmation");
    setProcessingDescription(
      "This could take up to a few minutes depending on network congestion and the gas fees you set.",
    );
    dispatch(setTransactionHash(transactionHash));
  };

  const onTxReceipt = (receipt) => {
    dispatch(
      setClubCreationReceipt(receipt.events.ClubERC20Created.returnValues),
    );
    dispatch(setTransactionHash(""));
    setShowModal(() => ({
      waitingConfirmationModal: false,
      transactionModal: true,
      errorModal: false,
    }));
  };

  const handleCreateInvestmentClub = async () => {
    try {
      setProcessingTitle("Confirm in wallet");
      setProcessingDescription(
        "Confirm the creation of this investment club in your wallet",
      );
      setShowModal(() => ({
        waitingConfirmationModal: true,
        transactionModal: false,
        errorModal: false,
      }));
      const _tokenCap = getWeiAmount(tokenCap, 18, true);
      const startTime = parseInt((new Date().getTime() / 1000).toString()); // convert to seconds
      await clubERC20Factory.createERC20(
        account,
        investmentClubName,
        investmentClubSymbol,
        depositTokenAddress,
        startTime,
        endMintTime,
        _tokenCap,
        +membersCount,
        onTxConfirm,
        onTxReceipt,
      );
    } catch (error) {
      const { code } = error;
      if (code) {
        const errorMessage = getMetamaskError(code, "Club creation");
        setErrorModalMessage(errorMessage);
      } else {
        // alert any other contract error
        setErrorModalMessage(metamaskConstants.metamaskUnknownErrorMessage);
      }
      setShowModal(() => ({
        waitingConfirmationModal: false,
        transactionModal: false,
        errorModal: true,
      }));
    }
  };

  const keyPressEnter = (e) => {
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
        setNextBtnDisabled,
        showNextButton,
        setShowNextButton,
        waitingConfirmationModal,
        transactionModal,
        errorModal,
        setShowModal,
        processingModalTitle,
        processingModalDescription,
        errorModalMessage,
        showByInvitationOnly,
        setShowByInvitationOnly
      }}
    >
      {children}
    </CreateInvestmentClubContext.Provider>
  );
};

export default CreateInvestmentClubProvider;
