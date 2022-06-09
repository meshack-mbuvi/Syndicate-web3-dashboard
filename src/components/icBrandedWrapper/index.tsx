import React from 'react';
import { H4 } from '../typography';

interface Props {
  bottomTitle?: string;
  customClasses?: string;
}

export const ICBrandedWrapper: React.FC<Props> = ({
  bottomTitle,
  customClasses,
  children
}) => {
  return (
    <div className={`${customClasses} relative p-8 -m-8`}>
      {/* Top label */}
      <div
        className="absolute z-10 bg-black rounded-full bg-black border-1 border-green-volt text-green-volt left-8 px-3 py-1"
        style={{ top: '-1.1rem' }}
      >
        Start an investment club
      </div>

      {/* Children */}
      <div className="relative z-10">{children}</div>

      {/* Bottom title */}
      <H4
        extraClasses={`absolute z-10 text-green-volt  ${
          bottomTitle && 'bg-black pl-3 -ml-3'
        }`}
        style={{ bottom: '-1rem' }}
      >
        {bottomTitle}
      </H4>

      {/* Wire frame */}
      <div
        className={`absolute z-0 top-0 left-0 h-full ${
          bottomTitle ? 'w-8' : 'w-full'
        } transition-all duration-500 overflow-hidden`}
      >
        {/* Neon */}
        <div
          className={`h-full w-full border-1 border-green-volt ${
            bottomTitle ? 'rounded-l-custom border-r-0' : 'rounded-custom'
          } transition-all delay-300`}
        ></div>
      </div>
    </div>
  );
};
