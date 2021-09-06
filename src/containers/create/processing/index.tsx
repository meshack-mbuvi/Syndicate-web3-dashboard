import { CheckIcon } from "@heroicons/react/solid";
import { SpinnerWithImage } from "@/components/shared/spinner/spinnerWithImage";
import { EtherscanLink } from "@/components/syndicates/shared/EtherscanLink";
import React from "react";
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface ProcessingStep {
  title: string;
  info?: string;
}

const Processing: React.FC = () => {
  const { processingInfo, handleAddToAllowlist } = useCreateSyndicateContext();
  const {
    processingTitle,
    processingMessage,
    currentTransaction,
    transactionsCount,
    currentTxHash,
    showErrorMessage,
    errorMessage,
  } = processingInfo;

  const { submitting } = useSelector(
    (state: RootState) => state.loadingReducer,
  );

  // Ordered steps
  const allSteps: ProcessingStep[] = [
    {
      title: "Create on-chain syndicate",
      info: "For extra security, the Ethereum network requires that you set an allowance equal to your deposit before depositing",
    },
    { title: "Add members to the allowlist" },
  ];

  return (
    <div className="flex w-full items-center justify-center">
      <div className="border-1 border-gray-steelGrey rounded-lg p-6 w-5/6">
        {showErrorMessage ? (
          <div className="flex flex-col items-center justify-center mt-7">
            <img
              className="mb-4 h-12 w-12"
              src="/images/errorClose.svg"
              alt="error"
            />
            <p className="font-semibold text-2xl text-center">
              Transaction rejected.
            </p>

            <p className="text-base my-5 font-normal text-gray-dim text-center">
              {errorMessage}
            </p>
          </div>
        ) : (
          <div>
            <div className=" mb-9">
              <p className="font-medium leading-8 sm:text-2xl">
                {processingTitle}
              </p>
            </div>
            {allSteps.splice(0, transactionsCount).map((step, stepIdx) => {
              const completedStep = currentTransaction > stepIdx + 1;
              const inactiveStep = currentTransaction < stepIdx + 1;
              return (
                <div className="flex flex-col mb-5" key={step.title}>
                  <div className="relative flex group items-center">
                    <span className="h-6 flex items-center" aria-hidden="true">
                      {completedStep ? (
                        <CheckIcon className="w-6 h-6  text-green-light group-hover:text-green-light" />
                      ) : (
                        <span
                          className={`relative z-5 w-6 h-6 flex items-center justify-center border-2 rounded-full ${
                            inactiveStep ? "border-gray-dimmer" : "border-blue"
                          }`}
                        />
                      )}
                    </span>
                    <span className="ml-4 min-w-0 flex flex-col">
                      <span
                        className={`text-lg ${
                          inactiveStep ? "text-gray-dimmer" : "text-white"
                        } leading-7 font-light transition-all`}
                      >
                        {step.title}
                      </span>
                    </span>
                  </div>
                  {step.info ? (
                    <div className="ml-10 text-gray-dim tex-sm">
                      <p>{step.info}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}

            {!submitting && currentTransaction === 2 ? (
              <div>
                <button
                  className={`flex w-full items-center justify-center font-medium rounded-md text-black bg-white focus:outline-none focus:ring py-4`}
                  onClick={handleAddToAllowlist}
                >
                  Continue
                </button>
              </div>
            ) : (
              <div className="mt-6 bg-blue bg-opacity-10 rounded-lg text-center flex flex-col items-center px-4 py-6">
                <SpinnerWithImage
                  icon={null}
                  height="h-10"
                  width="w-10"
                  strokeWidth="8"
                />
                <p className="mt-4">{processingMessage}</p>
                <EtherscanLink
                  etherscanInfo={currentTxHash}
                  type="transaction"
                  customStyles="mt-4"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Processing;
