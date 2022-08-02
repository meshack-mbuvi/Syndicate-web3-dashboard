export interface ERC721Collective {
  contractAddress: string;
  ownerAddress: string;
  tokenName: string;
  tokenSymbol: string;
  createdAt: number;
  priceEth: number;
  totalSupply: number;
  totalUnclaimed: number;
  maxTotalSupply: number;
  tokenImage: string;
  maxPerMember: number;
  numOwners: number;
}

export const initialState: {
  erc721Collective: ERC721Collective;
} = {
  erc721Collective: {
    contractAddress: '',
    ownerAddress: '',
    tokenName: '',
    tokenSymbol: '',
    createdAt: 0,
    priceEth: 0,
    totalSupply: 0,
    totalUnclaimed: 0,
    maxTotalSupply: 0,
    tokenImage: '',
    maxPerMember: 0,
    numOwners: 0
  }
};
