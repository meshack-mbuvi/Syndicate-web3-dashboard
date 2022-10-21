import { AnimatedText } from '@/components/animatedText';
import { DiscordLink } from '@/components/DiscordLink';
import { EmailSupport } from '@/components/emailSupport';
import useWindowSize from '@/hooks/useWindowSize';
import React, { useEffect, useState } from 'react';
import {
  ExternalLinkColor,
  ExternalLinkIcon
} from 'src/components/iconWrappers';
import { useCreateInvestmentClubContext } from '@/context/CreateInvestmentClubContext';
import EstimateGas from '@/components/EstimateGas';
import { ContractMapper } from '@/hooks/useGasDetails';
import { mockERC20Token } from '@/utils/mockdata';
import {
  LogicalOperator,
  TokenGateOption
} from '@/state/createInvestmentClub/types';
import { CTAButton, CTAType } from '@/components/CTAButton';

const GettingStarted: React.FC = () => {
  const { handleNext } = useCreateInvestmentClubContext();
  const { width } = useWindowSize();

  const [firstLineHeight, setFirstLineHeight] = useState(0);
  const [secondLineHeight, setSecondLineHeight] = useState(0);
  const [thirdLineHeight, setThirdLineHeight] = useState(0);

  useEffect(() => {
    const firstStep = document.getElementById('first-step');
    const secondStep = document.getElementById('second-step');
    const thirdStep = document.getElementById('third-step');
    const fourthStep = document.getElementById('fourth-step');

    // Handle the first line height
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const firstBottomOffset = firstStep.getBoundingClientRect().bottom;
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const secondTopOffset = secondStep.getBoundingClientRect().top;
    setFirstLineHeight(secondTopOffset - firstBottomOffset);

    // handle the second line height
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const secondBottomOffset = secondStep.getBoundingClientRect().bottom;
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const thirdTopOffset = thirdStep.getBoundingClientRect().top;
    setSecondLineHeight(thirdTopOffset - secondBottomOffset);

    // handle the third line height
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const thirdBottomOffset = thirdStep.getBoundingClientRect().bottom;
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const fourthTopOffset = fourthStep.getBoundingClientRect().top;
    setThirdLineHeight(fourthTopOffset - thirdBottomOffset);
  }, [width]);

  return (
    <div className="pt-8 pb-6 px-5 rounded-2-half bg-gray-syn8 sm:w-100 mt-8 sm:mt-18">
      <div>
        <div className="mx-5">
          <h4 className="mb-8">Create an investment club</h4>
          <div style={{ marginBottom: 32 }}>
            <ol className="space-y-6 overflow-hidden xs:hidden" role="menu">
              <div className="relative">
                <div
                  className={`ml-px absolute mt-3 top-2 left-2 w-0.5 bg-gray-syn6
                `}
                  style={
                    width < 500
                      ? { height: `${firstLineHeight + 4}px` }
                      : { height: '147px' }
                  }
                  aria-hidden="true"
                />

                <div className="relative flex items-start group">
                  <span className=" h-6 flex items-center" aria-hidden="true">
                    <span
                      className={`relative z-5 w-5 h-5 flex items-center justify-center border-2 rounded-full border-blue
                   `}
                      id="first-step"
                    >
                      <span className="h-full w-full rounded-full" />
                    </span>
                  </span>
                  <span className="ml-4 min-w-0 flex flex-col">
                    <span className="text-white text-base leading-6 font-whyte transition-all">
                      Create on-chain club
                    </span>
                    <p className="text-gray-syn4 text-sm mt-1 leading-5.5">
                      Define the name &#38; rules around your raise that will
                      enable the on-chain cap table
                    </p>
                    <div className="text-blue text-xs mt-3 font-whyte">
                      <EstimateGas
                        contract={ContractMapper.ERC20ClubFactory}
                        args={{
                          clubParams: {
                            clubTokenName: 'Estimate',
                            clubTokenSymbol: 'EST',
                            isNativeDeposit: true,
                            depositToken: mockERC20Token.depositToken,
                            tokenCap: mockERC20Token.maxTotalDeposits,
                            startTime: mockERC20Token.startTime,
                            endTime: mockERC20Token.endTime,
                            membersCount: 99,
                            tokenRules: [
                              {
                                name: 'Token Name',
                                symbol: 'TOKN',
                                quantity: 1,
                                icon: null,
                                chainId: 4,
                                contractAddress: ''
                              }
                            ],
                            tokenGateOption: TokenGateOption.RESTRICTED,
                            logicalOperator: LogicalOperator.OR
                          }
                        }}
                      />
                    </div>
                    <div className="mt-2 text-gray-syn4 text-xs font-whyte font-normal">
                      Create <AnimatedText text={'unlimited clubs for free'} />{' '}
                      on Syndicate. Just pay gas.
                    </div>
                  </span>
                </div>
              </div>
              <div className="relative" style={{ marginTop: '1.25rem' }}>
                <div
                  className={`ml-px absolute mt-3 top-2 left-2 w-0.5 bg-gray-syn6
                `}
                  aria-hidden="true"
                  style={
                    width < 500
                      ? { height: `${secondLineHeight + 4}px` }
                      : { height: '31px' }
                  }
                />

                <div className="relative flex items-start group">
                  <span className=" h-6 flex items-center" aria-hidden="true">
                    <span
                      className={`relative z-5 w-5 h-5 flex items-center justify-center border-2 rounded-full border-gray-syn6
                   `}
                      id="second-step"
                    >
                      <span className="h-full w-full rounded-full" />
                    </span>
                  </span>
                  <span className="ml-4 min-w-0 flex justify-between w-full text-gray-syn5 text-base leading-6 font-whyte transition-all">
                    <span>Form a legal entity</span>
                    <span>Optional</span>
                  </span>
                </div>
              </div>
              <div className="relative">
                <div
                  className={`ml-px absolute mt-3 top-2 left-2 w-0.5 bg-gray-syn6
                `}
                  aria-hidden="true"
                  style={
                    width < 500
                      ? { height: `${thirdLineHeight + 4}px` }
                      : { height: '31px' }
                  }
                />

                <div className="relative flex items-start group">
                  <span className=" h-6 flex items-center" aria-hidden="true">
                    <span
                      className={`relative z-5 w-5 h-5 flex items-center justify-center border-2 rounded-full border-gray-syn6
                   `}
                      id="third-step"
                    >
                      <span className="h-full w-full rounded-full" />
                    </span>
                  </span>
                  <span className="ml-4 min-w-0 flex justify-between w-full text-gray-syn5 text-base leading-6 font-whyte transition-all">
                    <span>Distribute &#38; sign legal agreements</span>
                    <span>Optional</span>
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="relative flex items-start group">
                  <span className=" h-6 flex items-center" aria-hidden="true">
                    <span
                      className={`relative z-5 w-5 h-5 flex items-center justify-center border-2 rounded-full border-gray-syn6
                   `}
                      id="fourth-step"
                    >
                      <span className="h-full w-full rounded-full" />
                    </span>
                  </span>
                  <span className="ml-4 min-w-0 flex flex-col">
                    <span className="text-gray-syn5 text-base leading-6 font-whyte transition-all">
                      Collect funds &#38; invest together!
                    </span>
                  </span>
                </div>
              </div>
            </ol>
          </div>
          <div className="text-sm mb-6 flex flex-row items-center justify-center">
            <a
              href="https://www.notion.so/syndicateprotocol/Syndicate-Terms-of-Service-04674deec934472e88261e861cdcbc7c"
              className="text-gray-syn4 cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>By clicking below, you agree to our Terms of Service </span>
              <ExternalLinkIcon
                iconcolor={ExternalLinkColor.GRAY}
                className={`ml-1 mb-1.5 text-gray-syn4 hover:text-blue w-3.5 h-3.5 inline`}
              />
            </a>
          </div>

          <CTAButton
            type={CTAType.TRANSACTIONAL}
            fullWidth={true}
            onClick={() => {
              // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
              handleNext();
            }}
          >
            Create on-chain club
          </CTAButton>
        </div>
        <div className="mt-10 mb-6 h-px bg-gray-syn6"></div>

        <p className="px-5 text-gray-syn4 text-sm leading-5.5">
          Questions? Contact us at <EmailSupport /> or on <DiscordLink />
        </p>
      </div>
    </div>
  );
};

export default GettingStarted;
