type NextButtonProps = {
  handleNext?: (e: React.MouseEvent<HTMLElement>) => void;
  showNextButton: boolean;
  isNextButtonDisabled: boolean;
};

export const NextButton: React.FC<NextButtonProps> = ({
  handleNext,
  showNextButton,
  isNextButtonDisabled
}) => {
  return (
    <div>
      {showNextButton ? (
        <button
          className={`flex rounded-full items-center justify-center w-13.5 h-13.5 ${
            isNextButtonDisabled
              ? 'bg-gray-syn7'
              : 'bg-white  hover:bg-gray-syn2 active:bg-gray-syn3 disabled:bg-gray-syn7'
          } `}
          onClick={handleNext}
          disabled={isNextButtonDisabled}
        >
          <img src="/images/arrowDownBlack.svg" alt="arrow" />
        </button>
      ) : null}
    </div>
  );
};
