import { TokenGateRule } from '@/state/createInvestmentClub/types';
import { ReducedTokenRule } from '@/types/mixins';
import { getWeiAmount } from '../conversions';

export const RULES_LESS_THAN = 6;
export const validateAndOrderTokenRules = (tokenRules: TokenGateRule[]) => {
  return tokenRules
    .filter((v) => v.name !== null && +v.quantity > 0)
    .sort((a, b) => {
      return BigInt(
        a.contractAddress ?? '0x0000000000000000000000000000000000000000'
      ) >
        BigInt(
          b.contractAddress ?? '0x0000000000000000000000000000000000000000'
        )
        ? 1
        : -1;
    })
    .slice(0, RULES_LESS_THAN);
};

/**
 * assumes '' address should be 0 address to avoid invalid arg err
 * @param tokenRules
 * @returns
 */
export const unzipTokenRules = (tokenRules: TokenGateRule[], web3: any) => {
  return tokenRules.reduce<ReducedTokenRule>(
    (splitRules, value) => {
      if (value.contractAddress == null) {
        return splitRules;
      }
      if (value.contractAddress === '') {
        splitRules['tokenGateTokens'].push(
          '0x0000000000000000000000000000000000000000'
        );
      } else {
        splitRules['tokenGateTokens'].push(value.contractAddress);
      }
      // most ERC-721 contracts don't implement the decimals functions, the
      // specification also allows for returning 0
      if (value.decimals == null || value.decimals === 0) {
        splitRules['tokenGateTokenBalances'].push(value.quantity);
      } else {
        splitRules['tokenGateTokenBalances'].push(
          getWeiAmount(web3, value.quantity.toString(), value.decimals, true)
        );
      }
      return splitRules;
    },
    { tokenGateTokens: [], tokenGateTokenBalances: [] }
  );
};
