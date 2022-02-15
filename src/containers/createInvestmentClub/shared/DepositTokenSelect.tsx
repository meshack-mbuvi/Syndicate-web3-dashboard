import { useEffect, useState } from "react";
import { coinList } from "@/containers/createInvestmentClub/shared/ClubTokenDetailConstants";
import { TokenSearchBar } from "@/containers/createInvestmentClub/shared/TokenSearchInput";
import { useDispatch, useSelector } from "react-redux";

import { setDepositTokenDetails } from "@/state/createInvestmentClub/slice";
import { AppState } from "@/state";
import TokenDetails from "@/containers/createInvestmentClub/shared/TokenDetails";

export const DepositTokenSelect = (props: {
  toggleTokenSelect: () => void;
}) => {
  const [tokensList, setTokenList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [noTokenFound, setNoTokenFound] = useState(false);

  const [recentlyUsedTokens, setRecentlyUsedTokens] = useState([]);

  const dispatch = useDispatch();

  const {
    createInvestmentClubSliceReducer: { tokenDetails },
  } = useSelector((state: AppState) => state);

  // handle token search
  useEffect(() => {
    if (searchTerm) {
      const searchKeyword = searchTerm.toLowerCase().trim();
      // users are allowed to search by name or symbol
      const searchResults = coinList.filter(
        (token) =>
          token.symbol.toLowerCase().includes(searchKeyword) ||
          token.name.toLowerCase().includes(searchKeyword) ||
          token.address.toLowerCase() === searchKeyword,
      );
      if (searchResults.length) {
        setTokenList(searchResults);
        setNoTokenFound(false);
      } else {
        setTokenList([]);
        setNoTokenFound(true);
      }
    } else {
      // populate the list with default tokens if there's no search term
      const defaultTokens = coinList.filter((token) => token.name);
      setTokenList(defaultTokens);
    }
  }, [searchTerm, coinList]);

  useEffect(() => {
    const recentTokens = localStorage.getItem("recentTokens");
    if (recentTokens) {
      setRecentlyUsedTokens(JSON.parse(recentTokens));
    }
  }, []);

  const handleTokenClick = (token) => {
    dispatch(
      setDepositTokenDetails({
        depositTokenAddress: token.address,
        depositTokenName: token.name,
        depositTokenSymbol: token.symbol,
        depositTokenLogo: token.logoURI,
        depositTokenDecimals: token.decimal,
      }),
    );
    const recentTokens = localStorage.getItem("recentTokens");
    // Checks if the recent token and adds to a list if it's not already there
    if (recentTokens) {
      const parsedRecentTokens = JSON.parse(recentTokens);
      parsedRecentTokens.push(token);
      // prevents duplicates in cached coins
      const uniqueTokens = [
        ...new Map(
          parsedRecentTokens.map((recentToken) => [
            recentToken["symbol"],
            recentToken,
          ]),
        ).values(),
      ];
      localStorage.setItem("recentTokens", JSON.stringify(uniqueTokens));
    } else {
      localStorage.setItem("recentTokens", JSON.stringify([token]));
    }
  };

  return (
    <div
      className="flex flex-col p-8 rounded-2xl bg-gray-darkBackground border-6 border-gray-darkBackground focus:outline-none"
    >
      <div className="mb-4 font-whyte text-xl text-white">Select a token</div>
      {/* This will be used when we move to more than just 2 tokens */}
      {/* <TokenSearchBar setSearchTerm={setSearchTerm} /> */}

      {/* hide recent token section if we are currently performing a search */}
      {/* {!searchTerm.length ? (
        <div> */}
      {/* this will be used when we have more than just 2 tokens */}
      {/* {recentlyUsedTokens.length ? (
            <p className="text-xs sm:text-sm text-gray-3 uppercase mb-5 tracking-wider">
              Recently used
            </p>
          ) : null} */}
      {/* <div className="my-2">
            {recentlyUsedTokens.map((token, index) => {
              const { symbol, name, address, logoURI } = token;
              return (
                <TokenDetails
                  {...{ symbol, name, address, logoURI }}
                  key={index}
                  toggleTokenSelect={props.toggleTokenSelect}
                  showCheckMark={
                    name === tokenName || name === tokenDetails.depositTokenName
                  }
                  onClick={() => handleTokenClick(token)}
                />
              );
            })}
          </div>
        </div>
      ) : null} */}
      {/* {searchTerm ? null : (
        <p className="text-xs sm:text-sm text-gray-3 uppercase mb-5 tracking-wider">
          Common tokens
        </p>
      )} */}
      <div className="my-2 overflow-y-auto">
        {tokensList.length ? (
          tokensList
            .reduce((acc, curr) => {
              // filters the recently used against the token list
              // const isRecentlyUsed = recentlyUsedTokens.find(
              //   (token) => token.address === curr.address,
              // );
              const isRecentlyUsed = [];

              // list all tokens if a search is happening
              if (!isRecentlyUsed.length || searchTerm.length) {
                acc.push(curr);
              }
              return acc;
            }, [])
            .map((token, index) => {
              const { symbol, name, address, logoURI } = token;
              return (
                <TokenDetails
                  {...{ symbol, name, address, logoURI }}
                  key={index}
                  toggleTokenSelect={props.toggleTokenSelect}
                  showCheckMark={
                    symbol === tokenDetails.depositTokenSymbol ||
                    (tokenDetails.depositTokenSymbol === "" &&
                      symbol === "USDC")
                  }
                  onClick={() => handleTokenClick(token)}
                />
              );
            })
        ) : noTokenFound ? (
          <div className="flex flex-col justify-center w-full h-full items-center">
            <p className="text-sm font-whyte text-white">No results found</p>
            <p className="text-sm font-whyte text-gray-3">
              Try searching a different name or pasting the contract address
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
