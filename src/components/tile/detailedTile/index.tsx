import useWindowSize from '@/hooks/useWindowSize';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  options: { icon?: string; title: string; subTitle?: string }[];
  activeIndex?: number;
  disabledIndices?: number[];
  customClasses?: string;
  onClick: (selectedIndex: number) => void;
  transitionDurationOverrideClass?: string;
  minimumButtonWidthPx?: number;
  animateHighlightRing?: boolean;
  alwaysUseHorizontalLayout?: boolean;
}

export const DetailedTile: React.FC<Props> = ({
  options,
  activeIndex,
  disabledIndices,
  customClasses,
  onClick,
  transitionDurationOverrideClass = 'duration-500',
  minimumButtonWidthPx = 240,
  animateHighlightRing = true,
  alwaysUseHorizontalLayout = false
}) => {
  const windowSize = useWindowSize();
  const containerRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const buttonRefs = useRef<HTMLDivElement[]>([]);
  const [highlightRightOffset, setHighlightRightOffset] = useState(0);
  const [highlightTopOffset, setHighlightTopOffset] = useState(0);
  const [highlightHeight, setHighlightHeight] = useState<number | null>(0);
  const initialTransitionClasses = `transition-all ${transitionDurationOverrideClass}`;
  const [transitionClasses, setTransitionClasses] = useState(
    initialTransitionClasses
  );
  const [useHorizontalLayout, setUseHorizontalLayout] = useState(
    alwaysUseHorizontalLayout ? true : false
  );

  // Helper functions
  const turnOnAnimations = () => {
    setTransitionClasses(initialTransitionClasses);
  };
  const turnOffAnimations = () => {
    setTransitionClasses('');
  };
  const calculateAndSetHighlightDimensions = () => {
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
    const topButtonPosition: number =
      activeIndex !== undefined
        ? buttonRefs.current[activeIndex].getBoundingClientRect().y
        : topContainerPosition;
    setHighlightTopOffset(topButtonPosition - topContainerPosition);
    const buttonHeight: number | null =
      activeIndex !== undefined
        ? buttonRefs.current[activeIndex].getBoundingClientRect().height
        : null;
    setHighlightHeight(buttonHeight);
  };

  useEffect(() => {
    // When the window is resizing we should instantly
    // readjust the highlight ring, i.e without animation
    turnOffAnimations();
    calculateAndSetHighlightDimensions();

    // If each button is getting too small we should change
    // the layout
    const numberOfButtons = options.length;
    const containerWidth: number | undefined = containerRef.current
      ? containerRef.current.getBoundingClientRect().width
      : undefined;
    if (
      containerWidth !== undefined &&
      containerWidth / numberOfButtons < minimumButtonWidthPx
    ) {
      // buttons are shrinking too much
      if (!alwaysUseHorizontalLayout) {
        // check if prohibited from changing the layout
        setUseHorizontalLayout(false);
      }
    } else {
      // use regular layout
      setUseHorizontalLayout(true);
    }
  }, [windowSize.width]);

  useEffect(() => {
    calculateAndSetHighlightDimensions();
  }, [activeIndex, options]);

  const renderedButtons = options.map((option, index) => (
    <React.Fragment key={index}>
      <button
        className={`relative block h-full transition-opacity text-center p-4 ${
          animateHighlightRing
            ? 'border-gray-syn6'
            : `border ${
                activeIndex === index
                  ? 'border-blue-neptune'
                  : 'border-transparent'
              }`
        }`}
        style={{
          width: `${useHorizontalLayout ? 100 / options.length : '100'}%`,
          borderRadius: '0.3125rem'
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
        {/* Icon */}
        {option.icon && (
          <img
            src={option.icon}
            alt="Icon"
            className={`w-8 h-8 mx-auto mb-3 ${
              disabledIndices?.includes(index) && 'opacity-50'
            }`}
          />
        )}

        {/* Title */}
        <div
          className={`text-sm mb-0.5 ${
            !option.icon && !option.subTitle && 'text-base'
          } ${disabledIndices?.includes(index) && 'text-gray-syn5'}`}
        >
          {option.title}
        </div>

        {/* Subtitle */}
        {option.subTitle && (
          <div className="text-xs text-gray-syn4">{option.subTitle}</div>
        )}
      </button>

      {/* Border divider */}
      {index !== options.length - 1 && options.length > 1 && (
        <>
          {useHorizontalLayout ? (
            <div
              className="flex-grow relative z-0 py-4"
              style={{
                width: '0px',
                left: '-0.5px'
              }}
            >
              <div
                className="bg-gray-syn6"
                style={{
                  width: '1px',
                  height: '100%'
                }}
              ></div>
            </div>
          ) : (
            <div
              className="bg-red-500 relative z-0 px-4"
              style={{
                height: '0px',
                top: '-0.5px'
              }}
            >
              <div
                className="bg-gray-syn6"
                style={{
                  width: '100%',
                  height: '1px'
                }}
              ></div>
            </div>
          )}
        </>
      )}
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
        className={`flex ${
          useHorizontalLayout ? '' : 'flex-col'
        } h-full border-gray-syn6 relative`}
      >
        {renderedButtons}
      </div>

      {/* Highlight ring */}
      {animateHighlightRing && (
        <div
          className={`absolute border pointer-events-none border-blue-neptune ${transitionClasses}`}
          style={{
            borderRadius: '0.3125rem',
            top: `calc(${highlightTopOffset}px + -1px)`,
            right: `calc(${highlightRightOffset}px + -1px)`,
            width: `calc(${
              useHorizontalLayout ? 100 / options.length : '100'
            }% + 1px)`,
            height: `calc(${
              useHorizontalLayout
                ? '100%'
                : highlightHeight
                ? `${highlightHeight}px`
                : `${100 / options.length}%`
            } + 1px)`
          }}
        ></div>
      )}
    </div>
  );
};
