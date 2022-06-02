import { CtaButton } from '@/components/CTAButton';
import { BadgeWithOverview } from '@/components/distributions/badgeWithOverview';
import { AppState } from '@/state';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TwoColumnLayout from '../twoColumnLayout';
import TokenSelector from './TokenSelector';
import { useRouter } from 'next/router';
import { Status } from '@/state/wallet/types';
import { useIsClubOwner } from '@/hooks/useClubOwner';
import { useDemoMode } from '@/hooks/useDemoMode';

const Distribute: FC = () => {
  const {
    assetsSliceReducer: { tokensResult },
    erc20TokenSliceReducer: { erc20Token },
    web3Reducer: {
      web3: { account, status }
    }
  } = useSelector((state: AppState) => state);

  const { owner, loading } = erc20Token;

  const [tokens, setTokens] = useState([]);

  const router = useRouter();

  const {
    pathname,
    isReady,
    query: { clubAddress }
  } = router;

  const isOwner = useIsClubOwner();
  const isDemoMode = useDemoMode();

  useEffect(() => {
    if (
      loading ||
      !clubAddress ||
      status === Status.CONNECTING ||
      !owner ||
      !isReady
    )
      return;

    if ((pathname.includes('/distribute') && !isOwner) || isDemoMode) {
      router.replace(`/clubs/${clubAddress}`);
    }
  }, [
    owner,
    clubAddress,
    account,
    loading,
    status,
    isReady,
    isOwner,
    pathname,
    isDemoMode,
    router
  ]);

  useEffect(() => {
    const tokens = tokensResult.map(
      ({ tokenBalance, tokenName, tokenSymbol, price, logo }) => {
        return {
          icon: logo,
          name: tokenName,
          symbol: tokenSymbol,
          tokenAmount: tokenBalance,
          fiatAmount:
            parseFloat(Number(price) ? price : price?.usd ?? 0) *
            parseFloat(tokenBalance),
          isEditingInFiat: false
        };
      }
    );
    // .filter((token) => token.fiatAmount !== 0);

    setTokens(tokens);

    return () => {
      setTokens([]);
    };
  }, [tokensResult]);

  return (
    <TwoColumnLayout
      managerSettingsOpen={true}
      leftColumnComponent={
        <div>
          <TokenSelector options={tokens} />
        </div>
      }
      rightColumnComponent={
        <div className="space-y-8">
          <BadgeWithOverview
            gasEstimate={{
              tokenSymbol: 'ETH',
              tokenAmount: null,
              fiatAmount: null,
              isLoading: true
            }}
          />

          <CtaButton disabled={true}>Next, review members</CtaButton>
        </div>
      }
    />
  );
};

export default Distribute;
