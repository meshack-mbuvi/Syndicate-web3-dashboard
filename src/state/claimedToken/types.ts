import { TokensClaimedErc20 } from '@/hooks/data-fetching/thegraph/generated-types';

export type TokenClaimed = Partial<
  TokensClaimedErc20 & {
    claimed: boolean;
  }
>;

export const initialState = {
  isTokenClaimed: <TokenClaimed>{},
  loading: true
};
