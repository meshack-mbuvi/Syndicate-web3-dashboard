import React from 'react';

interface IIconGrid {
  height?: number;
  width?: number;
  textColorClass?: string;
  extraClasses?: string;
}

const IconGrid: React.FC<IIconGrid> = ({
  height = 24,
  width = 24,
  textColorClass = 'text-white',
  extraClasses = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`fill-current ${textColorClass} ${extraClasses}`}
    >
      <path d="M1.3741 7.37262H6.02878C6.94245 7.37262 7.40288 6.88593 7.40288 5.88213V2.48289C7.40288 1.47909 6.94245 1 6.02878 1H1.3741C0.460432 1 0 1.47909 0 2.48289V5.88213C0 6.88593 0.460432 7.37262 1.3741 7.37262ZM9.97122 7.37262H14.6259C15.5396 7.37262 16 6.88593 16 5.88213V2.48289C16 1.47909 15.5396 1 14.6259 1H9.97122C9.05755 1 8.59712 1.47909 8.59712 2.48289V5.88213C8.59712 6.88593 9.05755 7.37262 9.97122 7.37262ZM1.38849 6.30038C1.13669 6.30038 1.01439 6.1635 1.01439 5.88213V2.48289C1.01439 2.20913 1.13669 2.07224 1.38849 2.07224H6.00719C6.25899 2.07224 6.38849 2.20913 6.38849 2.48289V5.88213C6.38849 6.1635 6.25899 6.30038 6.00719 6.30038H1.38849ZM9.99281 6.30038C9.73381 6.30038 9.61151 6.1635 9.61151 5.88213V2.48289C9.61151 2.20913 9.73381 2.07224 9.99281 2.07224H14.6115C14.8633 2.07224 14.9856 2.20913 14.9856 2.48289V5.88213C14.9856 6.1635 14.8633 6.30038 14.6115 6.30038H9.99281ZM1.3741 15H6.02878C6.94245 15 7.40288 14.5209 7.40288 13.5171V10.1103C7.40288 9.11407 6.94245 8.62738 6.02878 8.62738H1.3741C0.460432 8.62738 0 9.11407 0 10.1103V13.5171C0 14.5209 0.460432 15 1.3741 15ZM9.97122 15H14.6259C15.5396 15 16 14.5209 16 13.5171V10.1103C16 9.11407 15.5396 8.62738 14.6259 8.62738H9.97122C9.05755 8.62738 8.59712 9.11407 8.59712 10.1103V13.5171C8.59712 14.5209 9.05755 15 9.97122 15ZM1.38849 13.9278C1.13669 13.9278 1.01439 13.7909 1.01439 13.5171V10.1179C1.01439 9.8365 1.13669 9.69962 1.38849 9.69962H6.00719C6.25899 9.69962 6.38849 9.8365 6.38849 10.1179V13.5171C6.38849 13.7909 6.25899 13.9278 6.00719 13.9278H1.38849ZM9.99281 13.9278C9.73381 13.9278 9.61151 13.7909 9.61151 13.5171V10.1179C9.61151 9.8365 9.73381 9.69962 9.99281 9.69962H14.6115C14.8633 9.69962 14.9856 9.8365 14.9856 10.1179V13.5171C14.9856 13.7909 14.8633 13.9278 14.6115 13.9278H9.99281Z" />
    </svg>
  );
};

export default IconGrid;