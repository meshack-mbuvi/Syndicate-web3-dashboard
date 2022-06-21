interface Props {
  steps: {
    title: string;
    description?: string | any;
    isInErrorState?: boolean;
  }[];
  alwaysShowDescriptions?: boolean;
  activeIndex: number;
  extraClasses: string;
}

export const StepsOutline: React.FC<Props> = ({
  steps,
  alwaysShowDescriptions,
  activeIndex,
  extraClasses
}) => {
  const transitionStyles = 'transition-all duration-500';
  const dynamicCircleStyles = (step, index) => {
    return `rounded-full h-5 w-5 border-0.5 overflow-hidden ${transitionStyles} ${
      step.isInErrorState && activeIndex >= index
        ? 'border-red-error'
        : activeIndex >= index
        ? 'border-blue-neptune'
        : 'border-gray-syn6'
    } ${
      step.isInErrorState
        ? 'bg-opacity-0'
        : activeIndex > index
        ? 'bg-blue-neptune'
        : 'bg-transparent'
    }`;
  };
  const dynamicCheckmarkIconStyles = (step, index) => {
    return `mx-auto vertically-center ${transitionStyles} ${
      step.isInErrorState
        ? 'opacity-0'
        : activeIndex > index
        ? 'opacity-100'
        : 'opacity-0'
    }`;
  };
  const dynamicLineStyles = (step, index) => {
    return `flex-grow mx-auto w-0.5 ${transitionStyles} ${
      activeIndex > index ? 'bg-blue-neptune' : 'bg-gray-syn6'
    }`;
  };
  const dynamicTitleStyles = (step, index) => {
    return `${transitionStyles} ${
      activeIndex >= index ? 'text-white' : 'text-gray-syn5'
    }`;
  };
  const dynamicDescriptionStyles = (step, index) => {
    return `text-sm ${
      activeIndex >= index ? 'text-gray-syn4' : 'text-gray-syn6'
    } ${transitionStyles} ${
      activeIndex >= index || alwaysShowDescriptions
        ? 'max-h-50 opacity-100'
        : 'max-h-0 opacity-0'
    } overflow-hidden`;
  };

  const renderedSteps = steps.map((step, index) => (
    <div key={index} className="flex space-x-4">
      {/* Circle + line */}
      <div className="flex flex-col">
        {/* Circle */}
        <div className={`${dynamicCircleStyles(step, index)}`}>
          <img
            src={`/images/checkmark-white.svg`}
            alt="Checkmark"
            className={dynamicCheckmarkIconStyles(step, index)}
          />
        </div>

        {/* Line */}
        {index !== steps.length - 1 && (
          <div className={dynamicLineStyles(step, index)} />
        )}
      </div>

      {/* Text */}
      <div className="mb-6">
        <div className={dynamicTitleStyles(step, index)}>{step.title}</div>
        <div className={dynamicDescriptionStyles(step, index)}>
          {step.description}
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <div className={`space-y-0 ${extraClasses}`}>{renderedSteps}</div>
    </>
  );
};
