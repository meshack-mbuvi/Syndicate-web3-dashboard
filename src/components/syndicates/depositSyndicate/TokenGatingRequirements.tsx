import React from 'react';
import { useDispatch } from 'react-redux';
import { showWalletModal } from '@/state/wallet/actions';

import FadeIn from '@/components/fadeIn/FadeIn';
import { CtaButton } from '@/components/CTAButton';

const TokenGatingRequirements: React.FC<{ gatingRequirementsMet: boolean }> = ({
  gatingRequirementsMet
}): React.ReactElement => {
  const dispatch = useDispatch();
  const connectWallet = () => {
    dispatch(showWalletModal());
  };
  enum TokenRequirementLogic {
    AND = 'AND',
    OR = 'OR'
  }
  // flip this to 'AND' to test AND requirement
  const tokenRequirementLogic = TokenRequirementLogic.OR;

  // placeholder requirements
  // TODO: replace these with actual requirements data
  const requiredTokens = [
    {
      name: 'Rug Radio - Genesis NFT',
      symbol: '',
      logo: '/images/tokenGating/tgPlaceholder1.svg',
      requirementMet: false
    },
    {
      name: 'Gitcoin',
      symbol: 'GTC',
      logo: '/images/tokenGating/tgPlaceholder2.svg',
      requirementMet: false
    }
  ];

  const requiredTokenBalances = [1, 100];
  // using type assertion here to solve an overlap issue since we're hardcoding
  // the value of tokenRequirementLogic.
  const logic = tokenRequirementLogic as TokenRequirementLogic;

  return (
    <FadeIn>
      <div
        className={`space-y-6 pt-6 px-8 pb-8 w-full ${
          gatingRequirementsMet ? 'rounded-2.5xl bg-gray-syn8' : ''
        }`}
      >
        <p className="h4 uppercase text-sm">membership requirements</p>
        <div
          className={`flex flex-col ${
            logic === TokenRequirementLogic.OR ? 'space-y-4' : 'space-y-6'
          }`}
        >
          {requiredTokens.map((token, index) => {
            const { name, symbol, logo, requirementMet } = token;

            const requirementBullet = requirementMet
              ? 'requirementMetRadio.svg'
              : 'requirementNotMetRadio.svg';

            // in case we are on the OR logic and gating requirement is met, we only need
            // to display the token with the requirement met.
            // otherwise we display all tokens.

            if (
              (requirementMet &&
                logic === TokenRequirementLogic.OR &&
                gatingRequirementsMet) ||
              logic === TokenRequirementLogic.AND ||
              (logic === TokenRequirementLogic.OR && !gatingRequirementsMet)
            ) {
              return (
                <div key={index} className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <span>
                      <img
                        src={`/images/tokenGating/${requirementBullet}`}
                        alt=""
                        className="inline"
                      />
                    </span>
                    <span>{`Own ${requiredTokenBalances[index]} `}</span>{' '}
                    <span>
                      <img src={logo} alt="logo" className="inline" />
                    </span>
                    <span>{name}</span>
                    {symbol && <span className="text-gray-syn5">{symbol}</span>}
                  </div>
                  {logic === TokenRequirementLogic.OR &&
                  requiredTokens.length > 1 &&
                  index !== requiredTokens.length - 1 &&
                  !gatingRequirementsMet ? (
                    <p className="h4 uppercase text-sm">or</p>
                  ) : null}
                </div>
              );
            }
          })}
        </div>
        {!gatingRequirementsMet && (
          <div>
            <CtaButton onClick={connectWallet}>
              Connect a different wallet
            </CtaButton>
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export default TokenGatingRequirements;
