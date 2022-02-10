import { proxyGet } from ".";

export const getOpenseaTokens = async (
  address: string,
  contractAddress: string,
  offset?: string,
  limit?: string,
): Promise<any> => {
  const result = await proxyGet("opensea/api/v1/assets", {
    owner: address,
    asset_contract_address: contractAddress,
    limit: limit || "50", // in case OpenSea changes the default limit
    offset: offset || 0,
  });

  return result.data;
};
