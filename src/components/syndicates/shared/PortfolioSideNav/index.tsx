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
  showDotIndicatorLabels = true
}) => {
  return (
    <div className="flex flex-col h-full items-start justify-between pl-7.5">
      <div className="h-1/2 flex flex-col justify-between">
        <div className="flex flex-col">
          <div className="mb-6">
            <NavButton type={NavButtonType.CLOSE} onClick={handleExitClick} />
          </div>
          <NavButton
            type={NavButtonType.VERTICAL}
            handlePrevious={handleBack}
            handleNext={handleNext}
            disabled={nextBtnDisabled}
            currentStep={activeIndex}
          />
        </div>
        {/* setting padding left to 32px to center align dots on nav  */}
        <div style={{ paddingLeft: 21 }}>
          <DotIndicators
            {...{
              options: dotIndicatorOptions,
              activeIndex,
              showDotIndicatorLabels
            }}
          />
        </div>
      </div>
      <div className="flex w-max items-center" style={{ paddingLeft: 5 }}>
        <a href="/">
          <img src="/images/logo.svg" alt="Syndicate Logo" />
        </a>
      </div>
    </div>
  );
};
