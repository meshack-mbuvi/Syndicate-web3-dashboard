import { getOpenseaTokens, getOpenseaFloorPrices } from "@/utils/api/opensea";
import { isDev } from "@/utils/environment";
import { mockCollectiblesResult } from "@/utils/mockdata";
import { web3 } from "@/utils/web3Utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import abi from "human-standard-token-abi";
import { getWeiAmount } from "src/utils/conversions";
import { AbiItem } from "web3-utils";
import { initialState } from "./types";
import {
  getEthereumTokenPrice,
  getEtherscanTokenTransactions,
  getEthBalance,
} from "@/utils/api/etherscan";

/** Async thunks */
// ERC20 transactions
export const fetchTokenTransactions = createAsyncThunk(
  "assets/fetchTokenTransactions",
  async (account: string) => {
    const response = await Promise.all([
      // ERC20 tokens transactions
      await getEtherscanTokenTransactions(account),
      // ETH balance for owner address
      await getEthBalance(account),
      // ETH price
      await getEthereumTokenPrice(),
    ])
      .then((result) => result)
      .catch(() => []);

    const [erc20TokensResult, ethBalanceResponse, ethPriceResponse] = response;

    // get relevant token values from each transactions
    const tokenValues = erc20TokensResult.reduce((acc, value) => {
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
          tokenValue = 0,
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
          tokenValue,
        };
      }),
    );

    // get eth details to append to token details
    const ethBalance = getWeiAmount(ethBalanceResponse, 18, false);
    const ethDetails = {
      price: { usd: ethPriceResponse },
      logo: "/images/ethereum-logo.png",
      tokenDecimal: "18",
      tokenSymbol: "ETH",
      tokenBalance: ethBalance,
      tokenName: "Ethereum",
      tokenValue: parseFloat(ethPriceResponse) * parseFloat(ethBalance),
    };

    // add eth details as the first item.
    completeTokensDetails.unshift(ethDetails);

    return { completeTokensDetails, ethereumTokenPrice: ethPriceResponse };
  },
);

// collectibles assets
interface CollectiblesFetchParams {
  account?: string;
  offset: string;
  contractAddress?: string;
  tokenId?: string;
  limit?: string;
}

export const fetchCollectibleById = async (
  params: CollectiblesFetchParams,
): Promise<any> => {
  const { account, offset, contractAddress, tokenId } = params;

  try {
    const { assets } = await getOpenseaTokens(account, contractAddress, offset);

    return assets.filter((asset) => asset.token_id === tokenId)[0];
  } catch (error) {
    return null;
  }
};

export const fetchCollectiblesTransactions = createAsyncThunk(
  "assets/fetchCollectiblesTransactions",
  async (params: CollectiblesFetchParams) => {
    const { account, offset, contractAddress, limit = "20" } = params;

    const { assets } = await getOpenseaTokens(
      account,
      contractAddress,
      offset,
      limit,
    );

    const collections = [
      ...new Set(assets.map((asset) => asset.collection.slug)),
    ];

    const floorPrices = await Promise.all(
      collections.map(async (slug: string) => {
        return await getOpenseaFloorPrices(slug);
      }),
    )
      .then((result) => result)
      .catch(() => []);

    // get last purchase price.
    const lastSale = assets.last_sale;
    const lastPurchasePrice = {
      lastPurchasePriceUSD: 0,
      lastPurchasePriceETH: 0,
    };
    if (lastSale) {
      const {
        payment_token: { usd_price, eth_price, decimals },
        total_price,
      } = lastSale;
      const lastPurchasePriceUSD =
        +usd_price * +getWeiAmount(total_price, decimals, false);
      lastPurchasePrice.lastPurchasePriceUSD = lastPurchasePriceUSD;
      lastPurchasePrice.lastPurchasePriceETH = eth_price;
    }

    return assets.map((asset) => ({
      name: asset.name,
      image: asset.image_url,
      animation: asset.animation_url,
      permalink: asset.permalink,
      id: asset.token_id,
      collection: asset.collection,
      description: asset.description,
      floorPrice: floorPrices.find(
        (price) => price.slug === asset.collection.slug,
      ).floorPrice,
      lastPurchasePrice,
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

    const tokenBalance = getWeiAmount(accountBalance, tokenDecimal, false);

    tokenCopy["tokenBalance"] = tokenBalance;
    return tokenCopy;
  });
};

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    setMockTokensResult(state, action) {
      state.tokensResult = action.payload;
    },
    setMockCollectiblesResult(state, action) {
      const isDepositEnabled = action.payload;
      state.collectiblesResult = isDepositEnabled ? [] : mockCollectiblesResult;
      state.ethereumTokenPrice = 2396.93;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokenTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTokenTransactions.fulfilled, (state, action) => {
        // find token value here

        const tokensWithValue = action.payload.completeTokensDetails.map(
          (token) => {
            const tokenCopy = token;
            tokenCopy["tokenValue"] =
              parseFloat(tokenCopy.price?.usd ?? 0) *
              parseFloat(tokenCopy.tokenBalance);
            return tokenCopy;
          },
        );
        // sort the tokens
        const sortedInDescendingOrder = tokensWithValue.sort(
          (a, b) => b.tokenValue - a.tokenValue,
        );
        state.tokensResult = sortedInDescendingOrder;
        state.loading = false;
        state.tokensFetchError = false;
        state.ethereumTokenPrice = action.payload.ethereumTokenPrice;
      })
      .addCase(fetchTokenTransactions.rejected, (state) => {
        state.loading = false;
        state.tokensFetchError = true;
      })
      .addCase(fetchCollectiblesTransactions.pending, (state) => {
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
      .addCase(fetchCollectiblesTransactions.rejected, (state) => {
        state.collectiblesFetchError = true;
      })
      .addCase(clearCollectiblesTransactions.fulfilled, (state, action) => {
        state.collectiblesResult = action.payload;
        state.loadingCollectibles = false;
        state.collectiblesFetchError = false;
      });
  },
});

export const { setMockTokensResult, setMockCollectiblesResult } =
  assetsSlice.actions;

export default assetsSlice.reducer;
