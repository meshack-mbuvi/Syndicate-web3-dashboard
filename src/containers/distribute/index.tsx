import { BadgeWithOverview } from '@/components/distributions/badgeWithOverview';
import { AppState } from '@/state';
import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TwoColumnLayout from '../twoColumnLayout';
import TokenSelector from './TokenSelector';

const Distribute: FC = () => {
  const {
    assetsSliceReducer: { tokensResult }
  } = useSelector((state: AppState) => state);

  const [tokens, setTokens] = useState([]);

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
        <BadgeWithOverview
          gasEstimate={{
            tokenSymbol: 'ETH',
            tokenAmount: null,
            fiatAmount: null,
            isLoading: true
          }}
        />
      }
    />
  );
};

export default Distribute;
