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
      className={`bg-black flex-none flex flex-col sm:items-center ${
        reviewStep ? "fixed w-full left-0 bottom-0 h-32 px-10 " : ""
      }`}
      style={styles}
    >
      <div
        className={`flex flex-col-reverse items-center pt-4 sm:w-full sm:flex-row sm:max-w-480 sm:h-full sm:pt-0 sm:ml-0 ml-5 ${
          firstStep ? "justify-end" : "justify-between"
        }
          ${reviewStep ? "sm:border-t border-gray-syn4" : ""}
        }`}
      >
        {!firstStep && (
          <button
            className={`flex items-center mt-6 sm:mt-0 text-gray-syn4 text-base opacity-80 hover:opacity-100 focus:outline-none sm:ml-5 ml-0 ${
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
            className={`w-full sm:w-auto ${
              nextBtnDisabled
                ? "primary-CTA-disabled text-gray-syn4"
                : reviewStep
                ? "green-CTA transition-all"
                : "primary-CTA"
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
