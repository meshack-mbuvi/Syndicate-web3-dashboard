import { B3, B4, H4 } from '@/components/typography';
import React, { ReactNode } from 'react';

/**
 * Displays a component with title and subtitle text
 * @returns
 */
const DistributionHeader: React.FC<{
  titleText: ReactNode;
  subTitleText: ReactNode;
}> = ({ titleText, subTitleText }) => {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <H4>{titleText}</H4>
        <B3 extraClasses="text-gray-syn4 mt-2">{subTitleText}</B3>
      </div>
      {/* Mobile */}
      <div className="md:hidden">
        <H4>{titleText}</H4>
        <B4 extraClasses="text-gray-syn4 mt-2">{subTitleText}</B4>
      </div>
    </>
  );
};

export default DistributionHeader;
