import { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDepositTokenDetails } from "@/state/createInvestmentClub/slice";
import { AppState } from "@/state";
import CryptoAssetModal from "@/containers/createInvestmentClub/shared/AboutCryptoModal";
import useSearchToken from "@/hooks/useTokenSearch";
import { useDebounce } from "@/hooks/useDebounce";
import { InputField, InputFieldStyle } from "../inputs/inputField";
import { TokenItemsSection } from "./TokenItemDetails";
import { Token } from "@/types/token";
import { indexReducer } from "@/components/tokenSelect/indexReducer";

interface TokenSelectSearch {
  toggleTokenSelect: () => void;
  defaultTokenList: Token[];
  suggestionList?: Token[];
  suggestionListTitle?: string;
  updateSuggestionList?: (token: Token) => void;
}

export const TokenSelectSearch: React.FC<TokenSelectSearch> = ({
  toggleTokenSelect,
  defaultTokenList,
  suggestionList,
  suggestionListTitle,
  updateSuggestionList,
}) => {
  const [tokensList, setTokenList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [noTokenFound, setNoTokenFound] = useState(false);
  const [showCryptoAssetModal, setShowCryptoAssetModal] = useState(false);

  const [activeOptions, reducerDispatch] = useReducer(indexReducer, {
    index: 0,
    shift: 0,
  });

  const dispatch = useDispatch();

  const {
    createInvestmentClubSliceReducer: { tokenDetails },
  } = useSelector((state: AppState) => state);

  // TODO
  // confirm whether also searching by symbol?
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const { data, loading } = useSearchToken(debouncedSearchTerm);

  // handle token search
  useEffect(() => {
    if (debouncedSearchTerm) {
      const matchedTokens = [];
      defaultTokenList.map((defaultToken) => {
        if (
          defaultToken.symbol.includes(debouncedSearchTerm.toUpperCase()) ||
          defaultToken.address === debouncedSearchTerm
        ) {
          matchedTokens.push(defaultToken);
        }
      });
      if (matchedTokens.length == 0) {
        setTokenList([]);
        setNoTokenFound(true);
      } else {
        setTokenList(matchedTokens);
        setNoTokenFound(false);
      }
    } else {
      // populate the list with default tokens if there's no search term
      const defaultTokens = defaultTokenList.filter(
        (token: Token) => token.name,
      );
      setTokenList(defaultTokens);
    }
  }, [debouncedSearchTerm, data, loading, defaultTokenList]);

  useEffect(() => {
    if (!searchTerm) {
      reducerDispatch({ type: "SHIFT", payload: suggestionList?.length ?? 0 });
    } else {
      reducerDispatch({ type: "SHIFT", payload: 0 });
    }
  }, [tokensList, suggestionList, searchTerm]);

  const handleTokenClick = (token: Token) => {
    dispatch(
      setDepositTokenDetails({
        depositTokenAddress: token.address,
        depositTokenName: token.name,
        depositTokenSymbol: token.symbol,
        depositTokenLogo: token.logoURI,
        depositTokenDecimals: token.decimals,
      }),
    );
    if (updateSuggestionList) {
      updateSuggestionList(token);
    }
    reducerDispatch({ type: "FIRST" });
    toggleTokenSelect();
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
  };

  //possibly follow up on focus and showing in a long list
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      let selectedToken = activeOptions.index;
      if (activeOptions.shift > 0) {
        if (activeOptions.index < activeOptions.shift) {
          return handleTokenClick(suggestionList[selectedToken]);
        }
        selectedToken = activeOptions.index - activeOptions.shift;
      }
      handleTokenClick(tokensList[selectedToken]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (tokensList?.length + activeOptions.shift - 1 > activeOptions.index) {
        reducerDispatch({ type: "INCREMENT" });
      } else {
        reducerDispatch({ type: "FIRST" });
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (activeOptions.index <= 0) {
        reducerDispatch({
          type: "INDEX",
          payload: tokensList?.length + activeOptions.shift - 1,
        });
      } else {
        reducerDispatch({ type: "DECREMENT" });
      }
    } else {
      reducerDispatch({ type: "FIRST" });
    }
  };

  return (
    <div className="flex flex-col pt-8 pb-6 min-h-363 max-h-141 rounded-2xl bg-gray-darkBackground border-6 border-gray-darkBackground focus:outline-none">
      <div className="mb-4 sm:flex items-center justify-between px-8">
        <div className="font-whyte text-xl text-white">Select a token</div>
        <div className="inline-flex text-xl font-whyte text-gray-syn10 sm:pl-20 sm:float-right">
          <div className="text-sm">
            Each crypto asset is different.
            <button
              className="pl-1 text-blue focus:outline-none"
              onClick={() => setShowCryptoAssetModal(true)}
            >
              Learn more.
            </button>
            <CryptoAssetModal
              showModal={showCryptoAssetModal}
              closeModal={() => setShowCryptoAssetModal(false)}
            />
          </div>
        </div>
      </div>

      {/* Search field */}
      <div className="px-8">

        <InputField
          placeholderLabel="Search name or contract address"
          icon="/images/search-gray.svg"
          style={InputFieldStyle.MODAL}
          onChange={(e) => {
            handleSearchTermChange(e.target.value);
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      <div className="overflow-auto flex flex-col flex-grow no-scroll-bar">
        {/* Suggestion list */}
        {!searchTerm && suggestionList?.length ? (
          <>
            <p className="text-xs sm:text-sm sm:leading-4 text-white opacity-50 uppercase mt-4 tracking-wider font-bold mb-2 px-8">
              {suggestionListTitle}
            </p>
            <TokenItemsSection
              tokenList={suggestionList}
              handleItemClick={handleTokenClick}
              depositTokenSymbol={tokenDetails.depositTokenSymbol}
              activeItemIndex={activeOptions.index}
            />
          </>
        ) : null}
        {searchTerm ? null : (
          <h4
            className={`text-xs sm:text-sm sm:leading-4 text-white opacity-50 uppercase tracking-wider font-bold px-8 ${
              suggestionList?.length ? "mt-3" : "mt-4"
            } `}
          >
            Common tokens
          </h4>
        )}

        {/* Common tokens */}
        {tokensList?.length ? (
          <div className="mt-2">
            <TokenItemsSection
              tokenList={tokensList}
              handleItemClick={handleTokenClick}
              depositTokenSymbol={tokenDetails.depositTokenSymbol}
              activeItemIndex={activeOptions.index}
              listShift={activeOptions.shift}
            />
          </div>
        ) : noTokenFound ? (
          <div className="flex-grow flex flex-col justify-center space-y-2 text-center px-8">
            <p className="font-whyte text-white">No results found</p>
            <p className="text-sm font-whyte text-gray-3">
              Try searching a different name or <br />
              pasting the contract address
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
