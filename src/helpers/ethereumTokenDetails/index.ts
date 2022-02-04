const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();

// get the current price of Ether.
export const getEthereumTokenPrice = async () => {
  const data = await CoinGeckoClient.simple.price({
    ids: ["ethereum"],
    vs_currencies: ["usd"],
  });

  return data;
};
