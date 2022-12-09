import useWindowSize from '@/hooks/useWindowSize';
import { useEffect, useRef, useState } from 'react';

export enum SwitchType {
  REGULAR = 'REGULAR',
  EXPLICIT = 'EXPLICIT'
}

export const Switch = (props: {
  isOn: boolean;
  type?: SwitchType;
  extraClasses?: string;
  onClick: () => void;
}) => {
  const {
    isOn = true,
    type = SwitchType.REGULAR,
    extraClasses = '',
    onClick = () => false
  } = props;
  const windowWidth = useWindowSize().width;
  const [transitionStyles, setTransitionStyles] = useState(
    'transition-all duration-500'
  );
  const [leftOffsetRem, setLeftOffsetRem] = useState(0);
  const pixelsPerRem = 16;
  const containerPaddingRem = 0.14375;
  const containerRef = useRef(null);
  const knobRef = useRef(null);
  useEffect(() => {
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const knobWidth = knobRef.current.getBoundingClientRect().width;
    const offset =
      (containerWidth - knobWidth) / pixelsPerRem - containerPaddingRem * 2;
    setLeftOffsetRem(offset);

    // Dont animate if the window is resizing
    setTransitionStyles('');
  }, [windowWidth]);
  return (
    <button
      ref={containerRef}
      className={`${
        isOn ? 'bg-blue-nasa-flight-cobalt' : 'bg-gray-5'
      } rounded-full cursor-pointer ${transitionStyles} ${extraClasses}`}
      style={{
        width: '3.125rem',
        height: '1.625rem',
        padding: `${containerPaddingRem}rem`
      }}
      onClick={() => {
        onClick();
        setTransitionStyles('transition-all duration-500');
      }}
    >
      {/* Circle knob */}
      <div
        ref={knobRef}
        className={`relative rounded-full bg-white ${transitionStyles}`}
        style={{
          height: '1.25rem',
          width: '1.25rem',
          left: `${isOn ? leftOffsetRem : 0}rem`
        }}
      >
        {/* Icon */}
        {type === SwitchType.EXPLICIT && (
          <img
            src={`/images/${isOn ? 'checkmark-blue' : 'xmark-gray-small'}.svg`}
            alt="extenal-link"
            className="mx-auto vertically-center"
          />
        )}
      </div>
    </button>
  );
};
