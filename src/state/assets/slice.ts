import { getEthereumTokenPrice } from "@/helpers/ethereumTokenDetails";
import { isDev } from "@/utils/environment";
import { web3 } from "@/utils/web3Utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import abi from "human-standard-token-abi";
import { getWeiAmount } from "src/utils/conversions";
import { AbiItem } from "web3-utils";
import { initialState } from "./types";

const baseURL = isDev
  ? "https://api-rinkeby.etherscan.io/api"
  : "https://api.etherscan.io/api";

const openSeaBaseURL = isDev
  ? "https://rinkeby-api.opensea.io/api/v1/assets"
  : "https://api.opensea.io/api/v1/assets";
const etherscanAPIKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const openSeaAPIKey = process.env.NEXT_PUBLIC_OPENSEA_API_KEY;

/** Async thunks */
// ERC20 transactions
export const fetchTokenTransactions = createAsyncThunk(
  "assets/fetchTokenTransactions",
  async (account: string) => {
    const response = await Promise.all([
      // ERC20 tokens transactions
      axios.get(`${baseURL}`, {
        params: {
          module: "account",
          action: "tokentx",
          apikey: etherscanAPIKey,
          address: account,
        },
      }),
      // ETH balance for owner address
      axios.get(`${baseURL}`, {
        params: {
          module: "account",
          action: "balance",
          tag: "latest",
          apikey: etherscanAPIKey,
          address: account,
        },
      }),
      // ETH price
      getEthereumTokenPrice(),
    ])
      .then((result) => result)
      .catch(() => []);

    const [erc20TokensResult, ethBalanceResponse, ethPriceResponse] = response;

    // get relevant token values from each transactions
    const tokenValues = erc20TokensResult.data.result.reduce((acc, value) => {
      const { contractAddress, tokenDecimal, tokenName, tokenSymbol } = value;
      acc.push({ contractAddress, tokenDecimal, tokenName, tokenSymbol });
      return acc;
    }, []);

    // get unique token contracts
    const uniquesTokens = filterByUniqueContractAddress(tokenValues);

    // check if account has token balance
    const uniqueTokenBalances = await (
      await Promise.all(fetchTokenBalances(uniquesTokens, account))
    ).filter((token) => +token.tokenBalance > 0);

    // Batch fetch prices from CoinGecko
    const uniqueTokenPrices = await axios
      .get("/.netlify/functions/getCoinPriceByContractAddress", {
        params: {
          contractAddresses: uniqueTokenBalances
            .map((t) => t.contractAddress)
            .join(),
        },
      })
      .then((res) => res.data.data)
      .catch(() => []);

    // get token logo and price from CoinGecko API
    const completeTokensDetails = await Promise.all(
      uniqueTokenBalances.map(async (value) => {
        const {
          contractAddress,
          tokenDecimal,
          tokenSymbol,
          tokenBalance,
          tokenName,
        } = value;

        const { logo } = await axios
          .get(
            `/.netlify/functions/getCoinInfoByContractAddress/?contractAddress=${contractAddress}`,
          )
          .then((res) => res.data.data)
          .catch(() => ({ logo: "" }));

        return {
          price: uniqueTokenPrices[contractAddress],
          logo,
          tokenDecimal,
          tokenSymbol,
          tokenBalance,
          tokenName,
        };
      }),
    );

    // get eth details to append to token details
    const { usd } = ethPriceResponse.data.ethereum;
    const ethBalance = getWeiAmount(ethBalanceResponse.data.result, 18, false);
    const ethDetails = {
      price: usd,
      logo: "/images/ethereum-logo.png",
      tokenDecimal: "18",
      tokenSymbol: "ETH",
      tokenBalance: ethBalance,
      tokenName: "Ethereum",
    };

    // add eth details as the first item.
    completeTokensDetails.unshift(ethDetails);

    return completeTokensDetails;
  },
);

// collectibles assets
interface CollectiblesFetchParams {
  account: string;
  offset: string;
}

export const fetchCollectiblesTransactions = createAsyncThunk(
  "assets/fetchCollectiblesTransactions",
  async (params: CollectiblesFetchParams) => {
    const { account, offset } = params;

    const response = await axios.get(`${openSeaBaseURL}`, {
      headers: { "x-api-key": isDev ? "" : openSeaAPIKey },
      params: {
        // test account on mainnet: 0x6eb534ed1329e991842b55be375abc63fe7c0e2b,
        // test account on rinkeby: 0xf4c2c3e12b61d44e6b228c43987158ac510426fb
        owner: account,
        limit: "20", // in case OpenSea changes the default limit
        offset,
      },
    });

    const { assets } = response.data;

    return assets.map((asset) => ({
      name: asset.name,
      image: asset.image_url,
      animation: asset.animation_url,
      permalink: asset.permalink,
      id: asset.token_id,
    }));
  },
);

// collectibles needs to be cleared when account is switched.
// this prevents duplicate renders on refetch
export const clearCollectiblesTransactions = createAsyncThunk(
  "assets/clearCollectiblesTransactions",
  async () => [],
);

// get unique token contracts from token transactions
const filterByUniqueContractAddress = (tokensList: any[]) => {
  const key = "contractAddress";
  const uniqueTokensByContractAddress = [
    ...new Map(tokensList.map((item) => [item[key], item])).values(),
  ];

  return uniqueTokensByContractAddress;
};

const fetchTokenBalances = (tokensList: any[], account: string) => {
  return tokensList.map(async (token) => {
    const tokenCopy = { ...token };
    const { contractAddress, tokenDecimal } = token;

    const tokenContractInstance = new web3.eth.Contract(
      abi as AbiItem[],
      contractAddress,
    );

    const accountBalance = await tokenContractInstance.methods
      .balanceOf(account)
      .call();

    tokenCopy["tokenBalance"] = getWeiAmount(
      accountBalance,
      tokenDecimal,
      false,
    );

    return tokenCopy;
  });
};

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokenTransactions.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(fetchTokenTransactions.fulfilled, (state, action) => {
        state.tokensResult = action.payload;
        state.loading = false;
        state.tokensFetchError = false;
      })
      .addCase(fetchTokenTransactions.rejected, (state, action) => {
        state.loading = false;
        state.tokensFetchError = true;
      })
      .addCase(fetchCollectiblesTransactions.pending, (state, action) => {
        state.loadingCollectibles = true;
      })
      .addCase(fetchCollectiblesTransactions.fulfilled, (state, action) => {
        if (action.payload.length < 20) {
          state.allCollectiblesFetched = true;
        } else {
          state.allCollectiblesFetched = false;
        }

        // unique values only
        const result = [...state.collectiblesResult, ...action.payload];
        const flag = {};
        const uniqueNfts = [];
        result.forEach((item) => {
          const { id } = item;
          if (!flag[id]) {
            flag[id] = true;
            uniqueNfts.push(item);
          }
        });

        state.collectiblesResult = uniqueNfts;
        state.loadingCollectibles = false;
        state.collectiblesFetchError = false;
      })
      .addCase(fetchCollectiblesTransactions.rejected, (state, action) => {
        state.collectiblesFetchError = true;
      })
      .addCase(clearCollectiblesTransactions.fulfilled, (state, action) => {
        state.collectiblesResult = action.payload;
        state.loadingCollectibles = false;
        state.collectiblesFetchError = false;
      });
  },
});

export default assetsSlice.reducer;
