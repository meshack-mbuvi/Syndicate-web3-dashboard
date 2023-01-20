import { amplitudeLogger, Flow } from '@/components/amplitude';
import { CLUB_CREATION_DISCLAIMER_AGREE } from '@/components/amplitude/eventNames';
import InvestmentClubCTAs from '@/containers/create/shared/controls/investmentClubCTAs';

import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import { AppState } from '@/state';
import {
  LogicalOperator,
  TokenGateOption
} from '@/state/createInvestmentClub/types';
import {
  CreateFlowStepTemplate,
  CreateFlowStepTemplateIconType
} from '@/templates/createFlowStepTemplate';
import {
  getCountDownDays,
  getFormattedDateTimeWithTZ
} from '@/utils/dateUtils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { animated } from 'react-spring';
import AmountToRaise from '../amountToRaise/AmountToRaise';
import ClubNameSelector from '../clubNameSelector';
import MembersCount from '../membersCount';
import Membership from '../membership';
import MintMaxDate from '../mintMaxDate';

const ReviewDetails: React.FC = () => {
  const {
    investmentClubName,
    membersCount,
    mintEndTime,
    tokenCap,
    tokenDetails: { depositTokenSymbol }
  } = useSelector((state: AppState) => state.createInvestmentClubSliceReducer);

  const {
    createInvestmentClubSliceReducer: { investmentClubSymbolPlaceHolder }
  } = useSelector((state: AppState) => state);

  const { currentStep, setNextBtnDisabled, isReviewStep, hasErrors } =
    useCreateInvestmentClubContext();

  const [hasCheckedAgreement, setCheckedAgreement] = useState<boolean>(false);

  useEffect(() => {
    if (isReviewStep && !hasCheckedAgreement) {
      setNextBtnDisabled?.(true);
    } else {
      setNextBtnDisabled?.(false);
    }

    //temporary solution for edge case of Back button and then review again
    if (!isReviewStep) {
      setCheckedAgreement(false);
    }
  }, [currentStep, setNextBtnDisabled, hasCheckedAgreement]);

  const handleCheckedAgreement = (): void => {
    void amplitudeLogger(CLUB_CREATION_DISCLAIMER_AGREE, {
      flow: Flow.CLUB_CREATE
    });
    setCheckedAgreement(!hasCheckedAgreement);
  };

  const { tokenGateOption, tokenRules, logicalOperator } = useSelector(
    (state: AppState) => state.createInvestmentClubSliceReducer
  );

  const tokens = tokenRules.filter((rule) => rule.name);
  return (
    <div className="flex flex-col mt-8 justify-between mx-auto md:w-1/2">
      <CreateFlowStepTemplate
        hideCallouts={true}
        title={'Review'}
        activeInputIndex={0}
        showNextButton={false}
        isNextButtonDisabled={false}
        isReview={true}
        inputs={[
          {
            input: <ClubNameSelector isReview={true} />,
            iconType: CreateFlowStepTemplateIconType.EYE_OPEN,
            label: 'Club name',
            info: 'Your club’s name is stored on-chain, so it’s publicly visible. If you’d prefer to be anonymous, generate a random name.',
            reviewValue: investmentClubName ? (
              <>
                {investmentClubName}{' '}
                <span className="text-gray-syn4 ml-4">
                  ✺{investmentClubSymbolPlaceHolder}
                </span>
              </>
            ) : (
              <div className="text-red-f1-turbo"> This field is required.</div>
            )
          },
          {
            input: <AmountToRaise isReview={true} />,
            label: 'Fundraising goal',
            info: '',
            reviewValue:
              +tokenCap > 0 && depositTokenSymbol ? (
                <>
                  {tokenCap}
                  <span className="text-gray-syn4 ml-2">
                    {depositTokenSymbol}
                  </span>
                </>
              ) : (
                <div className="text-red-f1-turbo">
                  {' '}
                  This field is required.
                </div>
              )
          },
          {
            label: 'When will deposits close?',
            info: '',
            input: <MintMaxDate isReview={true} />,
            reviewValue: (
              <>
                <div className="flex mt-2 text-base">
                  {!mintEndTime?.mintTime ? (
                    <></>
                  ) : (
                    <p className="text-white mr-2">
                      {mintEndTime?.mintTime === 'Custom'
                        ? getCountDownDays(
                            (mintEndTime?.value * 1000).toString()
                          )
                        : mintEndTime?.mintTime}
                    </p>
                  )}
                  <p className="">
                    {getFormattedDateTimeWithTZ(
                      Number(
                        mintEndTime?.value
                          ? mintEndTime?.value * 1000
                          : new Date()
                      )
                    )}
                  </p>
                </div>
              </>
            )
          },
          {
            input: <MembersCount isReview={true} />,
            label: 'What’s the maximum number of members?',
            info: '',
            reviewValue: membersCount ? (
              <>
                <div className="flex mt-2 text-base">
                  <p className="text-white">{membersCount}</p>
                </div>
              </>
            ) : (
              <div className="text-red-f1-turbo">This field is required.</div>
            )
          },
          {
            input: <Membership isReview={true} />,
            label: 'Who is allowed to deposit and become a member?',
            info: '',
            reviewValue:
              tokenGateOption || tokens.length ? (
                <>
                  <div className="text-base text-white w-full">
                    {tokenGateOption === TokenGateOption.UNRESTRICTED ? (
                      <p>{'Anyone with the link'}</p>
                    ) : (
                      <>
                        <div>{'Holders of'}</div>
                        <div className="grid auto-cols-auto sm:flex sm:flex-wrap">
                          {tokens.map((t, i) => {
                            return (
                              <div
                                key={`${t.name}-${i}`}
                                className="flex min-w-0 items-center mt-1"
                              >
                                <div
                                  className={
                                    'flex min-w-0 flex-shrink-1 items-center rounded-full bg-gray-syn8 px-4 py-2 group-hover:bg-black'
                                  }
                                >
                                  <p className="mr-2">{t.quantity}</p>
                                  <div className="relative flex-shrink-0 w-6 h-6">
                                    <Image
                                      layout="fill"
                                      src={t.icon || '/images/token-gray-5.svg'}
                                    />
                                  </div>
                                  <p className="ml-2 shrink-1 truncate overflow-hidden whitespace-nowrap">
                                    {t.name}
                                  </p>
                                </div>
                                {i < tokens.length - 1 ? (
                                  <p className="mr-2 ml-px flex-shrink-0">
                                    {i === 0
                                      ? logicalOperator.toLowerCase()
                                      : LogicalOperator.OR.toLowerCase()}
                                  </p>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-red-f1-turbo">This field is required.</div>
              )
          }
        ]}
      />
      <div className="mb-30 sm:mb-36 sm:px-5 sm:pl-10">
        <div className="flex items-center space-between ">
          <input
            className="self-start bg-transparent rounded focus:ring-offset-0 cursor-pointer"
            onChange={handleCheckedAgreement}
            type="checkbox"
            id="agreementFirst"
            name="agreementFirst"
            checked={hasCheckedAgreement}
          />
          <animated.div
            className="text-xs w-full  text-gray-syn4 leading-4.5 pl-4 cursor-pointer select-none"
            onClick={handleCheckedAgreement}
          >
            <div className="mb-2">
              By accessing or using Syndicate’s app and its protocol, I agree
              that:
            </div>

            <ul className="list-disc list-outside ml-0 pl-6">
              <li>
                I will not violate securities laws by using Syndicate’s app and
                its protocol, and to the extent necessary, will seek legal
                counsel to ensure compliance with securities laws in relevant
                jurisdictions.
              </li>
              <li>
                Any information or documentation provided has not been prepared
                with my specific circumstances in mind and may not be suitable
                for use in my personal circumstances.
              </li>
              <li>
                Syndicate or any of its advisors (including Syndicate’s tax and
                legal advisors) have not provided me any legal advice or other
                professional advice, and no confidential or special relationship
                between me and Syndicate or its affiliates or advisors exists.
              </li>
              <li>
                I will not use Syndicate’s app and its protocol to engage in
                illegal, fraudulent or other wrongful conduct, including but not
                limited to (a) distributing defamatory, obscene or unlawful
                content or content that promotes bigotry, racism, misogyny or
                religious or ethnic hatred, (b) transmitting any information or
                data that infringes any intellectual property rights of any
                third party or that is otherwise libelous, unlawful, or
                tortious, (c) stalking, harassment, or threatening others with
                violence or abuse, or (d) violating any anti-money laundering
                laws, anti-terrorist financing laws, anti-bribery or
                anti-boycott laws, or other applicable laws.
              </li>
            </ul>
          </animated.div>
        </div>
        <div className="w-full mt-8">
          <InvestmentClubCTAs
            disabled={(!hasCheckedAgreement || hasErrors) ?? false}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
