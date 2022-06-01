import React from 'react';

/**
 * Displays a component with title and subtitle text
 * @returns
 */
const DistributionHeader: React.FC<{ titleText; subTitleText }> = ({
  titleText,
  subTitleText
}) => {
  return (
    <div>
      <div className="text-xl">{titleText}</div>
      <div className="text-gray-syn4 body mt-2">{subTitleText}</div>
    </div>
  );
};

export default DistributionHeader;
