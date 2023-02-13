import { TokenHoldings } from '@/graphql/types';
import { AppState } from '@/state';
import { TokenReqDetails } from '@/types/modules';
import { isZeroAddress } from '@/utils';
import { getWeiAmount } from '@/utils/conversions';
import { useSelector } from 'react-redux';

export const useMeetsTokenGatedRequirements = (): {
  getTokenReqDetails: (tokenHoldings: TokenHoldings[]) => {
    meetsRequirements: boolean;
    requiredTokenDetails: TokenReqDetails[];
  } | null;
} => {
  const {
    web3Reducer: {
      web3: { web3, account, activeNetwork }
    },
    erc20TokenSliceReducer: { activeModuleDetails }
  } = useSelector((state: AppState) => state);

  const getTokenReqDetails = (
    tokenHoldings: TokenHoldings[]
  ): {
    meetsRequirements: boolean;
    requiredTokenDetails: TokenReqDetails[];
  } | null => {
    if (
      !web3 ||
      !account ||
      !activeNetwork ||
      !tokenHoldings ||
      !activeModuleDetails?.hasActiveModules ||
      !activeModuleDetails?.activeMintModuleReqs
    ) {
      return null;
    }
    const operator =
      activeModuleDetails.activeMintModuleReqs?.requiredTokensLogicalOperator;
    const tokenBalances =
      activeModuleDetails.activeMintModuleReqs?.requiredTokenBalances ?? [];
    const tokenAddresses =
      activeModuleDetails.activeMintModuleReqs?.requiredTokens ?? [];

    let meetsRequirements = operator ?? false;

    if (
      tokenBalances.length > 0 &&
      tokenBalances.length == tokenAddresses.length
    ) {
      const tokensMet: TokenReqDetails[] = [];
      tokenBalances.forEach((balance, i) => {
        const address = tokenAddresses[i];
        const isNativeToken = isZeroAddress(address);
        const tokenDetails = tokenHoldings.find(
          (i) =>
            i.token.address.toLowerCase() ===
            (isNativeToken ? '' : address.toLowerCase())
        );
        const token = tokenDetails?.token;
        const tokenMetRequirements =
          getWeiAmount(
            tokenDetails?.balance.toString() ?? '',
            token?.decimals ?? 18,
            false
          ) >= getWeiAmount(balance.toString(), token?.decimals ?? 18, false);
        if (operator) {
          // Assuming operator being true means AND condition
          meetsRequirements = meetsRequirements && tokenMetRequirements;
        } else {
          meetsRequirements = meetsRequirements || tokenMetRequirements;
        }
        tokensMet.push({
          contractAddress: tokenAddresses[i],
          name: isNativeToken
            ? activeNetwork?.nativeCurrency?.name
            : token?.name,
          symbol: isNativeToken
            ? activeNetwork?.nativeCurrency?.symbol
            : token?.symbol,
          decimals: isNativeToken
            ? activeNetwork?.nativeCurrency?.decimals
            : token?.decimals,
          logo: isNativeToken
            ? activeNetwork?.nativeCurrency?.logo
            : token?.logo,
          requirementMet: tokenMetRequirements ?? false,
          requiredBalance: balance
        } as TokenReqDetails);
      });
      return {
        meetsRequirements,
        requiredTokenDetails: tokensMet
      };
    }
    return { meetsRequirements: false, requiredTokenDetails: [] };
  };

  return { getTokenReqDetails };
};

export default useMeetsTokenGatedRequirements;
