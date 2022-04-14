import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDepositTokenDetails } from '@/state/createInvestmentClub/slice';
import { AppState } from '@/state';
import CryptoAssetModal from '@/containers/createInvestmentClub/shared/AboutCryptoModal';
import { useDebounce } from '@/hooks/useDebounce';
import { InputField, InputFieldStyle } from '../inputs/inputField';
import {
  TokenItemsLoadingSection,
  TokenItemsSection
} from './TokenItemDetails';
import { Token } from '@/types/token';
import {
  indexReducer,
  IndexReducerActionType
} from '@/components/tokenSelect/indexReducer';
import { getTokenDetails } from '@/utils/api';
import { isDev } from '@/utils/environment';
import { ChainEnum } from '@/utils/api/ChainTypes';
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
  updateSuggestionList
}) => {
  const {
    web3Reducer: {
      web3: { web3 }
    },
    createInvestmentClubSliceReducer: { tokenDetails }
  } = useSelector((state: AppState) => state);

  const [tokensList, setTokenList] = useState<Token[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [noTokenFound, setNoTokenFound] = useState(false);
  const [showCryptoAssetModal, setShowCryptoAssetModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasTokenError, setHasTokenError] = useState(false);

  /* TODO - refactor for other chains see ENG-3310 */
  const chainId = isDev ? ChainEnum.RINKEBY : ChainEnum.ETHEREUM;

  const [activeOptions, reducerDispatch] = useReducer(indexReducer, {
    index: -1,
    shift: suggestionList ? suggestionList.length : 0
  });

  const dispatch = useDispatch();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchInputRef]);

  const getTokenByAddressChainId = useCallback(
    async (address: string, chainId: number): Promise<Token> => {
      setLoading(true);
      return getTokenDetails(address, chainId)
        .then((res) => res.data)
        .then((data) => {
          return {
            address: data.contractAddress,
            name: data.name,
            symbol: data.symbol,
            decimals: data.decimals,
            chainId: chainId,
            logoURI: data.logo
          };
        })
        .catch((err) => {
          console.log(err);
          setHasTokenError(true);
          return null;
        });
    },
    [debouncedSearchTerm]
  );

  const validateToken = (token) => {
    /* add tokens by contract address on rinkey without validation since
    rinkeby tokens infrequently have name symbol etc. */
    if (isDev) {
      return true;
    }
    return (
      web3.utils.isAddress(token.address) &&
      'name' in token &&
      token.name.length > 0 &&
      'symbol' in token &&
      token.symbol.length > 0 &&
      'decimals' in token &&
      token.decimals > 0 &&
      'chainId' in token &&
      token.chainId > 0
    );
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      const matchedTokens: Token[] = [];
      // token contractAddress
      if (web3.utils.isAddress(debouncedSearchTerm)) {
        getTokenByAddressChainId(debouncedSearchTerm, chainId)
          .then((token) => {
            if (validateToken(token)) {
              matchedTokens.push(token);
            } else {
              setHasTokenError(true);
            }
            setLoading(false);
            setNoTokenFound(false);
            setTokenList(matchedTokens);
          })
          .catch((err) => {
            console.log(err);
            setHasTokenError(true);
          });
      } else {
        defaultTokenList.map((defaultToken) => {
          if (
            defaultToken.name
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()) ||
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
      }
    } else {
      // populate the list with default tokens if there's no search term
      setHasTokenError(false);
      const defaultTokens = defaultTokenList.filter(
        (token: Token) => token.name
      );
      setTokenList(defaultTokens);
      setNoTokenFound(false);
    }
  }, [debouncedSearchTerm, defaultTokenList]);

  useEffect(() => {
    if (!searchTerm) {
      reducerDispatch({
        type: IndexReducerActionType.SHIFT,
        payload: suggestionList?.length ?? 0
      });
    } else {
      reducerDispatch({ type: IndexReducerActionType.SHIFT, payload: 0 });
    }
  }, [tokensList, suggestionList, searchTerm]);

  const handleTokenClick = (token: Token): void => {
    dispatch(
      setDepositTokenDetails({
        depositToken: token.address,
        depositTokenName: token.name,
        depositTokenSymbol: token.symbol,
        depositTokenLogo: token.logoURI,
        depositTokenDecimals: token.decimals
      })
    );
    if (updateSuggestionList) {
      updateSuggestionList(token);
    }
    reducerDispatch({ type: IndexReducerActionType.FIRST });
    toggleTokenSelect();
  };

  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      let selectedToken = activeOptions.index;
      if (activeOptions.shift > 0) {
        if (activeOptions.index < activeOptions.shift && suggestionList) {
          return handleTokenClick(suggestionList[selectedToken]);
        }
        selectedToken = activeOptions.index - activeOptions.shift;
      }
      handleTokenClick(tokensList[selectedToken]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (tokensList?.length + activeOptions.shift - 1 > activeOptions.index) {
        reducerDispatch({ type: IndexReducerActionType.INCREMENT });
      } else {
        reducerDispatch({ type: IndexReducerActionType.FIRST });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeOptions.index <= 0) {
        reducerDispatch({
          type: IndexReducerActionType.LAST,
          payload: tokensList?.length + activeOptions.shift - 1
        });
      } else {
        reducerDispatch({ type: IndexReducerActionType.DECREMENT });
      }
    } else {
      reducerDispatch({ type: IndexReducerActionType.FIRST });
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
      <div className={`px-8 ${searchTerm ? '' : 'mb-4'}`}>
        <InputField
          placeholderLabel="Search name or contract address"
          icon="/images/search-gray.svg"
          style={InputFieldStyle.MODAL}
          onChange={handleSearchTerm}
          onKeyDown={onKeyDown}
          ref={searchInputRef}
        />
      </div>
      <div className="overflow-auto flex flex-col flex-grow no-scroll-bar">
        {/* Suggestion list */}
        {!searchTerm && suggestionList?.length ? (
          <>
            <p className="text-xs sm:text-sm sm:leading-4 text-white opacity-50 uppercase tracking-wider font-bold mb-2 px-8">
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
              suggestionList?.length ? 'mt-3' : ''
            } `}
          >
            Common tokens
          </h4>
        )}
        {loading ? (
          <TokenItemsLoadingSection repeat={3} />
        ) : (
          <>
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
            ) : hasTokenError ? (
              <div className="flex-grow flex flex-col justify-center space-y-2 text-center px-8">
                <p className="font-whyte text-white">No matching token found</p>
                <p className="text-sm font-whyte text-gray-3">
                  Try searching a different token
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};
