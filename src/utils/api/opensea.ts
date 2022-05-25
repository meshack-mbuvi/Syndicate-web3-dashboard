import { proxyGet } from '.';

export const getOpenseaTokens = async (
  address: string,
  contractAddress: string,
  chainId: number,
  offset?: string,
  limit?: string
): Promise<NftAssetResponse> => {
  const params = {
    owner: address,
    asset_contract_address: contractAddress,
    chainId,
    limit: limit || '50', // in case OpenSea changes the default limit
    offset: offset || 0
  };

  // This will retrieve all assets regardless of the owner.
  if (!address) delete params.owner;

  const result = await proxyGet<NftAssetResponse>('nft/assets', params);

  return result.data;
};

export const getOpenseaFloorPrices = async (
  collectionSlug: string,
  chainId: number
): Promise<BackendFloorPriceResponse> => {
  const params = {
    collection: collectionSlug,
    chainId
  };

  const result = await proxyGet<BackendFloorPriceResponse>(
    `nft/floor_price`,
    params
  );

  return result.data;
};

export interface NftAssetResponse {
  assets: Array<Asset>;
  totalCount: number;
  next: string | null;
  previous: string | null;
}

export interface Asset {
  name: string;
  image: string;
  id: string;
  animation: string | null;
  permalink: string | null;
  collection: {
    name: string | null;
    slug: string | null;
    image: string | null;
  };
  description: string | null;
  last_sale: {
    total_price: string;
    payment_token: {
      symbol: string;
      address: string;
      image_url: string;
      name: string;
      decimals: number;
      eth_price: string;
      usd_price: string;
    };
  };
}

interface BackendFloorPriceResponse {
  floorPrice: number;
  collectionSlug: string;
}
