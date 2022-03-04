import { proxyGet } from ".";

export const getEthereumTokenPrice = async () => {
    const result = await proxyGet('etherscan/api', {
        action: "ethprice",
        module: "stats",
    });

    return result.data.result.ethusd;
}

export const getEtherscanTransactionHistory = async (
  address: string,
  contractaddress: string,
) => {
  const result = await proxyGet("etherscan/api", {
    module: "account",
    action: "tokennfttx",
    address,
    contractaddress,
  });

  return result.data.result;
};

export const getEtherscanTokenTransactions = async (address: string) => {
  const result = await proxyGet("etherscan/api", {
    module: "account",
    action: "tokentx",
    address,
  });

  return result.data.result;
};

export const getEthBalance = async (address: string) => {
  const result = await proxyGet("etherscan/api", {
    module: "account",
    action: "balance",
    tag: "latest",
    address,
  });

  return result.data.result;
};