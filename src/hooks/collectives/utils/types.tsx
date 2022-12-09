// We want to be in compliance with opensea standards: https://docs.opensea.io/docs/metadata-standards
export interface CollectiveMetadata {
  name: string;
  symbol: string;
  description: string;
  media: string;
  image?: string; // one of these two will be present, based on video/image file type
  animation_url?: string;
}

export enum TokenMediaType {
  ANIMATION = 'ANIMATION',
  IMAGE = 'IMAGE'
}

export type ICollective = {
  id?: string;
  address: string;
  tokenName: string;
  tokenSymbol: string;
  pricePerNft: number;
  totalClaimed: number;
  totalUnclaimed: number;
  maxTotalSupply: number;
  tokenMedia: string;
  tokenMediaType: TokenMediaType;
  inviteLink: string;
};

export type IGraphCollectiveResponse = {
  contractAddress: string;
  name: string;
  symbol: string;
  mintPrice: string;
  maxTotalSupply: string;
  totalSupply: string;
  nftMetadata: { metadataCid: string };
};

export type IGraphNFTResponse = {
  collective: {
    contractAddress: string;
    name: string;
    symbol: string;
    mintPrice: string;
    maxTotalSupply: string;
    totalSupply: string;
    nftMetadata: { metadataCid: string };
  };
};
