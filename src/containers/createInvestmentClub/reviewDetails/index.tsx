import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { AppState } from '@/state';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { animated, useTransition } from 'react-spring';
import ReviewSection from './ReviewSection';
import {
  CreateActiveSteps,
  DetailsSteps
} from '@/context/CreateInvestmentClubContext/steps';
import ConfirmationSection from './ConfirmationSection';
import {
  getCountDownDays,
  getFormattedDateTimeWithTZ
} from '@/utils/dateUtils';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import { CLUB_CREATION_DISCLAIMER_AGREE } from '@/components/amplitude/eventNames';

const ReviewDetails: React.FC = () => {
  const {
    investmentClubName,
    investmentClubSymbol,
    membersCount,
    mintEndTime,
    tokenCap,
    tokenDetails: { depositTokenSymbol, depositTokenLogo }
  } = useSelector((state: AppState) => state.createInvestmentClubSliceReducer);

  const {
    currentStep,
    setCurrentStep,
    setNextBtnDisabled,
    isReviewStep,
    stepsCategories,
    isCreatingInvestmentClub,
    stepsNames,
    setEditingStep
  } = useCreateInvestmentClubContext();

  const [hasCheckedAgreement, setCheckedAgreement] = useState<boolean>(false);

  useEffect(() => {
    if (isReviewStep && !hasCheckedAgreement) {
      setNextBtnDisabled(true);
    } else {
      setNextBtnDisabled(false);
    }

    //temporary solution for edge case of Back button and then review again
    if (!isReviewStep) {
      setCheckedAgreement(false);
    }
  }, [currentStep, setNextBtnDisabled, hasCheckedAgreement]);

  // only showInvestment name & approval at reviewStep
  const showInvestmentName = investmentClubName && isReviewStep;
  const isDetailsCategory =
    currentStep >= stepsCategories.indexOf(CreateActiveSteps.CLUB_DETAILS) &&
    currentStep <= stepsCategories.lastIndexOf(CreateActiveSteps.CLUB_DETAILS);
  const isReviewOrDetails = isDetailsCategory || isReviewStep;

  const showTokenCap =
    isCreatingInvestmentClub &&
    tokenCap &&
    currentStep > stepsNames.indexOf(DetailsSteps.RAISE) &&
    isReviewOrDetails;
  const showMintDate =
    isCreatingInvestmentClub &&
    mintEndTime &&
    currentStep > stepsNames.indexOf(DetailsSteps.DATE) &&
    isReviewOrDetails;
  const showMemberCount =
    isCreatingInvestmentClub &&
    membersCount &&
    currentStep > stepsNames.indexOf(DetailsSteps.MEMBERS_COUNT) &&
    isReviewOrDetails;

  const noContent =
    !showInvestmentName && !showTokenCap && !showMintDate && !showMemberCount;

  const usdcTransition = useTransition(showTokenCap, {
    from: { x: 150 },
    enter: { x: 0 },
    config: { duration: 400 },
    delay: 100
  });

  const handleEditClubName = () => {
    setEditingStep(currentStep);
    setCurrentStep(stepsNames.indexOf(CreateActiveSteps.NAME_AND_IDENTITY));
  };

  const handleEditTokenCap = () => {
    setEditingStep(currentStep);
    setCurrentStep(stepsNames.indexOf(DetailsSteps.RAISE));
  };

  const handleEditMintDate = () => {
    setEditingStep(currentStep);
    setCurrentStep(stepsNames.indexOf(DetailsSteps.DATE));
  };

  const handleEditMembersLimit = () => {
    setEditingStep(currentStep);
    setCurrentStep(stepsNames.indexOf(DetailsSteps.MEMBERS_COUNT));
  };

  const handleCheckedAgreement = () => {
    amplitudeLogger(CLUB_CREATION_DISCLAIMER_AGREE, {
      flow: Flow.CLUB_CREATE
    });
    setCheckedAgreement(!hasCheckedAgreement);
  };

  return (
    <>
      {isReviewOrDetails ? (
        <div className={`w-full ${isReviewStep || noContent ? '' : 'mb-8'}`}>
          <ReviewSection
            isDisplayingSection={showInvestmentName}
            sectionTitle="What should we call this investment club?"
            onClick={handleEditClubName}
          >
            <div className="flex mt-2 text-base">
              <p className="text-white">{investmentClubName}</p>
              <p className="ml-4 text-gray-syn4">
                Club token ✺{investmentClubSymbol}
              </p>
            </div>
          </ReviewSection>
          <ReviewSection
            isDisplayingSection={showTokenCap}
            sectionTitle="What’s the upper limit of the club’s raise?"
            onClick={handleEditTokenCap}
          >
            <div className="flex mt-2 text-base">
              <p className="text-white">
                {floatedNumberWithCommas(
                  tokenCap,
                  depositTokenSymbol === 'ETH'
                )}
              </p>
              {usdcTransition((styles, item) =>
                item ? (
                  <animated.div
                    style={styles}
                    className="ml-4 text-gray-syn4 flex"
                  >
                    <Image
                      src={depositTokenLogo || '/images/token-gray-4.svg'}
                      height={24}
                      width={24}
                    />
                    <p className="ml-2 text-base">{depositTokenSymbol}</p>
                  </animated.div>
                ) : null
              )}
            </div>
          </ReviewSection>
          <ReviewSection
            isDisplayingSection={showMintDate}
            sectionTitle="When will deposits close?"
            onClick={handleEditMintDate}
          >
            <div className="flex mt-2 text-base">
              {!mintEndTime?.mintTime ? (
                <></>
              ) : (
                <p className="text-white mr-4">
                  {mintEndTime?.mintTime === 'Custom'
                    ? getCountDownDays((mintEndTime?.value * 1000).toString())
                    : mintEndTime?.mintTime}
                </p>
              )}
              <p className="text-gray-syn4">
                {getFormattedDateTimeWithTZ(
                  Number(
                    mintEndTime?.value ? mintEndTime?.value * 1000 : new Date()
                  )
                )}
              </p>
            </div>
          </ReviewSection>
          <ReviewSection
            isDisplayingSection={showMemberCount}
            sectionTitle="What’s the maximum number of members?"
            onClick={handleEditMembersLimit}
          >
            <div className="flex mt-2 text-base">
              <p className="text-white">{membersCount}</p>
            </div>
          </ReviewSection>
        </div>
      ) : null}
      {isReviewStep ? (
        <ConfirmationSection
          hasCheckedAgreement={hasCheckedAgreement}
          handleCheckedAgreement={handleCheckedAgreement}
        />
      ) : null}
    </>
  );
};

export default ReviewDetails;
