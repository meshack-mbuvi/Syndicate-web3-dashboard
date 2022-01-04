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
  },
  erc721TokenContract: null,
};
