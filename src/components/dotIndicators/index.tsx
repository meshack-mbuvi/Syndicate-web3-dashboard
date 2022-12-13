import { CreateSteps } from '@/context/CreateInvestmentClubContext/steps';
import React, { useEffect, useRef, useState } from 'react';
import TransitionBetweenChildren from '../transition/transitionBetweenChildren';

export enum DotIndicatorsOrientation {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL'
}
interface Props {
  options: CreateSteps[] | string[];
  activeIndex: number;
  customClasses?: string;
  orientation?: DotIndicatorsOrientation;
  showDotIndicatorLabels?: boolean;
}

export const DotIndicators: React.FC<Props> = ({
  options,
  activeIndex,
  customClasses,
  showDotIndicatorLabels = true,
  orientation = DotIndicatorsOrientation.VERTICAL
}) => {
  const containerRef = useRef(null);
  const dotRef = useRef(null);
  const [dotsTopOffset, setDotsTopOffset] = useState(0);
  const [dotsTransitionStyles, setDotsTransitionStyles] = useState(null);
  const animationTimingStyles = 'duration-500 ease-in-out delay-100';

  useEffect(() => {
    // Calculate how much to offset all the dots such that the
    // first dot is at the middle of the option label
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const containerHeight = containerRef.current.getBoundingClientRect().height;

    // hard-coding dot height to 8px to solve an issue with dotRef being reset to null
    // when options value is changed after selecting a different club type
    setDotsTopOffset(containerHeight / 2 - 8 /** dotHeight */ / 2);
  }, [options, activeIndex]);

  useEffect(() => {
    // We don't want the dots to animate to their starting position
    // on the first render. So check that the top offset was calculated
    // correctly before adding transitions
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const containerHeight = containerRef.current.getBoundingClientRect().height;

    // hard-coding dot height to 8px to solve an issue with dotRef being reset to null
    // when options value is changed after selecting a different club type
    if (dotsTopOffset >= containerHeight / 2 - 8 /** dotHeight */ / 2) {
      // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
      setDotsTransitionStyles(`transition-all ${animationTimingStyles}`);
    }
  }, [dotsTopOffset, activeIndex]);

  const renderedVerticalDots = options.map((option, index) => (
    <React.Fragment key={index}>
      {/* Dot */}
      <div
        ref={dotRef}
        className={`rounded-full w-2 h-2 ${
          index === activeIndex ? 'bg-white' : 'bg-gray-syn6'
        } transition-all ${animationTimingStyles}`}
      ></div>
    </React.Fragment>
  ));

  const renderedHorizontalDots = options.map((option, index) => (
    <React.Fragment key={index}>
      {/* Dot */}
      <div
        className={`rounded-full w-2 h-2 ${
          index === activeIndex ? 'bg-white' : 'bg-gray-syn6'
        } transition-all ${animationTimingStyles}`}
      ></div>
    </React.Fragment>
  ));

  return (
    <div
      ref={containerRef}
      className={`flex ${
        orientation === DotIndicatorsOrientation.VERTICAL
          ? 'justify-start'
          : 'justify-end'
      } items-center relative ${customClasses ?? ''}`}
    >
      {/* Vertical dots */}
      <div
        className={`${
          orientation === DotIndicatorsOrientation.VERTICAL ? 'block' : 'hidden'
        } relative space-y-4 ${
          dotsTransitionStyles ? dotsTransitionStyles : 'opacity-0'
        }`}
        // Each label needs to have it's corresponding dot at it's vertical center
        // 1.5rems represents the space between the midpoint of each dot
        style={{
          top: `calc(${activeIndex * -1.5}rem + ${dotsTopOffset}px)`
        }}
      >
        {renderedVerticalDots}
      </div>

      {/* Labels */}
      {showDotIndicatorLabels ? (
        <TransitionBetweenChildren
          visibleChildIndex={activeIndex}
          extraClasses={`w-full ${
            orientation === DotIndicatorsOrientation.HORIZONTAL
              ? 'text-right'
              : 'text-left ml-4'
          }`}
        >
          {options.map((option, index) => {
            return (
              <div
                key={index}
                className="inline uppercase text-sm tracking-wide"
              >
                {option}
              </div>
            );
          })}
        </TransitionBetweenChildren>
      ) : (
        ''
      )}

      {/* Horizontal dots */}
      <div
        className={`${
          orientation === DotIndicatorsOrientation.HORIZONTAL
            ? 'visible'
            : 'hidden'
        } ml-4 flex space-x-4`}
      >
        {renderedHorizontalDots}
      </div>
      <div
        className={`${
          orientation === DotIndicatorsOrientation.VERTICAL
            ? 'visible'
            : 'hidden'
        } inline uppercase text-sm tracking-wide`}
      >
        {typeof options[activeIndex] !== 'string' && options[activeIndex]}
      </div>
    </div>
  );
};
