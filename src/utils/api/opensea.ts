import { proxyGet } from ".";

export const getOpenseaTokens = async (address: string, redemptionToken: string) => {
    const result = await proxyGet('opensea/api/v1/assets', {
        owner: address,
        asset_contract_address: redemptionToken,
        limit: "50", // in case OpenSea changes the default limit
        offset: 0,
      });

    return result.data;
};
