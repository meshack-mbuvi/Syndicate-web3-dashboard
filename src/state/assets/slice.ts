import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { web3 } from "@/utils/web3Utils";
import { AbiItem } from "web3-utils";
import { getWeiAmount } from "src/utils/conversions";
import abi from "human-standard-token-abi";
import erc721abi from "@/utils/abi/erc721";
import { isDev } from "@/utils/environment";
import { getCoinFromContractAddress } from "functions/src/utils/ethereum";
import { getEthereumTokenPrice } from "@/helpers/ethereumTokenDetails";

import { initialState } from "./types";

const baseURL = isDev
  ? "https://api-rinkeby.etherscan.io/api"
  : "https://api.etherscan.io/api";
const etherscanAPIKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

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
    const uniqueTokenBalances = await Promise.all(
      filterByTokenBalances(uniquesTokens, account),
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
        } = value;

        const { price, logo } = await getCoinFromContractAddress(
          contractAddress,
        );

        return {
          price,
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

// ERC721 transactions
export const fetchCollectiblesTransactions = createAsyncThunk(
  "assets/fetchCollectiblesTransactions",
  async (account: string) => {
    const response = await axios.get(`${baseURL}`, {
      params: {
        module: "account",
        action: "tokennfttx",
        apikey: etherscanAPIKey,
        address: account,
      },
    });

    const { result } = response.data;

    const nftTokenValues = result.reduce((acc, value) => {
      const { contractAddress, tokenID } = value;
      acc.push({ contractAddress, tokenID });
      return acc;
    }, []);

    // get unique token contracts
    const uniqueNftTokens = filterByUniqueContractAddress(nftTokenValues);

    // check if account is owner of nft
    const nftsOwnedByAccount = await Promise.all(
      filterNftByOwnership(uniqueNftTokens, account),
    );

    // get nft metadata
    const nftsOwnedMetadata = (
      await Promise.all(getNftMetadata(nftsOwnedByAccount))
    ).filter((data) => data);

    const nftTokenDetails = nftsOwnedMetadata.reduce((acc, value) => {
      const { name, image } = value;
      acc.push({ name, image });
      return acc;
    }, []);

    return nftTokenDetails;
  },
);

/** Methods */
const getNftMetadata = (nftTokensList: any[]) => {
  const nftMetadata = nftTokensList.map(async (nftToken) => {
    const { contractAddress, tokenID } = nftToken;

    const nftContractInstance = await new web3.eth.Contract(
      erc721abi as AbiItem[],
      contractAddress,
    );
    try {
      const tokenURI = await nftContractInstance.methods
        .tokenURI(tokenID)
        .call();

      const tokenMetadata = await axios.get(tokenURI);
      return tokenMetadata.data;
    } catch (error) {
      // TODO: mock return values for nfts that don't have tokenURIs
      return null;
    }
  });

  return nftMetadata;
};

// filter nfts by ownership
const filterNftByOwnership = (nftTokensList: any[], account: string) => {
  const nftsOwned = nftTokensList.filter(async (nftToken) => {
    const { contractAddress, tokenID } = nftToken;
    const nftContractInstance = new web3.eth.Contract(
      erc721abi as AbiItem[],
      contractAddress,
    );
    const nftOwner = await nftContractInstance.methods.ownerOf(tokenID).call();
    return nftOwner !== account;
  });
  return nftsOwned;
};

// get unique token contracts from token transactions
const filterByUniqueContractAddress = (tokensList: any[]) => {
  const key = "contractAddress";
  const uniqueTokensByContractAddress = [
    ...new Map(tokensList.map((item) => [item[key], item])).values(),
  ];

  return uniqueTokensByContractAddress;
};

const filterByTokenBalances = (tokensList: any[], account: string) => {
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

    // add check for token balance.
    // just because a transaction involved a specific token does not mean
    // the account currently holds that token.
    if (+accountBalance > 0) {
      tokenCopy["tokenBalance"] = getWeiAmount(
        accountBalance,
        tokenDecimal,
        false,
      );
    }

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
        state.collectiblesResult = action.payload;
        state.loadingCollectibles = false;
        state.collectiblesFetchError = false;
      })
      .addCase(fetchCollectiblesTransactions.rejected, (state, action) => {
        state.collectiblesFetchError = true;
      });
  },
});

export default assetsSlice.reducer;
