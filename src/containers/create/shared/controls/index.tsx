import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { useRouter } from "next/router";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";

const Controls = () => {
  const {
    handleBack,
    handleNext,
    buttonsDisabled,
    currentStep,
    handleFinish,
    continueDisabled,
  } = useCreateSyndicateContext();

  // TODO
  // Improve this instead of hardcoding
  const lastStep = currentStep === 2;

  const firstStep = currentStep === 0;

  const hideContinueButton = currentStep > 2;

  const router = useRouter();
  const TERMS_OF_SERVICE_LINK = process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_LINK;

  const handleCancel = () => {
    // Go to the syndicates page
    router.replace("/syndicates");
  };
  return (
    <div
      className={`bg-black fixed bottom-0 w-2/5 3xl:w-1/3 4xl:px-20 flex flex-col`}
    >
      <div className="relative flex mx-4 justify-between items-center border-t-1 border-gray-erieBlack h-20">
        <button
          className={`flex items-center px-12 py-3.5 text-gray-dim hover:text-white focus:outline-none ${
            buttonsDisabled ? "cursor-not-allowed" : ""
          }`}
          onClick={firstStep ? handleCancel : handleBack}
          disabled={buttonsDisabled}
        >
          <ArrowNarrowLeftIcon className="w-4" />
          <span className="ml-2">{firstStep ? " Cancel" : "Back"}</span>
        </button>
        {!hideContinueButton ? (
          <button
            className={`${
              lastStep ? "bg-green-400" : "bg-white"
            } text-black px-12 py-3.5 rounded-lg focus:outline-none ${
              buttonsDisabled || continueDisabled
                ? "cursor-not-allowed opacity-70"
                : "hover:opacity-80"
            }`}
            onClick={lastStep ? handleFinish : handleNext}
            disabled={buttonsDisabled || continueDisabled}
          >
            {lastStep ? "Finish" : "Continue"}
          </button>
        ) : null}
      </div>
      {lastStep ? (
        <div className="self-center pb-4">
          <p className="flex text-gray-400 justify-center text-sm">
            By creating a syndicate, you agree to the{" "}
            <a
              className="font-whyte text-center ml-1 font-medium  underline hover bg-light-green"
              href={TERMS_OF_SERVICE_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              terms of service.
            </a>
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Controls;