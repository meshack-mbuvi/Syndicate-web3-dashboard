import React from 'react';

const OnlineIcon: React.FC<{
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  height?: number;
  width?: number;
}> = ({
  fill = '#30E696',
  stroke = 'black',
  strokeWidth = '2',
  width = 16,
  height = 16
}) => {
  return (
    <svg
      width={height}
      height={width}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default OnlineIcon;
