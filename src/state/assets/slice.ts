import {
  DisplayCriteria,
  morseCodeNftsDetails
} from '@/containers/layoutWithSyndicateDetails/assets/collectibles/shared/morseCodeNfts';
import { getTokenDetails } from '@/utils/api';
import { getNftFloorPrices, getNfts } from '@/utils/api/nfts';
import {
  getNativeTokenBalance,
  getNativeTokenPrice,
  getTokenPrices,
  getTokenTransactionHistory
} from '@/utils/api/transactions';
import { mockCollectiblesResult } from '@/utils/mockdata';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import abi from 'human-standard-token-abi';
import { getWeiAmount } from 'src/utils/conversions';
import { AbiItem } from 'web3-utils';
import { initialState } from './types';

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
      .catch((error) => {
        console.log({ error });
        return [];
      });

    const [erc20TokensResult, nativeBalanceResponse, nativePriceResponse] =
      response;

    // get relevant token values from each transactions
    const tokenValues = erc20TokensResult.reduce((acc, value) => {
      const { contractAddress, tokenDecimal, tokenName, tokenSymbol } = value;
      acc.push({ contractAddress, tokenDecimal, tokenName, tokenSymbol });
      return acc;
    }, []);

    // get unique token contracts
    const uniqueTokens = filterByUniqueContractAddress(tokenValues);

    console.log({ web3 });
    // check if account has token balance
    const uniqueTokenBalances = (
      await fetchTokenBalances(uniqueTokens, account, web3)
    ).filter((token) => +token.tokenBalance > 0);

    const uniqueTokenPrices = await getTokenPrices(
      uniqueTokenBalances
        .map((t) => (t.contractAddress as string).toLowerCase())
        .join(),
      activeNetwork.chainId
    );

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
        const { logo } = await getTokenDetails(
          contractAddress,
          activeNetwork.chainId
        )
          .then((res) => res.data)
          .catch(() => ({ logo: '' }));

        return {
          contractAddress,
          logo,
          tokenDecimal,
          tokenSymbol,
          tokenBalance,
          tokenName,
          tokenValue,
          price: uniqueTokenPrices[contractAddress]
        };
      })
    );

    // get native details to append to token details
    const nativeBalance = getWeiAmount(
      web3,
      nativeBalanceResponse,
      activeNetwork.nativeCurrency.decimals,
      false
    );

    const nativeDetails = {
      contractAddress: '',
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
  contractAddress?: string;
  maxTotalDeposits?: number;
  tokenId?: string;
  limit?: string;
  chainId: number;
}

export const fetchCollectibleById = async (
  params: CollectiblesFetchParams
): Promise<any> => {
  const { account, offset, contractAddress, tokenId, chainId } = params;
  try {
    const { assets } = await getNfts(account, contractAddress, chainId, offset);

    return assets.filter((asset) => asset.id === tokenId)[0];
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
      contractAddress,
      chainId,
      maxTotalDeposits,
      limit = '20'
    } = params;

    const { assets } = await getNfts(
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
      collections.map(async (slug: string) => getNftFloorPrices(slug, chainId))
    )
      .then((result) => result)
      .catch(() => []);

    const allAssets = assets.map((asset) => {
      const lastSale = asset.last_sale;
      const lastPurchasePrice = {
        lastPurchasePriceUSD: 0,
        lastPurchasePriceETH: 0
      };
      if (lastSale) {
        const {
          payment_token: { usd_price, eth_price, decimals },
          total_price
        } = lastSale;
        const lastPurchasePriceUSD =
          +usd_price * +getWeiAmount(web3, total_price, decimals, false);
        lastPurchasePrice.lastPurchasePriceUSD = lastPurchasePriceUSD;
        lastPurchasePrice.lastPurchasePriceETH = parseInt(eth_price);
      }
      return {
        name: asset.name,
        image: asset.image,
        animation: asset.animation,
        permalink: asset.permalink,
        id: asset.id,
        collection: asset.collection,
        description: asset.description,
        floorPrice: floorPrices.find(
          (price) => price.collectionSlug === asset.collection.slug
        )?.floorPrice,
        lastPurchasePrice
      };
    });

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
  return Promise.all(
    tokensList.map(async (token) => {
      const tokenCopy = { ...token };
      const { contractAddress, tokenDecimal } = token;

      const tokenContractInstance = new web3.eth.Contract(
        abi as AbiItem[],
        contractAddress
      );
      const accountBalance = await tokenContractInstance.methods
        .balanceOf(account)
        .call();

      const tokenBalance = getWeiAmount(
        web3,
        accountBalance,
        tokenDecimal,
        false
      );

      tokenCopy['tokenBalance'] = tokenBalance;
      return tokenCopy;
    })
  );
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
    setMockCollectiblesResult(state, action: PayloadAction<boolean>) {
      const depositsEnabled = action.payload;
      state.collectiblesResult = depositsEnabled ? [] : mockCollectiblesResult;
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
              parseFloat((tokenCopy.price?.usd ?? 0).toString()) *
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
      .addCase(fetchTokenTransactions.rejected, (state, action) => {
        console.log({ action });

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
