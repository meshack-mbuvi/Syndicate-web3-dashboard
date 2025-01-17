import React from 'react';

interface EyeOpenIcon {
  height?: number;
  width?: number;
  fill?: string;
  extraClasses?: string;
}

const EyeOpenIcon: React.FC<EyeOpenIcon> = ({
  height = 10,
  width = 16,
  fill = 'text-white',
  extraClasses = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 10"
      fill={fill}
      className={`fill-current ${fill} ${
        extraClasses ? extraClasses : extraClasses
      }`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.00295 10C12.7304 10 16 6.18824 16 5C16 3.80588 12.7245 0 8.00295 0C3.33456 0 0 3.80588 0 5C0 6.18824 3.33456 10 8.00295 10ZM8.00295 8.27647C6.16156 8.27647 4.7038 6.78824 4.6979 5C4.692 3.16471 6.16156 1.72353 8.00295 1.72353C9.82663 1.72353 11.3021 3.16471 11.3021 5C11.3021 6.78824 9.82663 8.27647 8.00295 8.27647ZM8.00295 6.18235C8.65806 6.18235 9.20103 5.64706 9.20103 5C9.20103 4.34706 8.65806 3.81176 8.00295 3.81176C7.34194 3.81176 6.79897 4.34706 6.79897 5C6.79897 5.64706 7.34194 6.18235 8.00295 6.18235Z" />
    </svg>
  );
};

export default EyeOpenIcon;
