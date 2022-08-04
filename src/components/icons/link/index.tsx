import React from 'react';

interface IIconLink {
  height?: number;
  width?: number;
  fill?: string;
  extraClasses?: string;
}

const IconLink: React.FC<IIconLink> = ({
  height = 28,
  width = 28,
  fill = '#90949E',
  extraClasses
}) => {
  return (
    <svg className={extraClasses} width={width} height={height}>
      <path
        d="M13.835 19.4269L15.5909 17.6484C13.8482 17.5167 12.7127 16.9897 11.8545 16.1334C9.54403 13.8279 9.55723 10.5607 11.8413 8.2816L16.1455 3.98683C18.456 1.69453 21.7039 1.68135 24.0144 3.98683C26.3249 6.2923 26.2985 9.54632 24.0144 11.8254L21.4266 14.4076C21.7963 15.2507 21.8755 16.2256 21.7435 17.0819L25.6251 13.2219C28.7806 10.0601 28.807 5.59407 25.6119 2.39276C22.4036 -0.808561 17.9147 -0.782212 14.746 2.37958L10.2438 6.88514C7.07509 10.0469 7.04869 14.5261 10.257 17.7143C11.0888 18.5443 12.145 19.1371 13.835 19.4269ZM14.165 8.57143L12.4091 10.3499C14.1518 10.4949 15.2873 11.0086 16.1455 11.865C18.456 14.1704 18.4428 17.4376 16.1587 19.7168L11.8413 24.0115C9.54403 26.3038 6.29612 26.317 3.98562 24.0247C1.67512 21.7061 1.68832 18.4652 3.98562 16.1729L6.57338 13.5908C6.2037 12.7608 6.11128 11.7727 6.25651 10.9164L2.37487 14.7765C-0.780617 17.9382 -0.807023 22.4175 2.38807 25.6056C5.59637 28.8069 10.0853 28.7806 13.2408 25.6319L17.7562 21.1132C20.9249 17.9514 20.9513 13.4722 17.743 10.2841C16.9112 9.4541 15.855 8.86126 14.165 8.57143Z"
        fill={fill}
      />
    </svg>
  );
};

export default IconLink;
