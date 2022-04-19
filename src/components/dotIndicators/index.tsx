import React, { useEffect, useRef, useState } from 'react';

interface Props {
  options: [string];
  activeIndex: number;
  customClasses?: string;
}

export const DotIndicators: React.FC<Props> = ({
  options,
  activeIndex,
  customClasses
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

  const renderedDots = options.map((option, index) => (
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

  return (
    <div
      ref={containerRef}
      className={`${customClasses} flex space-x-4 items-center relative`}
    >
      <div
        className={`relative space-y-4 ${
          dotsTransitionStyles ? dotsTransitionStyles : 'opacity-0'
        }`}
        // Each label needs to have it's corresponding dot at it's vertical center
        // 1.5rems represents the space between the midpoint of each dot
        style={{
          top: `calc(${activeIndex * -1.5}rem + ${dotsTopOffset}px)`
        }}
      >
        {renderedDots}
      </div>
      <div className="inline uppercase text-sm tracking-wide">
        {options[activeIndex]}
      </div>
    </div>
  );
};
