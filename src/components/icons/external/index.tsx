import React from 'react';

interface IIconExternal {
  height?: number;
  width?: number;
  textColorClass?: string;
  hoverTextColorClass?: string;
  extraClasses?: string;
}

const IconExternal: React.FC<IIconExternal> = ({
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
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`fill-current ${textColorClass} hover:${hoverTextColorClass} ${extraClasses}`}
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5126 2.40005L7.39842 7.51438C7.09826 7.81455 7.09777 8.30259 7.39855 8.60324C7.69859 8.90329 8.18674 8.90402 8.48739 8.60324L13.5994 3.4911V5.20081C13.5994 5.5863 13.9129 5.90027 14.2995 5.90027C14.6852 5.90027 14.9994 5.58705 14.9994 5.20081V1.69959C14.9994 1.50696 14.9211 1.33215 14.7945 1.20547C14.6677 1.07864 14.493 1.00015 14.2999 1.00015H10.7988C10.4133 1.00015 10.0993 1.31349 10.0993 1.70008C10.0993 2.08595 10.4126 2.40013 10.7988 2.40013L12.5126 2.40005ZM14.9996 9.39999V6.07252V13.2553C14.9996 14.2189 14.3054 15 13.4479 15H2.5517C1.69467 15 1 14.2173 1 13.2553V2.74473C1 1.78112 1.6942 1 2.5517 1H10.024H6.60001C6.98659 1 7.30005 1.31334 7.30005 1.69993C7.30005 2.08652 6.98659 2.39999 6.60001 2.39999H2.79888C2.57623 2.39999 2.40033 2.60909 2.40033 2.86689V13.133C2.40033 13.3862 2.57879 13.5999 2.79888 13.5999H13.2014C13.424 13.5999 13.5999 13.3908 13.5999 13.133V9.39996C13.5999 9.01337 13.9134 8.6999 14.3 8.6999C14.6865 8.6999 14.9999 9.01337 14.9999 9.39996L14.9996 9.39999Z"
      />
    </svg>
  );
};

export default IconExternal;
