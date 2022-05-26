export interface InitialState {
  tokensResult: any;
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
