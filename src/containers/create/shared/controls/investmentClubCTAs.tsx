import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";
import { useSpring, animated } from "react-spring";

const InvestmentClubCTAs: React.FC = () => {
  const {
    reviewStep,
    lastStep,
    firstStep,
    handleBack,
    handleNext,
    backBtnDisabled,
    nextBtnDisabled,
    handleCreateInvestmentClub,
    showNextButton,
  } = useCreateInvestmentClubContext();

  const styles = useSpring({
    to: { y: 0 },
    from: { y: -50 },
    delay: 500,
  });

  return (
    <animated.div
      className={`bg-black flex-none flex flex-col ${
        reviewStep
          ? "fixed bottom-1 w-4/5 lg:w-2/5 border-t border-gray-syn4 pt-6"
          : ""
      }`}
      style={styles}
    >
      <div
        className={`relative flex items-center h-20 ${
          firstStep ? "justify-end" : "justify-between"
        }`}
      >
        {!firstStep && (
          <button
            className={`flex items-center py-3.5 text-gray-lightManatee text-base opacity-80 hover:opacity-100 focus:outline-none ${
              backBtnDisabled ? "cursor-not-allowed" : ""
            }`}
            onClick={handleBack}
            disabled={backBtnDisabled}
          >
            <img className="w-5 h-5" src="/images/arrowBack.svg" alt="" />
            <span className="ml-2">Back</span>
          </button>
        )}
        {showNextButton && (
          <button
            className={`${reviewStep && "bg-green-400"} primary-CTA ${
              nextBtnDisabled
                ? "primary-CTA-disabled text-gray-lightManatee"
                : "hover:opacity-90 transition-all"
            }`}
            onClick={reviewStep ? handleCreateInvestmentClub : handleNext}
            disabled={nextBtnDisabled}
          >
            {reviewStep
              ? "Create investment club"
              : lastStep
              ? "Review"
              : "Next"}
          </button>
        )}
      </div>
    </animated.div>
  );
};

export default InvestmentClubCTAs;
