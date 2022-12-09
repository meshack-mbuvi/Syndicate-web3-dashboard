/* eslint-disable @next/next/no-html-link-for-pages */
import { NavButton, NavButtonType } from '@/components/buttons/navButton';
import { DotIndicators } from '@/components/dotIndicators';
import React from 'react';

interface IProps {
  activeIndex: number;
  dotIndicatorOptions: string[];
  handleNext: (index?: number) => void;
  handleBack: (index?: number) => void;
  handleExitClick: (event?: any) => void;
  nextBtnDisabled?: boolean;
  showDotIndicatorLabels?: boolean;
  showSideNavButton?: boolean;
  sideNavLogo?: React.ReactElement;
  showDotIndicators?: boolean;
}
/**
 * Left side navigation on the create club page
 */
export const PortfolioSideNav: React.FC<IProps> = ({
  activeIndex,
  dotIndicatorOptions,
  handleExitClick,
  nextBtnDisabled,
  handleBack,
  handleNext,
  showDotIndicatorLabels = true,
  showSideNavButton = true,
  sideNavLogo,
  showDotIndicators = true
}) => {
  return (
    <div className="flex flex-col h-full items-start justify-between pl-7.5">
      <div className="flex flex-col">
        <div className="mb-6">
          <NavButton type={NavButtonType.CLOSE} onClick={handleExitClick} />
        </div>
        {showSideNavButton ? (
          <NavButton
            type={NavButtonType.VERTICAL}
            handlePrevious={handleBack}
            handleNext={handleNext}
            disabled={nextBtnDisabled}
            currentStep={activeIndex}
          />
        ) : null}
      </div>
      {/* setting padding left to 32px to center align dots on nav  */}
      {showDotIndicators ? (
        <div style={{ paddingLeft: 21 }}>
          <DotIndicators
            {...{
              options: dotIndicatorOptions,
              activeIndex,
              showDotIndicatorLabels
            }}
          />
        </div>
      ) : null}
      <div className="flex w-max items-center" style={{ paddingLeft: 5 }}>
        {sideNavLogo ? sideNavLogo : null}
      </div>
    </div>
  );
};
