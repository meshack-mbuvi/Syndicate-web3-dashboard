export interface InitialState {
  tokensResult: any;
  collectiblesResult: any;
  loading: boolean;
  loadingCollectibles: boolean;
  tokensFetchError: boolean;
  collectiblesFetchError: boolean;
  allCollectiblesFetched: boolean;
  ethereumTokenPrice: number;
  demoFloorPrices: Record<string, number | null>;
}

export const initialState: InitialState = {
  tokensResult: [],
  collectiblesResult: [],
  loading: false,
  loadingCollectibles: false,
  tokensFetchError: false,
  collectiblesFetchError: false,
  allCollectiblesFetched: false,
  ethereumTokenPrice: 0,
  demoFloorPrices: {}
};
