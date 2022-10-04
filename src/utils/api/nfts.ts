import { proxyGet } from '.';
import { TokenDetails } from '@/types/token';
import { AxiosResponse } from 'axios';

export const getNfts = async (
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
  // @ts-expect-error TS(2790): The operand of a 'delete' operator must be optional.
  if (!address) delete params.owner;

  const result = await proxyGet<NftAssetResponse>('nft/assets', params);

  return result.data;
};

export const getNftFloorPrices = async (
  collectionSlug: string,
  chainId: number
): Promise<NftFloorPriceResponse> => {
  const params = {
    collection: collectionSlug,
    chainId
  };

  const result = await proxyGet<NftFloorPriceResponse>(
    `nft/floor_price`,
    params
  );

  return result.data;
};

export const getNftCollection = async (
  tokenAddress: string,
  chainId: number
): Promise<AxiosResponse<TokenDetails>> => {
  return proxyGet<TokenDetails>('nft/collection', {
    contractAddress: tokenAddress,
    chainId: chainId
  });
};

export const getOpenSeaLink = async (
  contractAddress: string,
  chainId: number
): Promise<string> => {
  const params = {
    contractAddress,
    chainId
  };

  const base =
    chainId == 4 ? 'https://testnets.opensea.io' : 'https://opensea.io';

  try {
    const res = await proxyGet<NftCollectionDetailsResponse>(
      '/nft/collection',
      params
    );
    const slug = res.data.slug;
    // @ts-expect-error TS(2322): Type 'string | null' is not assignable to type 'st... Remove this comment to see the full error message
    return slug ? `${base}/collection/${slug}` : null;
  } catch {
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'st... Remove this comment to see the full error message
    return null;
  }
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

interface NftFloorPriceResponse {
  floorPrice: number;
  collectionSlug: string;
}

export interface NftCollectionDetailsResponse {
  contractAddress: string;
  name: string;
  symbol: string;
  logo: string | null;
  slug: string | null;
}
