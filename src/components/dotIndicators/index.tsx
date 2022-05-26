import React, { useEffect, useRef, useState } from 'react';
import FadeBetweenChildren from '../fadeBetweenChildren';

export enum DotIndicatorsOrientation {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL'
}

interface Props {
  options: [string];
  activeIndex: number;
  customClasses?: string;
  orientation?: DotIndicatorsOrientation;
}

export const DotIndicators: React.FC<Props> = ({
  options,
  activeIndex,
  customClasses,
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
    const containerHeight = containerRef.current.getBoundingClientRect().height;
    const dotHeight = dotRef.current.getBoundingClientRect().height;
    setDotsTopOffset(containerHeight / 2 - dotHeight / 2);
  }, [options]);

  useEffect(() => {
    // We don't want the dots to animate to their starting position
    // on the first render. So check that the top offset was calculated
    // correctly before adding transitions
    const containerHeight = containerRef.current.getBoundingClientRect().height;
    const dotHeight = dotRef.current.getBoundingClientRect().height;
    if (dotsTopOffset >= containerHeight / 2 - dotHeight / 2) {
      setDotsTransitionStyles(`transition-all ${animationTimingStyles}`);
    }
  }, [dotsTopOffset]);

  const renderedVerticalDots = options.map((option, index) => (
    <>
      {/* Dot */}
      <div
        key={index}
        ref={dotRef}
        className={`rounded-full w-2 h-2 ${
          index === activeIndex ? 'bg-white' : 'bg-gray-syn6'
        } transition-all ${animationTimingStyles}`}
      ></div>
    </>
  ));

  const renderedHorizontalDots = options.map((option, index) => (
    <>
      {/* Dot */}
      <div
        key={index}
        className={`rounded-full w-2 h-2 ${
          index === activeIndex ? 'bg-white' : 'bg-gray-syn6'
        } transition-all ${animationTimingStyles}`}
      ></div>
    </>
  ));

  return (
    <div
      ref={containerRef}
      className={`flex ${
        orientation === DotIndicatorsOrientation.VERTICAL
          ? 'justify-start'
          : 'justify-end'
      } items-center relative ${customClasses}`}
    >
      {/* Vertical dots */}
      <div
        className={`${
          orientation === DotIndicatorsOrientation.VERTICAL ? 'block' : 'hidden'
        } mr-4 relative space-y-4 ${
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
      <FadeBetweenChildren
        visibleChildIndex={activeIndex}
        extraClasses="w-full"
      >
        {options.map((option, index) => {
          return (
            <div
              key={activeIndex}
              className="inline uppercase text-sm tracking-wide"
            >
              {option}
            </div>
          );
        })}
      </FadeBetweenChildren>

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
    </div>
  );
};
