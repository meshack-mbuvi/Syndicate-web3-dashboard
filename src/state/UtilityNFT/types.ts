export interface Utility {
  image: string;
  role: string;
}

export interface MembershipPass {
  token_id: number;
  claimed: boolean;
  claiming: boolean;
  utility: Utility;
}

export interface UtilityNFT {
  account: string;
  claimAvailable: boolean;
  redemptionToken: string;
  membershipToken: string;
  totalClaims: number;
  nativePrice: string;
  price: number;
  priceUSD: number;
  membershipPasses: MembershipPass[];
}

export const emptyUtilityNFT: UtilityNFT = {
  account: '',
  claimAvailable: false,
  redemptionToken: '',
  membershipToken: '',
  totalClaims: 0,
  nativePrice: '',
  price: 0.0,
  priceUSD: 0,
  membershipPasses: []
};

export const initialState = {
  utilityNFT: emptyUtilityNFT,
  MembershipPass: [],
  Utility: {},
  loading: true
};
