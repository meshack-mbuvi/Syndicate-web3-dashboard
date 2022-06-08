import { BadgeWithOverview } from '@/components/distributions/badgeWithOverview';
import { useIsClubOwner } from '@/hooks/useClubOwner';
import { useDemoMode } from '@/hooks/useDemoMode';
import { AppState } from '@/state';
import { Status } from '@/state/wallet/types';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TwoColumnLayout from '../twoColumnLayout';
import TokenSelector from './TokenSelector';

const Distribute: FC = () => {
  const {
    distributeTokensReducer: { distributionTokens, gasEstimate, eth },
    erc20TokenSliceReducer: {
      erc20Token: { owner, loading }
    },
    web3Reducer: {
      web3: { account, status }
    }
  } = useSelector((state: AppState) => state);

  const [tokensDetails, setTokensDetails] = useState([]);
  const [ctaButtonDisabled, setCtaButtonDisabled] = useState(true);
  const [sufficientGas, setSufficientGas] = useState(false);

  // Prepare distributions tokens for overview badge
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
    if (distributionTokens.length) {
      setCtaButtonDisabled(false);

      setTokensDetails(
        distributionTokens.map(({ symbol, tokenAmount, fiatAmount, icon }) => ({
          tokenAmount,
          fiatAmount,
          tokenIcon: icon,
          tokenSymbol: symbol,
          isLoading: loading
        }))
      );
    } else {
      setCtaButtonDisabled(true);
    }

    return () => {
      setTokensDetails([]);
      setCtaButtonDisabled(true);
    };
  }, [JSON.stringify(distributionTokens)]);

  // check whether we have sufficient gas for distribution
  useEffect(() => {
    if (
      eth &&
      gasEstimate &&
      +(parseFloat(eth.available) - parseFloat(eth.totalToDistribute)).toFixed(
        5
      ) >= parseFloat(gasEstimate.tokenAmount)
    ) {
      setSufficientGas(true);
    } else {
      setSufficientGas(false);
    }
  }, [JSON.stringify(gasEstimate), JSON.stringify(eth)]);

  const rightColumnComponent = (
    <div className="space-y-8">
      <BadgeWithOverview
        tokensDetails={tokensDetails}
        gasEstimate={gasEstimate}
        isCTADisabled={ctaButtonDisabled || !sufficientGas}
        CTALabel={
          sufficientGas ? 'Next, review members' : 'Insufficient gas reserves'
        }
      />
    </div>
  );

  return (
    <TwoColumnLayout
      managerSettingsOpen={true}
      leftColumnComponent={
        <div className="mt-10 sm:mt-12 md:mt-16">
          <TokenSelector />
        </div>
      }
      rightColumnComponent={
        <div>
          {/* Use this to take up space when the component's position is fixed */}
          <div className="opacity-0 md:opacity-100">{rightColumnComponent}</div>
          {/* Mobile positioning */}
          <div className="fixed bottom-0 left-0 w-full md:hidden">
            {rightColumnComponent}
          </div>
        </div>
      }
    />
  );
};

export default Distribute;
