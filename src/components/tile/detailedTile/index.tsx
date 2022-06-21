import useWindowSize from '@/hooks/useWindowSize';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  options: { icon?: string; title: string; subTitle?: string }[];
  activeIndex: number;
  disabledIndices?: number[];
  customClasses?: string;
  onClick: (selectedIndex: number) => void;
}

export const DetailedTile: React.FC<Props> = ({
  options,
  activeIndex,
  disabledIndices,
  customClasses,
  onClick
}) => {
  const buttonRefs = useRef([]);
  const [highlightDimensions, setHighlightDimensions] = useState({
    x: 0,
    y: 0,
    height: 0
  });
  const [highlightTransitionStyles, setHighlightTransitionStyles] =
    useState('');

  const highlightsContainer = useRef(null);

  // The width at which layout changes
  const mobileBreakpoint = 320;

  // Manually calculated responsive styles:
  // Ideally we should use Tailwind screen presets, but this case
  // needed a more finely calculated width which couldn't be done with
  // presets (i.e responsivelyCalculatedWidth)
  const { width } = useWindowSize();
  const responsivelyCalculatedWidth = `${
    width > mobileBreakpoint ? 100 / options.length : 100
  }%`;
  const responsivelyCalculatedDividers = `${
    width > mobileBreakpoint ? 'divide-x' : 'divide-y'
  }`;
  const responsivelyCalculatedContainerPadding = `${
    width > mobileBreakpoint ? 'py-4' : 'pb-4 px-4'
  }`;
  const responsivelyCalculatedButtonPadding = `${
    width <= mobileBreakpoint && 'pt-4'
  }`;
  const responsivelyCalculatedSpaceBetween = `${
    width <= mobileBreakpoint && 'space-y-4'
  }`;
  const responsivelyCalculatedFlex = `${
    width <= mobileBreakpoint && 'flex-col'
  }`;

  // Calculate the height + left and right offset for the blue highlight
  const calculateHighlightDimensions = (buttonIndex: number) => {
    // Calculate button dimensions
    const buttonX = buttonRefs.current[buttonIndex].getBoundingClientRect().x;
    const buttonY = buttonRefs.current[buttonIndex].getBoundingClientRect().y;
    const buttonHeight =
      buttonRefs.current[buttonIndex].getBoundingClientRect().height;

    // Calculate button container dimensions
    const containerX = highlightsContainer.current.getBoundingClientRect().x;
    const containerY = highlightsContainer.current.getBoundingClientRect().y;

    return {
      x: buttonX - containerX,
      y: buttonY - containerY,
      height: buttonHeight
    };
  };

  useEffect(() => {
    if (activeIndex !== null) {
      setHighlightDimensions(calculateHighlightDimensions(activeIndex));
    }
    setHighlightTransitionStyles('');
  }, [options, width]);

  const renderedButtons = options.map((option, index) => (
    <>
      <button
        className={`h-full transition-opacity border-gray-syn6 inline-block text-center ${
          disabledIndices?.includes(index) && 'cursor-not-allowed'
        } ${responsivelyCalculatedButtonPadding}`}
        style={{ width: responsivelyCalculatedWidth }}
        // Add each button in a list of refs
        ref={(ref) => {
          if (ref && !buttonRefs.current.includes(ref)) {
            buttonRefs.current.push(ref);
          }
        }}
        onClick={() => {
          if (!disabledIndices || !disabledIndices.includes(index)) {
            onClick(index);
            setHighlightDimensions(calculateHighlightDimensions(index));
            setHighlightTransitionStyles('transition-all duration-500');
          }
        }}
      >
        {option.icon && (
          <img
            src={option.icon}
            alt="Icon"
            className={`w-8 h-8 mx-auto mb-3 ${
              disabledIndices?.includes(index) && 'opacity-50'
            }`}
          />
        )}
        <div
          className={`text-sm mb-0.5 ${
            !option.icon && !option.subTitle && 'text-base'
          } ${disabledIndices?.includes(index) && 'text-gray-syn5'}`}
        >
          {option.title}
        </div>
        {option.subTitle && (
          <div className="text-xs text-gray-syn4">{option.subTitle}</div>
        )}
      </button>
    </>
  ));

  return (
    <div
      className={`${customClasses} relative w-full min-h-32 border border-gray-syn6`}
      style={{ borderRadius: '0.3125rem' }}
    >
      {/* Options */}
      <div
        className={`h-full border-gray-syn6 relative transform ${responsivelyCalculatedSpaceBetween} ${responsivelyCalculatedDividers} ${responsivelyCalculatedContainerPadding}`}
      >
        {renderedButtons}
      </div>

      {/* Blue highlight ring */}
      <div
        ref={highlightsContainer}
        className={`absolute w-full h-full left-0 top-0 ${responsivelyCalculatedFlex} ${
          activeIndex === null ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`absolute border border-blue shadow-lg shadow-blue block ${highlightTransitionStyles}`}
          style={{
            width: responsivelyCalculatedWidth,
            borderRadius: '0.3125rem',
            left: `calc(${highlightDimensions.x}px - ${
              width > mobileBreakpoint ? '0rem' : '1rem'
            })`,
            top: `calc(${highlightDimensions.y}px - ${
              width > mobileBreakpoint ? `${1 + 0.125}rem` : '0rem'
            })`,
            height: `calc(${highlightDimensions.height}px + ${
              width > mobileBreakpoint ? `${2 + 0.2}rem` : '1rem'
            })`,
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );
};
