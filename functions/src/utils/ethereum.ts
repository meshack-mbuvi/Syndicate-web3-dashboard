const Web3 = require('web3');
const web3 = new Web3(`${process.env.NEXT_PUBLIC_ALCHEMY}`);
const CoinGecko = require('coingecko-api');
const abi = require('human-standard-token-abi');

import { TokenMappings } from './tokenMappings';

const CoinGeckoClient = new CoinGecko();
const debugging = process.env.NEXT_PUBLIC_DEBUG;

export async function getCoinFromContractAddress(contractAddress) {
  if (!contractAddress) return;
  /**
   * This function receives the contractAddress as a parameter
   * and returns the following coin information:
   *  {
   *    "name": "0x",
   *    "symbol": "zrx",
   *    "price": 1.95,
   *    "percentageChange": -0.42862,
   *    "decimals": "18",
   *    "logo":"https://assets.coingecko.com/coins/images/863/large/0x.png?1547034672"
   * }
   */

  const emptyTokenDetails = {
    name: '',
    symbol: '',
    price: '',
    logo: '',
    decimals: '18'
  };

  try {
    // CoinGecko can only return token details on the main network.
    if (debugging !== 'true') {
      const coinInfo = await CoinGeckoClient.coins.fetchCoinContractInfo(
        contractAddress
      );

      if (coinInfo.success) {
        const tokenContract = new web3.eth.Contract(abi, contractAddress);
        // get token decimals since we cannot obtain this value directly from coingecko
        const decimals = await tokenContract.methods.decimals().call();
        return {
          name: coinInfo.data.name,
          symbol: coinInfo.data.symbol?.toUpperCase(),
          price: coinInfo.data.market_data.current_price.usd,
          percentageChange:
            coinInfo.data.market_data.price_change_percentage_24h,
          logo: coinInfo.data.image.large,
          decimals
        };
      } else {
        return emptyTokenDetails;
      }
    } else {
      // for test networks, we'll use the token contract and manual mappings to fetch token details.
      const tokenContract = new web3.eth.Contract(abi, contractAddress);
      const decimals = await tokenContract.methods.decimals().call();
      const symbol = await tokenContract.methods.symbol().call();
      // fetching token details from hard-coded mappings for the rinkeby testnet
      const mappedTokenAddress = Object.keys(TokenMappings).find((key) => {
        return (
          web3.utils.toChecksumAddress(key) ===
          web3.utils.toChecksumAddress(contractAddress)
        );
      });

      // get token logo and other properties
      if (mappedTokenAddress) {
        const { name, price, logo } = TokenMappings[mappedTokenAddress];
        return {
          name,
          symbol,
          price,
          logo,
          decimals
        };
      } else {
        return emptyTokenDetails;
      }
    }
  } catch (error) {
    console.log(error);
    // contract address passed is not a token contract
    return emptyTokenDetails;
  }
}

const getCoinPricesFromCoinGecko = async (contractAddresses) => {
  try {
    const { data } = await CoinGeckoClient.simple.fetchTokenPrice({
      contract_addresses: contractAddresses,
      vs_currencies: 'usd'
    });

    for (const tokenAddress of contractAddresses) {
      if (!(tokenAddress in data)) {
        data[tokenAddress] = { usd: 0 };
      }
    }

    return data;
  } catch (error) {
    throw error;
  }
};

const getCoinPricesFromTokenMappings = async (contractAddresses) => {
  let response = {};
  for (const tokenAddress of contractAddresses) {
    response[tokenAddress] = TokenMappings[tokenAddress]?.price ?? 0;
  }
  return response;
};

export const getCoinPrices =
  debugging === 'true'
    ? getCoinPricesFromTokenMappings
    : getCoinPricesFromCoinGecko;
