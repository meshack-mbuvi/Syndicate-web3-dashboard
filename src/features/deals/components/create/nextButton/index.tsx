import { useCreateDealContext } from '@/context/createDealContext';

export const DealNextButton: React.FC = () => {
  const { handleNext, showNextButton } = useCreateDealContext();
  return (
    <div>
      {showNextButton ? (
        <button
          className={
            'flex rounded-full items-center justify-center w-13.5 h-13.5 bg-white hover:bg-gray-syn2 active:bg-gray-syn3'
          }
          onClick={handleNext}
        >
          <img src="/images/arrowDownBlack.svg" alt="arrow" />
        </button>
      ) : null}
    </div>
  );
};
