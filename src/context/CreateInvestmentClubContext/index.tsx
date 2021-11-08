import useUSDCDetails from "@/hooks/useUSDCDetails";
import { RootState } from "@/redux/store";
import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClubCreationReceipt, setTransactionHash } from "@/state/createInvestmentClub/slice";
import steps from "./steps";
import { getWeiAmount } from "@/utils/conversions";

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
};

const CreateInvestmentClubContext = createContext<
  Partial<CreateInvestmentClubProviderProps>
>({});

export const useCreateInvestmentClubContext =
  (): Partial<CreateInvestmentClubProviderProps> =>
    useContext(CreateInvestmentClubContext);

const CreateInvestmentClubProvider: React.FC = ({ children }) => {
  const {
    web3Reducer: { web3: { account } },
    initializeContractsReducer: { syndicateContracts: { clubERC20Factory } },
    createInvestmentClubSliceReducer: { 
      investmentClubName,
      investmentClubSymbol,
      tokenCap,
      mintEndTime: { value: startTime },
      membersCount,
     }
  } = useSelector((state: RootState) => state);

  const { depositTokenAddress } = useUSDCDetails();
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [backBtnDisabled, setBackBtnDisabled] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);

  const [{
    waitingConfirmationModal, transactionModal, errorModal
  }, setShowModal] = useState({
    waitingConfirmationModal: false,
    transactionModal: false,
    errorModal: false,
  })

  const [usdcRef, setUsdcRef] = useState(null);
  const [monthRef, setMonthRef] = useState(null);
  const [parentRef, setParentRef] = useState(null);

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
    dispatch(setTransactionHash(transactionHash));
  };

  const onTxReceipt = (receipt) => {
    dispatch(setClubCreationReceipt(receipt.events.ClubERC20Created.returnValues));
    setShowModal(() => ({
      waitingConfirmationModal: false,
      transactionModal: true,
      errorModal: false,
    }));
  };

  const handleCreateInvestmentClub = async () => {
    try {
      setShowModal(() => ({
        waitingConfirmationModal: true,
        transactionModal: false,
        errorModal: false,
      }));
      const _tokenCap = getWeiAmount(tokenCap, 18, true);
      await clubERC20Factory.createERC20(
        account,
        investmentClubName,
        investmentClubSymbol,
        depositTokenAddress,
        new Date().getTime(),
        startTime,
        _tokenCap,
        membersCount,
        onTxConfirm,
        onTxReceipt,
      );
    } catch (error) {
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
        animationsRefs: {
          parentRef,
          setParentRef,
          usdcRef,
          setUsdcRef,
          monthRef,
          setMonthRef,
        },
        waitingConfirmationModal,
        transactionModal,
        errorModal,
        setShowModal,
      }}
    >
      {children}
    </CreateInvestmentClubContext.Provider>
  );
};

export default CreateInvestmentClubProvider;
