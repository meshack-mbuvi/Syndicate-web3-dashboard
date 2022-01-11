import { proxyGet } from ".";

export const getEthereumTokenPrice = async () => {
    const result = await proxyGet('etherscan/api', {
        action: "ethprice",
        module: "stats",
    });

    return result.data.result.ethusd;
}