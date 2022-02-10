import { AppState } from "@/state";
import { getWeiAmount } from "@/utils/conversions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useRugRadioTokenCount: any = (collectiblesResult, refresh) => {
  const {
    web3Reducer: {
      web3: { account },
    },
    initializeContractsReducer: {
      syndicateContracts: { RugClaimModule, RugToken },
    },
  } = useSelector((state: AppState) => state);

  const [tokenCount, setTokenCount] = useState({
    nextClaimTime: 0,
    totalAvailableToClaim: 0,
    totalClaimedTokens: 0,
    totalGeneratedTokens: 0,
  });
  const [loading, setLoading] = useState(true);

  const getTokenProperties = async () => {
    if (!collectiblesResult.length) return;

    const totalClaimedTokens = +getWeiAmount(
      await RugToken.balanceOf(account),
      parseInt(await RugToken.decimals()),
      false,
    );

    let totalAvailableToClaim = 0;

    await await Promise.all([
      ...collectiblesResult.map(async (collectible) => {
        try {
          const tokenBalance =
            (await RugClaimModule.getClaimAmount(collectible.id)) || 0;

          totalAvailableToClaim += +tokenBalance;
        } catch (error) {
          console.log({ error });
        }
        return totalAvailableToClaim;
      }),
    ]);

    /**
     * Get NFT last claim times in integers
     */
    const lastClaims = await await Promise.all([
      ...collectiblesResult.map(async (collectible) =>
        parseInt(await RugClaimModule.getLastClaimTime(collectible.id)),
      ),
    ]);

    // Add 24 hours to last claim time
    const nextClaimTime = Math.max(...lastClaims) * 1000 + 24 * 60 * 60 * 1000;

    setTokenCount({
      nextClaimTime,
      totalClaimedTokens,
      totalAvailableToClaim: totalAvailableToClaim ?? 0,
      totalGeneratedTokens: +totalAvailableToClaim + +totalClaimedTokens,
    });
    setLoading(false);
  };

  useEffect(() => {
    if (!collectiblesResult.length) return;

    getTokenProperties();
  }, [account, refresh, JSON.stringify(collectiblesResult)]);

  return {
    loading,
    ...tokenCount,
  };
};

export default useRugRadioTokenCount;
