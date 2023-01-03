import useWindowSize from '@/hooks/useWindowSize';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  options: { icon?: string; title: string; subTitle?: string }[];
  activeIndex?: number;
  disabledIndices?: number[];
  customClasses?: string;
  onClick: (selectedIndex: number) => void;
  transitionDurationOverrideClass?: string;
}

export const DetailedTile: React.FC<Props> = ({
  options,
  activeIndex,
  disabledIndices,
  customClasses,
  onClick,
  transitionDurationOverrideClass = 'duration-500'
}) => {
  const windowSize = useWindowSize();
  const containerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const buttonRefs = useRef<HTMLDivElement[]>([]);
  const [highlightRightOffset, setHighlightRightOffset] = useState(0);
  const [highlightTopOffset, setHighlightTopOffset] = useState(0);
  const initialTransitionClasses = `transition-all ${transitionDurationOverrideClass}`;
  const [transitionClasses, setTransitionClasses] = useState(
    initialTransitionClasses
  );
  const [useFlexLayout, setUseFlexLayout] = useState(true);

  // Helper functions
  const turnOnAnimations = () => {
    setTransitionClasses(initialTransitionClasses);
  };
  const turnOffAnimations = () => {
    setTransitionClasses('');
  };
  const calculateAndSetHighlightOffset = () => {
    const rightContainerPosition: number = containerRef.current
      ? windowSize.width - containerRef.current?.getBoundingClientRect().right
      : 0;
    const rightButtonPosition: number =
      activeIndex !== undefined && buttonRefs.current[activeIndex]
        ? windowSize.width -
          buttonRefs.current[activeIndex].getBoundingClientRect().right
        : 0;
    setHighlightRightOffset(rightButtonPosition - rightContainerPosition);
    const topContainerPosition: number = containerRef.current
      ? containerRef.current.getBoundingClientRect().y
      : 0;
    const topButtonPosition: number = activeIndex
      ? buttonRefs.current[activeIndex].getBoundingClientRect().y
      : topContainerPosition;
    setHighlightTopOffset(topButtonPosition - topContainerPosition);
  };

  useEffect(() => {
    // When the window is resizing we should instantly
    // readjust the highlight ring, i.e without animation
    turnOffAnimations();
    calculateAndSetHighlightOffset();

    // If each button is getting too small we should change
    // the layout
    const numberOfButtons = options.length;
    const containerWidth: number | undefined = containerRef.current
      ? containerRef.current.getBoundingClientRect().width
      : undefined;
    const minimumButtonWidthPx = 240;
    if (
      containerWidth !== undefined &&
      containerWidth / numberOfButtons < minimumButtonWidthPx
    ) {
      // buttons are shrinking too much
      setUseFlexLayout(false);
    } else {
      // use regular layout
      setUseFlexLayout(true);
    }
  }, [windowSize.width]);

  useEffect(() => {
    calculateAndSetHighlightOffset();
  }, [activeIndex, options]);

  const renderedButtons = options.map((option, index) => (
    <React.Fragment key={index}>
      <button
        className={`block h-full transition-opacity border-gray-syn6 text-center p-4`}
        style={{
          width: `${useFlexLayout ? 100 / options.length : '100'}%`
        }}
        // Add each button in a list of refs
        ref={(ref) => {
          // @ts-expect-error TS(2345): Argument of type 'HTMLButtonElement' is not assign... Remove this comment to see the full error message
          if (ref && !buttonRefs.current.includes(ref)) {
            // @ts-expect-error TS(2345): Argument of type 'HTMLButtonElement' is not assign... Remove this comment to see the full error message
            buttonRefs.current.push(ref);
          }
        }}
        onClick={() => {
          if (!disabledIndices || !disabledIndices.includes(index)) {
            onClick(index);
            turnOnAnimations();
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
    </React.Fragment>
  ));

  return (
    <div
      ref={containerRef}
      className={`${customClasses} relative w-full min-h-32 border border-gray-syn6`}
      style={{ borderRadius: '0.3125rem' }}
    >
      {/* Buttons */}
      <div
        className={`${
          useFlexLayout ? 'flex' : ''
        } h-full border-gray-syn6 relative`}
      >
        {renderedButtons}
      </div>

      {/* Highlight ring */}
      <div
        className={`absolute border pointer-events-none border-blue-neptune ${transitionClasses}`}
        style={{
          borderRadius: '0.3125rem',
          top: `calc(${highlightTopOffset}px + -1px)`,
          right: `calc(${highlightRightOffset}px + -1px)`,
          width: `calc(${useFlexLayout ? 100 / options.length : '100'}% + 1px)`,
          height: `calc(${
            useFlexLayout ? '100%' : `${100 / options.length}%`
          } + 1px)`
        }}
      ></div>
    </div>
  );
};
