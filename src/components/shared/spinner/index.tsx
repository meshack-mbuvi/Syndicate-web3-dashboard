import React from 'react';

interface ISpinner {
  height?: string;
  width?: string;
  margin?: string;
  color?: string;
  strokeWidth?: string;
}

export const Spinner: React.FC<ISpinner> = (props) => {
  const {
    margin,
    height = 'h-10',
    width = 'w-10',
    color = 'text-blue',
    strokeWidth = '7'
  } = props;
  return (
    <div
      className={`flex justify-center ${
        margin !== undefined ? margin : 'my-8'
      }`}
    >
      <span className={`${height} ${width}`}>
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className={`spinner stroke-current ${color}`}
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            strokeWidth={strokeWidth}
            className={`${color}`}
          />
        </svg>
      </span>
    </div>
  );
};
