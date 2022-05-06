import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const useRugRadioTokenCount: any = (collectiblesResult, refresh) => {
  const {
    web3Reducer: {
      web3: { account }
    },
    initializeContractsReducer: {
      syndicateContracts: { RugClaimModule, RugToken, rugBonusClaimModule }
    }
  } = useSelector((state: AppState) => state);

  const [tokenCount, setTokenCount] = useState({
    totalYieldTokens: 0,
    nextClaimTime: 0,
    totalAvailableToClaim: 0,
    totalBonusToClaim: 0,
    totalClaimedTokens: 0,
    totalGeneratedTokens: 0
  });
  const [loading, setLoading] = useState(true);

  const getTokenProperties = async () => {
    if (!collectiblesResult.length) return;

    const totalClaimedTokens = +getWeiAmount(
      await RugToken.balanceOf(account),
      parseInt(await RugToken.decimals()),
      false
    );

    let totalBonusToClaim = 0;
    let totalYieldTokens = 0;

    await await Promise.all([
      ...collectiblesResult.map(async (collectible) => {
        try {
          const tokenBalance = await RugClaimModule.getClaimAmount(
            collectible.id
          );
          const tokenBonus = await rugBonusClaimModule.getClaimAmount(
            collectible.id
          );

          totalYieldTokens += +tokenBalance;
          totalBonusToClaim += +tokenBonus;
        } catch (error) {
          console.log({ error });
        }
      })
    ]);

    /**
     * Get NFT last claim times in integers
     */
    const lastClaims = await await Promise.all([
      ...collectiblesResult.map(async (collectible) =>
        parseInt(await RugClaimModule.getLastClaimTime(collectible.id))
      )
    ]);

    // Add 24 hours to last claim time
    const nextClaimTime = Math.max(...lastClaims) * 1000 + 24 * 60 * 60 * 1000;

    setTokenCount({
      totalYieldTokens,
      nextClaimTime,
      totalClaimedTokens,
      totalBonusToClaim,
      totalAvailableToClaim: totalYieldTokens + totalBonusToClaim,
      totalGeneratedTokens:
        totalYieldTokens + totalClaimedTokens + totalBonusToClaim
    });
    setLoading(false);
  };

  useEffect(() => {
    if (!collectiblesResult.length) return;

    getTokenProperties();
  }, [account, refresh, JSON.stringify(collectiblesResult)]);

  return {
    loading,
    ...tokenCount
  };
};

export default useRugRadioTokenCount;
