import { proxyGet } from '.';

const openSeaBaseURL = 'opensea/api/v1';

export const getOpenseaTokens = async (
  address: string,
  contractAddress: string,
  chainId: number,
  offset?: string,
  limit?: string
): Promise<any> => {
  const params = {
    owner: address,
    asset_contract_address: contractAddress,
    limit: limit || '50', // in case OpenSea changes the default limit
    offset: offset || 0,
    chainId: chainId
  };

  // This will retrieve all assets regardless of the owner.
  if (!address) delete params.owner;

  const result = await proxyGet('opensea/api/v1/assets', params);

  return result.data;
};

export const getOpenseaFloorPrices = async (
  slug: string,
  chainId: number
): Promise<any> => {
  const params = {chainId: chainId};

  let floor_price;
  try {
    const result = await proxyGet<OpenseaStats>(
      `${openSeaBaseURL}/collection/${slug}/stats`,
      params
    );
    floor_price = result.data.stats.floor_price;
  } catch {
    floor_price = 0;
  }

  return {
    floorPrice: floor_price || 0,
    slug
  };
};

interface OpenseaStats {
  stats: {
    one_day_volume: number;
    one_day_change: number;
    one_day_sales: number;
    one_day_average_price: number;
    seven_day_volume: number;
    seven_day_change: number;
    seven_day_sales: number;
    seven_day_average_price: number;
    thirty_day_volume: number;
    thirty_day_change: number;
    thirty_day_sales: number;
    thirty_day_average_price: number;
    total_volume: number;
    total_sales: number;
    total_supply: number;
    count: number;
    num_owners: number;
    average_price: number;
    num_reports: number;
    market_cap: number;
    floor_price: number;
  };
}
