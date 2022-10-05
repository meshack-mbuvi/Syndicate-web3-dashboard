export interface token {
  contractAddress: string;
  logo: string | undefined;
  tokenDecimal: string;
  tokenSymbol?: string;
  tokenBalance: string;
  tokenName: string;
  name?: string;
  icon?: string | undefined;
  tokenValue: number;
  isTransferable?: boolean;
  price?: {
    usd?: number;
  };
}
export interface InitialState {
  tokensResult: token[];
  collectiblesResult: any;
  loading: boolean;
  loadingCollectibles: boolean;
  tokensFetchError: boolean;
  collectiblesFetchError: boolean;
  allCollectiblesFetched: boolean;
  nativeTokenPrice: number;
}

export const initialState: InitialState = {
  tokensResult: [],
  collectiblesResult: [],
  loading: false,
  loadingCollectibles: false,
  tokensFetchError: false,
  collectiblesFetchError: false,
  allCollectiblesFetched: false,
  nativeTokenPrice: 0
};
