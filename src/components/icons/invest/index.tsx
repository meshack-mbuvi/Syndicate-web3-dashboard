import React from 'react';

interface Props {
  height?: number;
  width?: number;
  textColorClass?: string;
  hoverTextColorClass?: string;
  extraClasses?: string;
}

const IconInvest: React.FC<Props> = ({
  height = 16,
  width = 16,
  textColorClass = 'text-gray-syn4',
  hoverTextColorClass = 'text-gray-syn3',
  extraClasses = '',
  ...rest
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`fill-current hover:${hoverTextColorClass} ${textColorClass} ${extraClasses}`}
      {...rest}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.6237 4.34422C9.6237 3.98842 9.91213 3.7 10.2679 3.7H14.3476H14.348C14.7038 3.7 14.9922 3.98842 14.9922 4.34422C14.9922 4.35195 14.9921 4.35965 14.9918 4.36731V8.42426C14.9918 8.78005 14.7034 9.06848 14.3476 9.06848C13.9918 9.06848 13.7033 8.78005 13.7033 8.42426V6.06944L9.36165 10.405C9.08249 10.6842 8.63154 10.6842 8.35238 10.405L5.9974 8.05003L2.21083 11.8438C1.93167 12.1229 1.48072 12.1229 1.20156 11.8438C0.922397 11.5646 0.922397 11.1137 1.20156 10.8345L5.49635 6.53254C5.77551 6.25338 6.22646 6.25338 6.50562 6.53254L8.8606 8.88752L12.7597 4.98843H10.2679C9.91213 4.98843 9.6237 4.70001 9.6237 4.34422Z"
      />
    </svg>
  );
};

export default IconInvest;
