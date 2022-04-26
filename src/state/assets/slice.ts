import { getOpenseaTokens, getOpenseaFloorPrices } from '@/utils/api/opensea';
import { mockCollectiblesResult } from '@/utils/mockdata';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import abi from 'human-standard-token-abi';
import { getWeiAmount } from 'src/utils/conversions';
import { AbiItem } from 'web3-utils';
import { initialState } from './types';
import {
  morseCodeNftsDetails,
  DisplayCriteria
} from '@/containers/layoutWithSyndicateDetails/assets/collectibles/shared/morseCodeNfts';

import {
  getNativeTokenPrice,
  getTokenTransactionHistory,
  getNativeTokenBalance
} from '@/utils/api/transactions';

/** Async thunks */
// ERC20 transactions
export const fetchTokenTransactions = createAsyncThunk(
  'assets/fetchTokenTransactions',
  async (params: any) => {
    const { account, activeNetwork, web3 } = params;
    const response = await Promise.all([
      // ERC20 tokens transactions
      await getTokenTransactionHistory(account, activeNetwork.chainId),
      // ETH balance for owner address
      await getNativeTokenBalance(account, activeNetwork.chainId),
      // ETH price
      await getNativeTokenPrice(activeNetwork.chainId)
    ])
      .then((result) => result)
      .catch(() => []);

    const [erc20TokensResult, nativeBalanceResponse, nativePriceResponse] =
      response;

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
      await Promise.all(fetchTokenBalances(uniquesTokens, account, web3))
    ).filter((token) => +token.tokenBalance > 0);

    // Batch fetch prices from CoinGecko
    const uniqueTokenPrices = await axios
      .get('/.netlify/functions/getCoinPriceByContractAddress', {
        params: {
          contractAddresses: uniqueTokenBalances
            .map((t) => t.contractAddress)
            .join()
        }
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
          tokenValue = 0
        } = value;

        const { logo } = await axios
          .get(
            `/.netlify/functions/getCoinInfoByContractAddress/?contractAddress=${contractAddress}`
          )
          .then((res) => res.data.data)
          .catch(() => ({ logo: '' }));

        return {
          price: uniqueTokenPrices[contractAddress],
          logo,
          tokenDecimal,
          tokenSymbol,
          tokenBalance,
          tokenName,
          tokenValue
        };
      })
    );

    // get native details to append to token details
    const nativeBalance = getWeiAmount(
      nativeBalanceResponse,
      activeNetwork.nativeCurrency.decimals,
      false
    );
    const nativeDetails = {
      price: { usd: nativePriceResponse },
      logo: activeNetwork.logo,
      tokenDecimal: activeNetwork.nativeCurrency.decimals,
      tokenSymbol: activeNetwork.nativeCurrency.symbol,
      tokenBalance: nativeBalance,
      tokenName: activeNetwork.nativeCurrency.name,
      tokenValue: parseFloat(nativePriceResponse) * parseFloat(nativeBalance)
    };

    // add native token details as the first item.
    completeTokensDetails.unshift(nativeDetails);

    return { completeTokensDetails, nativeTokenPrice: nativePriceResponse };
  }
);

// collectibles assets
interface CollectiblesFetchParams {
  account?: string;
  offset: string;
  maxTotalDeposits?: number;
  contractAddress?: string;
  tokenId?: string;
  limit?: string;
  chainId: number;
}

export const fetchCollectibleById = async (
  params: CollectiblesFetchParams
): Promise<any> => {
  const { account, offset, contractAddress, tokenId, chainId } = params;

  try {
    const { assets } = await getOpenseaTokens(
      account,
      contractAddress,
      chainId,
      offset
    );

    return assets.filter((asset) => asset.token_id === tokenId)[0];
  } catch (error) {
    return null;
  }
};

export const fetchCollectiblesTransactions = createAsyncThunk(
  'assets/fetchCollectiblesTransactions',
  async (params: CollectiblesFetchParams) => {
    const {
      account,
      offset,
      maxTotalDeposits,
      contractAddress,
      chainId,
      limit = '20'
    } = params;

    const { assets } = await getOpenseaTokens(
      account,
      contractAddress,
      chainId,
      offset,
      limit
    );

    const collections = [
      ...new Set(assets.map((asset) => asset.collection.slug))
    ];
    const floorPrices = await Promise.all(
      collections.map(async (slug: string) => {
        return await getOpenseaFloorPrices(slug, chainId);
      })
    )
      .then((result) => result)
      .catch(() => []);

    // get last purchase price.
    const lastSale = assets.last_sale;
    const lastPurchasePrice = {
      lastPurchasePriceUSD: 0,
      lastPurchasePriceNative: 0
    };
    if (lastSale) {
      const {
        payment_token: { usd_price, native_price, decimals },
        total_price
      } = lastSale;
      const lastPurchasePriceUSD =
        +usd_price * +getWeiAmount(total_price, decimals, false);
      lastPurchasePrice.lastPurchasePriceUSD = lastPurchasePriceUSD;
      lastPurchasePrice.lastPurchasePriceNative = native_price;
    }

    const allAssets = assets.map((asset) => ({
      name: asset.name,
      image: asset.image_url,
      animation: asset.animation_url,
      permalink: asset.permalink,
      id: asset.token_id,
      collection: asset.collection,
      description: asset.description,
      floorPrice: floorPrices.find(
        (price) => price.slug === asset.collection.slug
      ).floorPrice,
      lastPurchasePrice
    }));

    return { allAssets, maxTotalDeposits };
  }
);

// collectibles needs to be cleared when account is switched.
// this prevents duplicate renders on refetch
export const clearCollectiblesTransactions = createAsyncThunk(
  'assets/clearCollectiblesTransactions',
  async () => []
);

// get unique token contracts from token transactions
const filterByUniqueContractAddress = (tokensList: any[]) => {
  const key = 'contractAddress';
  const uniqueTokensByContractAddress = [
    ...new Map(tokensList.map((item) => [item[key], item])).values()
  ];

  return uniqueTokensByContractAddress;
};

const fetchTokenBalances = (tokensList: any[], account: string, web3: any) => {
  return tokensList.map(async (token) => {
    const tokenCopy = { ...token };
    const { contractAddress, tokenDecimal } = token;

    const tokenContractInstance = new web3.eth.Contract(
      abi as AbiItem[],
      contractAddress
    );

    const accountBalance = await tokenContractInstance.methods
      .balanceOf(account)
      .call();

    const tokenBalance = getWeiAmount(accountBalance, tokenDecimal, false);

    tokenCopy['tokenBalance'] = tokenBalance;
    return tokenCopy;
  });
};

// function to check whether "gift" morse code nft
// should be displayed based on club max total deposits.
const shouldDisplayNFT = (
  displayCriteria: DisplayCriteria,
  maxTotalDeposits: number
): boolean => {
  const { minTotalDeposit, maxTotalDeposit } =
    displayCriteria.clubDepositAmount;

  if (
    +maxTotalDeposits >= minTotalDeposit &&
    +maxTotalDeposits <= maxTotalDeposit
  ) {
    return true;
  } else if (!maxTotalDeposit && +maxTotalDeposits >= minTotalDeposit) {
    return true;
  } else {
    return false;
  }
};

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    setMockTokensResult(state, action) {
      state.tokensResult = action.payload;
    },
    setMockCollectiblesResult(state, action) {
      const isDepositEnabled = action.payload;
      state.collectiblesResult = isDepositEnabled ? [] : mockCollectiblesResult;
      state.nativeTokenPrice = 2396.93;
    }
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
            tokenCopy['tokenValue'] =
              parseFloat(tokenCopy.price?.usd ?? 0) *
              parseFloat(tokenCopy.tokenBalance);
            return tokenCopy;
          }
        );
        // sort the tokens
        const sortedInDescendingOrder = tokensWithValue.sort(
          (a, b) => b.tokenValue - a.tokenValue
        );
        state.tokensResult = sortedInDescendingOrder;
        state.loading = false;
        state.tokensFetchError = false;
        state.nativeTokenPrice = action.payload.nativeTokenPrice;
      })
      .addCase(fetchTokenTransactions.rejected, (state) => {
        state.loading = false;
        state.tokensFetchError = true;
      })
      .addCase(fetchCollectiblesTransactions.pending, (state) => {
        state.loadingCollectibles = true;
      })
      .addCase(fetchCollectiblesTransactions.fulfilled, (state, action) => {
        let result;
        if (action.payload.allAssets.length < 20) {
          state.allCollectiblesFetched = true;

          const morseCodeNfts = morseCodeNftsDetails.map((detail, index) => ({
            name: '',
            image: `/images/morseCodeNfts/${detail.image}`,
            animation: '',
            permalink: '',
            id: index,
            collection: { name: '' },
            description: '',
            floorPrice: '',
            lastPurchasePrice: '',
            display: shouldDisplayNFT(
              detail.displayCriteria,
              action.payload.maxTotalDeposits
            ),
            futureNft: true
          }));

          // adding morse code nfts when we get to the
          // end of the list.
          result = [
            ...state.collectiblesResult,
            ...action.payload.allAssets,
            ...morseCodeNfts.filter((nft) => nft.display === true)
          ];
        } else {
          state.allCollectiblesFetched = false;
          result = [...state.collectiblesResult, ...action.payload.allAssets];
        }

        // unique values only
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
  }
});

export const { setMockTokensResult, setMockCollectiblesResult } =
  assetsSlice.actions;

export default assetsSlice.reducer;
