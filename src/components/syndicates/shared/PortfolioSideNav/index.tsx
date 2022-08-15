import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NavButton, NavButtonType } from '@/components/buttons/navButton';
import { DotIndicators } from '@/components/dotIndicators';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { CreateActiveSteps } from '@/context/CreateInvestmentClubContext/steps';

/**
 * Left side navigation on the create club page
 */

export const PortfolioSideNav: React.FC = () => {
  const router = useRouter();

  const {
    currentStep,
    handleBack,
    handleNext,
    steps,
    stepsCategories,
    nextBtnDisabled,
    resetCreationStates
  } = useCreateInvestmentClubContext();

  const [currCategory, setCurrentCategory] = useState<CreateActiveSteps>();
  const [uniqueCategories, setUniqueCategories] = useState<CreateActiveSteps[]>(
    []
  );
  const [categoryIndex, setCategoryIndex] = useState(0);

  useEffect(() => {
    const uniqueCategories = stepsCategories.reduce(
      (unique: CreateActiveSteps[], curr) => {
        if (!unique.includes(curr)) {
          unique.push(curr);
        }
        return unique;
      },
      []
    );

    setUniqueCategories(uniqueCategories);
    if (currCategory !== steps[currentStep].category) {
      setCurrentCategory(steps[currentStep].category);
    }
  }, [steps, currentStep, currCategory, stepsCategories]);

  useEffect(() => {
    const index = uniqueCategories.indexOf(currCategory);
    setCategoryIndex(index);
  }, [stepsCategories, currCategory, uniqueCategories]);

  return (
    <div className="flex flex-col h-full items-start justify-between pl-7.5">
      <div className="h-1/2 flex flex-col justify-between">
        <div className="flex flex-col">
          <div className="mb-6">
            <NavButton
              type={NavButtonType.CLOSE}
              onClick={() => {
                router.replace('/');
                resetCreationStates();
              }}
            />
          </div>
          <NavButton
            type={NavButtonType.VERTICAL}
            handlePrevious={handleBack}
            handleNext={handleNext}
            disabled={currentStep === 0 || nextBtnDisabled}
          />
        </div>
        {/* setting padding left to 32px to center align dots on nav  */}
        <div style={{ paddingLeft: 21 }}>
          <DotIndicators
            {...{ options: uniqueCategories, activeIndex: categoryIndex }}
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
