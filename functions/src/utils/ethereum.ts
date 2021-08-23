const Web3 = require("web3");
const web3 = new Web3(
  `${process.env.NEXT_PUBLIC_INFURA_ENDPOINT}`,
);
const CoinGecko = require("coingecko-api");
const abi = require("human-standard-token-abi");
import { TokenMappings } from "./tokenMappings";

const CoinGeckoClient = new CoinGecko();
const debugging = process.env.NEXT_PUBLIC_DEBUG;

const signatureObjectSchema = {
  messageHash: (value) => /0x[a-z|0-9]+/.test(value),
  v: (value) => /0x[a-z|0-9]{2}/.test(value),
  r: (value) => /0x[a-z|0-9]+/.test(value),
  s: (value) => /0x[a-z|0-9]+/.test(value),
};
const messageSignatureSchema = {
  message: (value) => typeof value === "string",
  signature: (value) => /0x[a-z|0-9]+/.test(value),
};
const validate = (object, schema) =>
  Object.keys(schema)
    .filter((key) => !schema[key](object[key]))
    .map((key) => `${key} is missing or invalid.`);

export async function verifyMessageSignature(data) {
  /**
   * This function receives either of the following paramaters
   * and returns the signing Address of provided message
   * Option 1:
   *  Signature Object
   *  {
   *    messageHash: '0x...',
   *    v: '0x...'
   *    r: '0x..'
   *    s: '0x..'
   * }
   * Option 2:
   *  Message + Signature
   *  {
   *    message: '<Message Text>',
   *    signature: '0x..',
   *    preFixed: true | false
   * }
   * The preFixed parameter is optional because web3.js checks for this.
   * https://github.com/ChainSafe/web3.js/blob/5d027191c5cb7ffbcd44083528bdab19b4e14744/packages/web3-eth-accounts/src/index.js#L343
   */
  const signatureObjectErrors = validate(data, signatureObjectSchema);
  const messageSignatureErrors = validate(data, messageSignatureSchema);

  if (signatureObjectErrors.length == 0) {
    const signingAddress = await web3.accounts.recover(data);
    return { signingAddress };
  } else if (messageSignatureErrors.length == 0) {
    const signingAddress = await web3.accounts.recover(
      data.message,
      data.signature,
    );
    return { signingAddress };
  } else {
    const message = `
    Invalid input use one of the below formats:
    Option #1 {
      messageHash: '0x...',
      v: '0x...'
      r: '0x..'
      s: '0x..'
    }
    Option #2 {
       message: '<Message Text>',
       signature: '0x..',
       preFixed: true | false
    }
    `;
    return { message };
  }
}

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
    name: "",
    symbol: "",
    price: "",
    logo: "",
    decimals: "18",
  };

  try {
    // CoinGecko can only return token details on the main network.
    if (debugging !== "true") {
      const coinInfo = await CoinGeckoClient.coins.fetchCoinContractInfo(
        contractAddress,
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
          decimals,
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
          decimals,
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
