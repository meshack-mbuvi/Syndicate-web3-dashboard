export interface InitialState {
  tokensResult: any;
  collectiblesResult: any;
  loading: boolean;
  loadingCollectibles: boolean;
  loadingDemoFloorPrices: boolean;
  tokensFetchError: boolean;
  collectiblesFetchError: boolean;
  allCollectiblesFetched: boolean;
  ethereumTokenPrice: number;
}

export const initialState: InitialState = {
  tokensResult: [],
  collectiblesResult: [],
  loading: false,
  loadingCollectibles: false,
  loadingDemoFloorPrices: false,
  tokensFetchError: false,
  collectiblesFetchError: false,
  allCollectiblesFetched: false,
  ethereumTokenPrice: 0,
};
