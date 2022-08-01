import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { AppState } from '@/state';
import { format } from 'date-fns';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { animated, useTransition } from 'react-spring';
import AgreementTerms from '@/components/AgreementTerms';

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
    reviewStep,
    setIsEditStep
  } = useCreateInvestmentClubContext();

  const [inlineEditView, setInlineEditView] = useState<string>('');
  const [agreementFirstChecked, setAgreementFirstChecked] =
    useState<boolean>(false);

  useEffect(() => {
    if (currentStep >= 4 && !agreementFirstChecked) {
      setNextBtnDisabled(true);
    } else {
      setNextBtnDisabled(false);
    }

    // temporary solution for edge case of Back button and then review again
    if (currentStep < 4) {
      setAgreementFirstChecked(false);
    }
  }, [currentStep, setNextBtnDisabled, agreementFirstChecked]);

  const showInvestmentName = investmentClubName && currentStep >= 1;
  const showTokenCap = tokenCap && currentStep >= 2;
  const showMintDate = mintEndTime && currentStep >= 3;
  const showMemberCount = membersCount && currentStep >= 4;

  const headerTransitionStyles = {
    from: { opacity: 1, fontSize: '20px', color: '#ffffff', y: 40 },
    enter: { opacity: 1, fontSize: '14px', color: '#90949E', y: 0 },
    config: { duration: 200 }
  };

  const sectionTransitionStyles = {
    from: { y: 40 },
    enter: { y: 0 },
    delay: 400
  };

  const investmentClubHeaderTransition = useTransition(showInvestmentName, {
    ...headerTransitionStyles
  });

  const investmentClubTransition = useTransition(showInvestmentName, {
    ...sectionTransitionStyles
  });

  const tokenCapHeaderTransition = useTransition(showTokenCap, {
    ...headerTransitionStyles
  });

  const tokenCapTransition = useTransition(showTokenCap, {
    ...sectionTransitionStyles
  });

  const mindEndTimeHeaderTransition = useTransition(showMintDate, {
    ...headerTransitionStyles
  });

  const mindEndTimeTransition = useTransition(showMintDate, {
    ...sectionTransitionStyles
  });

  const memberCountHeaderTransition = useTransition(showMemberCount, {
    ...headerTransitionStyles
  });

  const memberCountTransition = useTransition(showMemberCount, {
    ...sectionTransitionStyles
  });

  const usdcTransition = useTransition(showTokenCap, {
    from: { x: 150 },
    enter: { x: 0 },
    config: { duration: 400 },
    delay: 100
  });

  return (
    <>
      <div className="w-full mb-8 sm:mb-12">
        {investmentClubTransition((styles, item) =>
          item ? (
            <animated.div
              className="flex justify-between px-5 py-4"
              style={
                inlineEditView === 'investmentClub' && reviewStep
                  ? {
                      backgroundColor: '#131416',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }
                  : { display: 'inherit' }
              }
              onMouseEnter={() => setInlineEditView('investmentClub')}
              onMouseLeave={() => setInlineEditView('')}
            >
              <animated.div style={styles}>
                <div>
                  {investmentClubHeaderTransition((styles, item) =>
                    item ? (
                      <animated.p
                        style={styles}
                        className="text-sm text-gray-syn4"
                      >
                        What should we call this investment club?
                      </animated.p>
                    ) : null
                  )}
                  <div className="flex mt-2 text-base">
                    <p className="text-white">{investmentClubName}</p>
                    <p className="ml-4 text-gray-syn4">
                      Club token ✺{investmentClubSymbol}
                    </p>
                  </div>
                </div>
              </animated.div>
              {inlineEditView === 'investmentClub' && reviewStep ? (
                <animated.div
                  className="flex items-center"
                  onClick={() => {
                    setCurrentStep(0);
                    setIsEditStep(true);
                  }}
                  style={{ color: '#4376FF', cursor: 'pointer' }}
                >
                  {'Edit'}
                </animated.div>
              ) : null}
            </animated.div>
          ) : null
        )}

        {tokenCapTransition((styles, item) =>
          item ? (
            <animated.div
              className="flex justify-between px-5 py-4"
              style={
                inlineEditView === 'tokenCap' && reviewStep
                  ? {
                      backgroundColor: '#131416',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }
                  : { display: 'inherit' }
              }
              onMouseEnter={() => setInlineEditView('tokenCap')}
              onMouseLeave={() => setInlineEditView('')}
            >
              <animated.div style={styles}>
                <div>
                  {tokenCapHeaderTransition((styles, item) =>
                    item ? (
                      <animated.p style={styles}>
                        What’s the upper limit of the club’s raise?
                      </animated.p>
                    ) : null
                  )}
                  <div className="flex mt-2 text-base">
                    <p className="text-white">
                      {floatedNumberWithCommas(tokenCap, true)}
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
                </div>
              </animated.div>
              {inlineEditView === 'tokenCap' && reviewStep ? (
                <animated.div
                  className="flex items-center"
                  onClick={() => {
                    setCurrentStep(1);
                    setIsEditStep(true);
                  }}
                  style={{ color: '#4376FF', cursor: 'pointer' }}
                >
                  {'Edit'}
                </animated.div>
              ) : null}
            </animated.div>
          ) : null
        )}

        {mindEndTimeTransition((styles, item) =>
          item ? (
            <animated.div
              className="flex justify-between px-5 py-4"
              style={
                inlineEditView === 'mindEnd' && reviewStep
                  ? {
                      backgroundColor: '#131416',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }
                  : { display: 'inherit' }
              }
              onMouseEnter={() => setInlineEditView('mindEnd')}
              onMouseLeave={() => setInlineEditView('')}
            >
              <animated.div style={styles}>
                <div>
                  {mindEndTimeHeaderTransition((styles, item) =>
                    item ? (
                      <animated.p
                        style={styles}
                        className="text-sm text-gray-syn4"
                      >
                        When will deposits close?
                      </animated.p>
                    ) : null
                  )}
                  <div className="flex mt-2 text-base">
                    {!mintEndTime?.mintTime ||
                    mintEndTime?.mintTime === 'Custom' ? (
                      <></>
                    ) : (
                      <p className="text-white mr-4">{mintEndTime?.mintTime}</p>
                    )}
                    <p className="text-white">
                      {format(
                        new Date(
                          mintEndTime?.value
                            ? mintEndTime?.value * 1000
                            : new Date()
                        ),
                        'MMM dd, yyyy, hh:mm b'
                      )}
                    </p>
                  </div>
                </div>
              </animated.div>
              {inlineEditView === 'mindEnd' && reviewStep ? (
                <animated.div
                  className="flex items-center"
                  onClick={() => {
                    setCurrentStep(2);
                    setIsEditStep(true);
                  }}
                  style={{ color: '#4376FF', cursor: 'pointer' }}
                >
                  {'Edit'}
                </animated.div>
              ) : null}
            </animated.div>
          ) : null
        )}

        {memberCountTransition((styles, item) =>
          item ? (
            <animated.div
              className="flex justify-between px-5 py-4"
              style={
                inlineEditView === 'memberCount' && reviewStep
                  ? {
                      backgroundColor: '#131416',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }
                  : { display: 'inherit' }
              }
              onMouseEnter={() => setInlineEditView('memberCount')}
              onMouseLeave={() => setInlineEditView('')}
            >
              <animated.div style={styles}>
                <div>
                  {memberCountHeaderTransition((styles, item) =>
                    item ? (
                      <animated.p
                        style={styles}
                        className="text-sm text-gray-syn4"
                      >
                        What’s the maximum number of members?
                      </animated.p>
                    ) : null
                  )}
                  <div className="flex mt-2 text-base">
                    <p className="text-white">{membersCount}</p>
                  </div>
                </div>
              </animated.div>
              {inlineEditView === 'memberCount' && reviewStep ? (
                <animated.div
                  className="flex items-center"
                  onClick={() => {
                    setCurrentStep(3);
                    setIsEditStep(true);
                  }}
                  style={{ color: '#4376FF', cursor: 'pointer' }}
                >
                  {'Edit'}
                </animated.div>
              ) : null}
            </animated.div>
          ) : null
        )}
      </div>
      {currentStep >= 4 && (
        <div className="w-full mb-36 ml-5">
          <div className="px-5 mb-5 -ml-5">
            <AgreementTerms
              hasAgreed={agreementFirstChecked}
              handleAgreed={() =>
                setAgreementFirstChecked(!agreementFirstChecked)
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewDetails;
