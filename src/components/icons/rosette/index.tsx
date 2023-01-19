import React from 'react';

interface Props {
  height?: number;
  width?: number;
  textColorClass?: string;
  hoverTextColorClass?: string;
  extraClasses?: string;
}

const IconRosette: React.FC<Props> = ({
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
      <path d="M12.352 15.2887V10.0986C13.5146 9.04225 14.25 7.50704 14.25 5.80282C14.257 2.59155 11.6726 0 8.49999 0C5.32734 0 2.75 2.59155 2.75 5.80282C2.75 7.54225 3.5134 9.11268 4.72503 10.169V15.2887C4.72503 15.7817 5.01218 16 5.36936 16C5.64251 16 5.84561 15.8592 6.05572 15.6479L8.26887 13.4366C8.37393 13.331 8.45797 13.2958 8.54201 13.2958C8.61905 13.2958 8.7031 13.331 8.80815 13.4366L11.0213 15.6479C11.2384 15.8662 11.4485 16 11.7147 16C12.0719 16 12.352 15.7817 12.352 15.2887ZM8.507 10.2042C6.06973 10.1972 4.16474 8.23944 4.16474 5.80282C4.16474 3.35915 6.06973 1.40141 8.507 1.40141C10.9373 1.40141 12.8423 3.35915 12.8493 5.80282C12.8563 8.23944 10.9373 10.2042 8.507 10.2042Z" />
    </svg>
  );
};

export default IconRosette;
