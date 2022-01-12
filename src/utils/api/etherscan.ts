import { proxyGet } from ".";

export const getEthereumTokenPrice = async () => {
    const result = await proxyGet('etherscan/api', {
        action: "ethprice",
        module: "stats",
    });

    return result.data.result.ethusd;
}

export const getEtherscanTransactionHistory = async (address: string, contractaddress: string) => {
    const result = await proxyGet('etherscan/api', {
        module: "account",
        action: "tokennfttx",
        address,
        contractaddress,
    });

    return result.data.result;
};
