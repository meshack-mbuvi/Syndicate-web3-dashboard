import { useCreateDealContext } from '@/context/createDealContext';

export const DealNextButton: React.FC = () => {
  const { handleNext, isNextButtonDisabled, showNextButton } =
    useCreateDealContext();
  return (
    <div>
      {showNextButton ? (
        <button
          className={`flex rounded-full items-center justify-center w-13.5 h-13.5 ${
            isNextButtonDisabled
              ? 'bg-gray-syn5 cursor-not-allowed'
              : 'bg-white hover:bg-gray-syn2 active:bg-gray-syn3'
          }  `}
          onClick={handleNext}
          disabled={isNextButtonDisabled}
        >
          <img src="/images/arrowDownBlack.svg" alt="arrow" />
        </button>
      ) : null}
    </div>
  );
};
