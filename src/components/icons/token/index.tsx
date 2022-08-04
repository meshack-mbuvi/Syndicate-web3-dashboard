import React from 'react';

interface IIconToken {
  height?: number;
  width?: number;
  fill?: string;
  extraClasses?: string;
}

const IconToken: React.FC<IIconToken> = ({
  height = 27,
  width = 27,
  fill = '#646871',
  extraClasses
}) => {
  return (
    <svg className={extraClasses} width={width} height={height} fill="none">
      <circle cx="13.5" cy="13.5" r="12.8" stroke={fill} strokeWidth="1.4" />
      <path
        d="M13.1464 7.10355C13.3417 6.90829 13.6583 6.90829 13.8536 7.10355L19.8964 13.1464C20.0917 13.3417 20.0917 13.6583 19.8964 13.8536L13.8536 19.8964C13.6583 20.0917 13.3417 20.0917 13.1464 19.8964L7.10355 13.8536C6.90829 13.6583 6.90829 13.3417 7.10355 13.1464L13.1464 7.10355Z"
        fill={fill}
      />
    </svg>
  );
};

export default IconToken;
