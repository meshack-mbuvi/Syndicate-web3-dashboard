import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { ArrowNarrowLeftIcon } from "@heroicons/react/solid";

interface ITemplageControls {
  continueDisabled?: boolean;
}

const TemplateControls = (props: ITemplageControls) => {
  const {
    continueDisabled,
    buttonsDisabled,
    currentTemplateStep,
    handleTemplateNext,
    handleTemplateBack,
    handleCreateSyndicate,
    currentTemplateSubstep,
    resetTemplateSubsteps,
  } = useCreateSyndicateContext();

  // confirm page means we are on the last step
  const lastStep = currentTemplateStep === 1;
  // hide continue button on processing and Done steps
  const hideContinueButton = currentTemplateStep > 1;
  // hide back button if a template substep is active
  const hideBackButton = Boolean(currentTemplateSubstep.length);

  // set info text under control buttons
  const termOfService = process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_LINK;
  let controlsInfoText;
  if (currentTemplateStep === 0) {
    controlsInfoText =
      "You’ll be able to review and edit more syndicate details in the next step";
  } else if (currentTemplateStep === 1) {
    controlsInfoText = (
      <span>
        By continuing, you affirm this syndicate adheres to the{" "}
        <a href={termOfService} className="underline" target="_blank">
          terms of service
        </a>
      </span>
    );
  }

  return (
    <div
      className={`bg-black fixed bottom-0 ${hideBackButton? "w-3/5": "w-2/5"} 3xl:w-1/3 4xl:px-20 flex flex-col ${
        hideBackButton ? "px-48" : ""
      }`}
    >
      <div className="relative flex justify-between items-center border-t-1 border-gray-erieBlack h-20">
        {!hideBackButton ? (
          <button
            className="flex items-center py-3.5 text-gray-3 hover:text-white focus:outline-none"
            onClick={handleTemplateBack}
            disabled={buttonsDisabled}
          >
            <ArrowNarrowLeftIcon className="w-4" />
            <span className="ml-2">Back</span>
          </button>
        ) : null}

        {!hideContinueButton ? (
          <button
            className={`${
              lastStep && !hideBackButton && "bg-green-400"
            } primary-CTA ${hideBackButton ? "w-full" : "w-40"} ${
              continueDisabled
                ? "primary-CTA-disabled"
                : "hover:opacity-90 transition-all"
            }`}
            onClick={
              lastStep && !hideBackButton
                ? handleCreateSyndicate
                : hideBackButton
                ? resetTemplateSubsteps
                : handleTemplateNext
            }
            disabled={continueDisabled}
          >
            {lastStep && !hideBackButton
              ? "Finish"
              : hideBackButton
              ? "Done"
              : "Continue"}
          </button>
        ) : null}
      </div>
      {!hideBackButton ? (
        <p className="text-sm mb-4 w-full text-center text-gray-placeholder">
          {controlsInfoText}
        </p>
      ) : null}
    </div>
  );
};

export default TemplateControls;
