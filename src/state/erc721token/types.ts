export interface ERC721Token {
  name: string;
  owner: string;
  symbol: string;
  address: string;
  currentSupply: number;
  maxSupply: number;
  publicSupply: number;
  rendererAddr: string;
  loading: boolean;
  mintPrice: number;
  merkleClaimEnabled: boolean;
  publicSingleClaimEnabled: boolean;
  publicUtilityClaimEnabled: boolean;
  ethPrice: string;
  priceUSD: number;
  maxPerAddress: number;
  defaultImage: string;
  amountMinted: number;
}

export const initialState: {
  erc721Token: ERC721Token;
  erc721TokenContract: any;
} = {
  erc721Token: {
    name: "",
    owner: "",
    symbol: "",
    address: "",
    currentSupply: 0,
    maxSupply: 0,
    publicSupply: 0,
    rendererAddr: "",
    loading: false,
    mintPrice: 0,
    merkleClaimEnabled: false,
    publicSingleClaimEnabled: false,
    publicUtilityClaimEnabled: false,
    ethPrice: "",
    priceUSD: 0,
    maxPerAddress: 0,
    defaultImage: "",
    amountMinted: 0,
  },
  erc721TokenContract: null,
};
