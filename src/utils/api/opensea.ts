import { proxyGet } from ".";

const openSeaBaseURL = "opensea/api/v1";

export const getOpenseaTokens = async (
  address: string,
  contractAddress: string,
  offset?: string,
  limit?: string,
): Promise<any> => {
  const params = {
    owner: address,
    asset_contract_address: contractAddress,
    limit: limit || "50", // in case OpenSea changes the default limit
    offset: offset || 0,
  };

  // This will retrieve all assets regardless of the owner.
  if (!address) delete params.owner;

  const result = await proxyGet("opensea/api/v1/assets", params);

  return result.data;
};

export const getOpenseaFloorPrices = async (slug: string): Promise<any> => {
  const params = {};

  let floor_price;
  try {
    const result = await proxyGet(
      `${openSeaBaseURL}/collection/${slug}/stats`,
      params,
    );
    floor_price = result.data.stats.floor_price;
  } catch {
    floor_price = 0;
  }

  return {
    floorPrice: floor_price || 0,
    slug,
  };
};
