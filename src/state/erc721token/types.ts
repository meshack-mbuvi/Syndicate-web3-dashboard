import { ERC721Contract } from '@/ClubERC20Factory/ERC721Membership';

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
  nativePrice: string;
  priceUSD: number;
  maxPerAddress: number;
  defaultImage: string;
  amountMinted: number;
}

export const initialState: {
  erc721Token: ERC721Token;
  erc721TokenContract: ERC721Contract | null;
} = {
  erc721Token: {
    name: '',
    owner: '',
    symbol: '',
    address: '',
    currentSupply: 0,
    maxSupply: 0,
    publicSupply: 0,
    rendererAddr: '',
    loading: false,
    mintPrice: 0,
    merkleClaimEnabled: false,
    publicSingleClaimEnabled: false,
    publicUtilityClaimEnabled: false,
    nativePrice: '',
    priceUSD: 0,
    maxPerAddress: 0,
    defaultImage: '',
    amountMinted: 0
  },
  erc721TokenContract: null
};
