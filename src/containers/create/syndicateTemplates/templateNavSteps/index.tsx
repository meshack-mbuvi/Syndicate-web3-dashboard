import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import slugify from "slugify";

interface ITemplateStep {
  name: string;
}

interface ITemplateSteps {
  templateSteps: ITemplateStep[];
  currentTemplateStep: number;
}

const TemplateNavSteps: FC<ITemplateSteps> = ({
  templateSteps,
  currentTemplateStep,
}) => {
  const { setCurrentTemplateStep, buttonsDisabled } =
    useCreateSyndicateContext();

  const router = useRouter();

  useEffect(() => {
    let string = `?step=${slugify(templateSteps?.[currentTemplateStep]?.name, {
      lower: true,
    })}`;

    router.push(string);
  }, [currentTemplateStep]);
  return (
    <ol className="space-y-7 overflow-hidden xs:hidden" role="menu">
      {templateSteps.map((step, stepIdx) => {
        const completedStep = stepIdx < currentTemplateStep;
        const activeStep = stepIdx === currentTemplateStep;
        return (
          <div
            key={step.name}
            className={`${
              stepIdx !== templateSteps?.length - 1 ? "pb-10" : ""
            }group relative ${
              stepIdx < 2 ? "cursor-pointer" : "cursor-default"
            }`}
            onClick={(e) => {
              // prevent clicks if the buttons are disabled and processing and done pages
              if (!buttonsDisabled && stepIdx < 2) {
                e.preventDefault();
                setCurrentTemplateStep(stepIdx);
              }
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              // prevent clicks if the buttons are disabled and processing and done pages
              if (!buttonsDisabled && stepIdx < 2) {
                e.preventDefault();
                setCurrentTemplateStep(stepIdx);
              }
            }}
          >
            {stepIdx !== templateSteps?.length - 1 ? (
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
                    stepIdx < 2 ? "group-hover:border-green-light" : ""
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
                    stepIdx < 2 ? "hover:text-white" : ""
                  } sm:text-base ${
                    completedStep || activeStep
                      ? "text-white"
                      : "text-gray-inactiveText"
                  }  leading-7 font-light transition-all `}
                >
                  {step.name}
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </ol>
  );
};

export default TemplateNavSteps;
