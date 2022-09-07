import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showWalletModal } from '@/state/wallet/actions';
import Image from 'next/image';
import FadeIn from '@/components/fadeIn/FadeIn';
import { CtaButton } from '@/components/CTAButton';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';

const TokenGatingRequirements: React.FC<{ gatingRequirementsMet: boolean }> = ({
  gatingRequirementsMet
}): React.ReactElement => {
  const {
    web3Reducer: {
      web3: { web3 }
    },
    erc20TokenSliceReducer: { activeModuleDetails, tokenGatingDetails }
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const connectWallet = () => {
    dispatch(showWalletModal());
  };

  const requiredTokens =
    activeModuleDetails?.activeMintModuleReqs?.requiredTokens ?? [];
  const requiredLogic =
    activeModuleDetails?.activeMintModuleReqs.requiredTokensLogicalOperator;

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
            !requiredLogic ? 'space-y-4' : 'space-y-6'
          }`}
        >
          {tokenGatingDetails?.requiredTokenDetails.map((token, index) => {
            const {
              name,
              symbol,
              logo,
              requirementMet,
              decimals,
              requiredBalance
            } = token;

            const requirementBullet = requirementMet
              ? 'requirementMetRadio.svg'
              : 'requirementNotMetRadio.svg';

            // in case we are on the OR requiredLogic and gating requirement is met, we only need
            // to display the token with the requirement met.
            // otherwise we display all tokens.

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
                  <span className="pr-2">{`Own ${
                    decimals == null || decimals === 0
                      ? requiredBalance
                      : getWeiAmount(web3, requiredBalance, decimals, false)
                  } `}</span>{' '}
                  <div className="flex items-center shrink-0">
                    <Image
                      src={logo || '/images/token-gray-4.svg'}
                      alt={name}
                      width={30}
                      height={30}
                    />
                  </div>
                  <span>{name}</span>
                  {symbol && <span className="text-gray-syn5">{symbol}</span>}
                </div>
                {!requiredLogic &&
                requiredTokens.length > 1 &&
                index !== requiredTokens.length - 1 &&
                !gatingRequirementsMet ? (
                  <p className="h4 uppercase text-sm">or</p>
                ) : null}
              </div>
            );
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
