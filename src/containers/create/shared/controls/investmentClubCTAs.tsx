import { useCreateInvestmentClubContext } from "@/context/CreateInvestmentClubContext";

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
  } = useCreateInvestmentClubContext();

  return (
    <div className={`bg-black w-full flex-none flex flex-col`}>
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
        <button
          className={`${reviewStep && "bg-green-400"} primary-CTA ${
            nextBtnDisabled
              ? "primary-CTA-disabled text-gray-lightManatee"
              : "hover:opacity-90 transition-all"
          }`}
          onClick={reviewStep ? handleCreateInvestmentClub : handleNext}
          disabled={nextBtnDisabled}
        >
          {reviewStep ? "Create investment club" : lastStep ? "Review" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default InvestmentClubCTAs;
