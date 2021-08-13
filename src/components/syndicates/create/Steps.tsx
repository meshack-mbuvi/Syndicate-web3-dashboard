import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import slugify from "slugify";
import SubStep from "./SubStep";

interface SubStep {
  name: string;
  component: React.ReactNode;
}
interface IStep {
  name: string;
  subSteps?: SubStep[];
}

interface ISteps {
  steps: IStep[];
  currentStep: number;
  currentSubStep: number;
  disableConfirmClick: boolean;
}

const Steps: FC<ISteps> = ({
  steps,
  currentStep,
  currentSubStep,
  disableConfirmClick,
}) => {
  const { setCurrentSubStep, setCurrentStep, buttonsDisabled } =
    useCreateSyndicateContext();

  const router = useRouter();

  useEffect(() => {
    let string = `?step=${slugify(steps?.[currentStep]?.name, {
      lower: true,
    })}`;
    if (steps?.[currentStep]?.subSteps) {
      string += `&substep=${slugify(
        steps?.[currentStep]?.subSteps?.[currentSubStep]?.name,
        { lower: true },
      )}`;
    }
    router.push(string);
  }, [currentStep, currentSubStep]);
  return (
    <ol className="space-y-7 overflow-hidden xs:hidden" role="menu">
      {steps.map((step, stepIdx) => {
        const completedStep = stepIdx < currentStep;
        const activeStep = stepIdx === currentStep;
        return (
          <div
            key={step.name}
            className={`${
              stepIdx !== steps?.length - 1 ? "pb-10" : ""
            }group relative ${
              stepIdx < 3 ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={(e) => {
              // prevent clicks if the buttons are disabled and processing and done pages
              if (!buttonsDisabled && stepIdx <= 2 && !disableConfirmClick) {
                e.preventDefault();
                setCurrentStep(stepIdx);
                setCurrentSubStep(0);
              }
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              // prevent clicks if the buttons are disabled and processing and done pages
              if (!buttonsDisabled && stepIdx <= 2 && !disableConfirmClick) {
                e.preventDefault();
                setCurrentStep(stepIdx);
                setCurrentSubStep(0);
              }
            }}
          >
            {stepIdx !== steps?.length - 1 ? (
              <div
                className={`-ml-px absolute mt-0.5 top-2 left-2 w-0.5 h-12  ${
                  completedStep ? "bg-green-light" : ""
                }`}
                aria-hidden="true"
              />
            ) : null}
            <div className="relative flex items-start group">
              <span className=" h-6 flex items-center" aria-hidden="true">
                <span
                  className={`relative z-5 w-4 h-4 flex items-center justify-center border-2 rounded-full ${
                    // hide hover status for processing and done
                    stepIdx < 3 ? "group-hover:border-green-light" : ""
                  }
                  ${activeStep ? "border-green-light " : "border-gray-inactive"}
                  ${completedStep ? "bg-green-light border-green-light" : ""}
                   `}
                >
                  <span
                    className={`h-full w-full rounded-full group-hover:border-green-light`}
                  />
                </span>
              </span>
              <span className="ml-4 min-w-0 flex flex-col">
                <span
                  className={`text-lg ${
                    // hide hover status for processing and done
                    stepIdx < 3 ? "hover:text-white" : ""
                  } sm:text-base ${
                    completedStep || activeStep
                      ? "text-white"
                      : "text-gray-inactiveText"
                  }  leading-7 font-light transition-all `}
                >
                  {step.name}
                </span>

                {activeStep
                  ? step?.subSteps?.map((subStep, subStepIdx) => {
                      const completedSubStep = subStepIdx < currentSubStep;
                      const activeSubStep = subStepIdx === currentSubStep;
                      return (
                        <SubStep
                          key={subStep.name}
                          onClick={(e) => {
                            if (!buttonsDisabled) {
                              e.stopPropagation();
                              setCurrentSubStep(subStepIdx);
                            }
                            return null;
                          }}
                          onKeyDown={(e) => {
                            if (!buttonsDisabled) {
                              e.stopPropagation();
                              setCurrentSubStep(subStepIdx);
                            }
                            return null;
                          }}
                          completedSubStep={completedSubStep}
                          activeSubStep={activeSubStep}
                          subStep={subStep}
                        />
                      );
                    })
                  : null}
              </span>
            </div>
          </div>
        );
      })}
    </ol>
  );
};

export default Steps;
