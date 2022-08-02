export interface GasDetails {
  gasMultipler: number;
  nativeTokenPrice: number;
}

export const initialState: {
  gasDetails: GasDetails;
} = {
  gasDetails: {
    gasMultipler: 0,
    nativeTokenPrice: 0
  }
};
