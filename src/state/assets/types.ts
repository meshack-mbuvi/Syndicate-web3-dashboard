export interface IToken {
  isEditingInFiat?: boolean;
  isLoading?: boolean;
  symbol?: string;
  contractAddress: string;
  logo?: string;
  tokenDecimal: string;
  tokenSymbol?: string;
  tokenBalance: string;
  tokenAmount?: string;
  fiatAmount?: number | string;
  maximumTokenAmount?: string;
  tokenName: string;
  name?: string;
  icon?: string | undefined;
  tokenValue: number;
  isTransferable?: boolean;
  error?: string;
  warning?: string;
  price: {
    usd?: number;
  };
}
export interface InitialState {
  tokensResult: IToken[];
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
