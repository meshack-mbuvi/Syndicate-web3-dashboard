import React from 'react';

interface IIconPlus {
  height?: number;
  width?: number;
  fill?: string;
  extraClasses?: string;
}

const IconPlus: React.FC<IIconPlus> = ({
  height = 16,
  width = 16,
  fill = '#4376FF',
  extraClasses = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      // viewBox="0 0 12 12"
      fill="none"
      className={`${extraClasses}`}
    >
      <path
        d="M0 6C0 6.35636 0.298182 6.64727 0.647273 6.64727H5.35273V11.3527C5.35273 11.7018 5.64364 12 6 12C6.35636 12 6.65455 11.7018 6.65455 11.3527V6.64727H11.3527C11.7018 6.64727 12 6.35636 12 6C12 5.64364 11.7018 5.34545 11.3527 5.34545H6.65455V0.647273C6.65455 0.298182 6.35636 0 6 0C5.64364 0 5.35273 0.298182 5.35273 0.647273V5.34545H0.647273C0.298182 5.34545 0 5.64364 0 6Z"
        fill={fill}
      />
    </svg>
  );
};

export default IconPlus;
