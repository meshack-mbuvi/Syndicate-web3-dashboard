import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import steps from "./steps";

type CreateInvestmentClubProviderProps = {
  handleNext: () => void;
  handleBack: () => void;
  currentStep: number;
  steps: typeof steps;
  reviewStep: boolean;
  lastStep: boolean;
  firstStep: boolean;
  backBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  handleCreateInvestmentClub: () => void;
  setNextBtnDisabled: Dispatch<SetStateAction<boolean>>;
};

const CreateInvestmentClubContext = createContext<
  Partial<CreateInvestmentClubProviderProps>
>({});

export const useCreateInvestmentClubContext =
  (): Partial<CreateInvestmentClubProviderProps> =>
    useContext(CreateInvestmentClubContext);

const CreateInvestmentClubProvider: React.FC = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [backBtnDisabled, setBackBtnDisabled] = useState(false);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);

  const reviewStep = currentStep === steps.length - 1;
  const lastStep = currentStep === steps.length - 2;
  const firstStep = currentStep === 0;

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setNextBtnDisabled(false);
    setCurrentStep((prev) => prev - 1);
  };

  const handleCreateInvestmentClub = () => {
    // Contract Calls can go here
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
      }}
    >
      {children}
    </CreateInvestmentClubContext.Provider>
  );
};

export default CreateInvestmentClubProvider;
