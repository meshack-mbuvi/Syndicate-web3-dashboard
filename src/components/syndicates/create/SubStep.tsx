import React from "react";
import { CheckIcon } from "@heroicons/react/solid";

interface ISubStepProps {
  onClick: (e) => void;
  onKeyDown: (e) => void;
  completedSubStep: boolean;
  activeSubStep: boolean;
  subStep: {
    name: string;
  };
}

const SubStep: React.FC<ISubStepProps> = (props) => {
  const {
    onClick,
    onKeyDown,
    completedSubStep,
    activeSubStep,
    subStep,
  } = props;
  return (
    <div
      className="mt-4"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <span className="group">
        <div className="flex items-start">
          <div
            className="flex-shrink-0 h-5 w-5 relative flex items-center justify-center"
            aria-hidden="true"
          >
            {completedSubStep ? (
              <CheckIcon className="h-full w-full text-green-light group-hover:text-green-light" />
            ) : null}
          </div>
          <p
            className={`${
              activeSubStep ? "text-white" : "text-gray-inactiveText"
            } ml-3 text-sm font-normal hover:text-white`}
          >
            {subStep?.name}
          </p>
        </div>
      </span>
    </div>
  );
};

export default SubStep;
