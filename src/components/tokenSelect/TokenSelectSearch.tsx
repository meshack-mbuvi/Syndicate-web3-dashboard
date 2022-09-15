import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDepositTokenDetails,
  setDuplicateRulesError,
  setNullRulesError,
  setShowImportTokenModal,
  setTokenRules
} from '@/state/createInvestmentClub/slice';
import { AppState } from '@/state';
import CryptoAssetModal from '@/containers/createInvestmentClub/shared/AboutCryptoModal';
import { useDebounce } from '@/hooks/useDebounce';
import { InputField, InputFieldStyle } from '../inputs/inputField';
import { Token, TokenDetails } from '@/types/token';
import {
  indexReducer,
  IndexReducerActionType
} from '@/components/tokenSelect/indexReducer';
import { getTokenDetails } from '@/utils/api';
import { isDev } from '@/utils/environment';
import { validateDuplicateRules, validateNullRules } from '@/utils/validators';
import { TokenModalVariant } from './TokenSelectModal';
import { ImportTokenModal } from './ImportToken';
import TokenSection from './TokenSection';
import { getNftCollection } from '@/utils/api/nfts';
import { SUPPORTED_TOKENS } from '@/Networks';

interface TokenSelectSearch {
  toggleTokenSelect: () => void;
  suggestionList?: Token[];
  suggestionListTitle?: string;
  updateSuggestionList?: (token: Token) => void;
  variant?: TokenModalVariant;
}

const dedupTokens = (tokensList_, recentTokens) => {
  return tokensList_.filter(
    (tokens) =>
      !(recentTokens || []).some((rec) => rec.address === tokens.address)
  );
};

export const TokenSelectSearch: React.FC<TokenSelectSearch> = ({
  toggleTokenSelect,
  suggestionList,
  suggestionListTitle,
  updateSuggestionList,
  variant = TokenModalVariant.Default
}) => {
  const {
    web3Reducer: {
      web3: { web3, activeNetwork }
    },
    createInvestmentClubSliceReducer: {
      showTokenGateModal,
      showImportTokenModal,
      tokenRules,
      currentSelectedToken,
      logicalOperator
    },
    collectivesSlice: { adminCollectives, memberCollectives }
  } = useSelector((state: AppState) => state);

  const [tokensList, setTokenList] = useState<Token[]>([]);
  // const [nftList, setNftList] = useState<Token[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [noTokenFound, setNoTokenFound] = useState(false);
  const [showCryptoAssetModal, setShowCryptoAssetModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasTokenError, setHasTokenError] = useState(false);
  const [showImportBtn, setShowImportBtn] = useState(false);

  const [activeOptions, reducerDispatch] = useReducer(indexReducer, {
    index: -1,
    shift: 0
  });

  const dispatch = useDispatch();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const defaultTokenList = showTokenGateModal
    ? [...(adminCollectives || []), ...(memberCollectives || [])]
        .slice(0, 6)
        .map((collective) => {
          return {
            name: collective.tokenName,
            address: collective.address,
            symbol: collective.tokenSymbol,
            logoURI: collective.tokenMedia,
            collectionMediaType: collective.tokenMediaType
          };
        }) ||
      SUPPORTED_TOKENS[activeNetwork.chainId] ||
      []
    : SUPPORTED_TOKENS[activeNetwork.chainId] || [];

  const _tokens = debouncedSearchTerm
    ? tokensList
    : [
        ...(suggestionList || []),
        ...(dedupTokens(defaultTokenList, suggestionList) || [])
      ];

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchInputRef]);

  const getTokenByAddressChainId = useCallback(
    async (address: string, chainId: number): Promise<Token> => {
      setLoading(true);
      const promises = [getTokenDetails(address, chainId)];

      if (showTokenGateModal) {
        promises.push(getNftCollection(address, chainId));
      }

      return Promise.allSettled(promises)
        .then((res) => {
          const _res = res.find((r) => r.status === 'fulfilled');
          if (!_res) {
            setHasTokenError(true);
            return null;
          }

          return (_res as any).value.data;
        })
        .then((data: TokenDetails) => {
          if (!data || !data.name || !data.symbol) return null;
          return {
            address: data.contractAddress,
            name: data.name,
            symbol: data.symbol,
            decimals: data.decimals,
            chainId: chainId,
            logoURI: data.logo,
            price: data.price,
            collectionCount: data.collectionCount
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

    const isValid =
      web3.utils.isAddress(token.address) &&
      'name' in token &&
      token.name.length > 0 &&
      'symbol' in token &&
      token.symbol.length > 0 &&
      'chainId' in token &&
      token.chainId > 0;

    // We don't need to validate for 'decimals' in NFT tokens
    if (showTokenGateModal) return isValid;

    return isValid && 'decimals' in token && token.decimals > 0;
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      setShowImportBtn(false);
      const matchedTokens: Token[] = [];
      // token contractAddress
      if (web3.utils && web3.utils.isAddress(debouncedSearchTerm)) {
        const _token = [
          ...(defaultTokenList || []),
          ...(suggestionList || []),
          ...(showTokenGateModal
            ? SUPPORTED_TOKENS[activeNetwork.chainId] || []
            : [])
        ].find((token) => token.address === debouncedSearchTerm);

        // Avoid fetching API if token exists in tokensList or suggestionList
        if (_token) {
          matchedTokens.push(_token);
          setTokenList(matchedTokens);
        } else {
          getTokenByAddressChainId(debouncedSearchTerm, activeNetwork.chainId)
            .then((token) => {
              if (token !== null && validateToken(token)) {
                matchedTokens.push(token);
              } else {
                setHasTokenError(true);
              }
              setLoading(false);
              setNoTokenFound(false);
              setShowImportBtn(true);
              setTokenList(matchedTokens);
            })
            .catch((err) => {
              console.log(err);
              setHasTokenError(true);
            });
        }
      } else {
        [
          ...(defaultTokenList || []),
          ...(showTokenGateModal
            ? SUPPORTED_TOKENS[activeNetwork.chainId] || []
            : [])
        ].map((defaultToken) => {
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
  }, [debouncedSearchTerm, activeNetwork]);

  useEffect(() => {
    reducerDispatch({ type: IndexReducerActionType.SHIFT, payload: 0 });
  }, [tokensList, suggestionList, debouncedSearchTerm]);

  // useEffect(() => {
  //   // Get NFTs from recently searched tokens
  //   if (showTokenGateModal && suggestionList && suggestionList.length) {
  //     const recentlyUsedNFTs = suggestionList.filter(
  //       (token) => !token.decimals
  //     );
  //     setNftList(recentlyUsedNFTs);
  //   }
  // }, [showTokenGateModal, suggestionList]);

  const handleTokenClick = (token: Token): void => {
    dispatchTokenDetails(token);

    if (updateSuggestionList) {
      updateSuggestionList(token);
    }
    reducerDispatch({ type: IndexReducerActionType.FIRST });
    toggleTokenSelect();
  };

  const dispatchTokenDetails = (token: Token): void => {
    if (showTokenGateModal) {
      const { idx, quantity } = currentSelectedToken;

      const rules = [
        ...tokenRules.slice(0, idx),
        {
          name: token.name,
          quantity,
          symbol: token.symbol,
          chainId: token.chainId,
          contractAddress: token.address,
          icon: token.logoURI,
          decimals: token.decimals
        },
        ...tokenRules.slice(idx + 1)
      ];
      dispatch(setTokenRules(rules));

      // Handle duplicate validation
      const duplicateTokens = validateDuplicateRules(rules, logicalOperator);
      dispatch(setDuplicateRulesError(duplicateTokens));

      // Handle null rules validation
      const _nullRules = validateNullRules(rules);
      dispatch(setNullRulesError(_nullRules));
    } else {
      dispatch(
        setDepositTokenDetails({
          depositToken: token.address,
          depositTokenName: token.name,
          depositTokenSymbol: token.symbol,
          depositTokenLogo: token.logoURI,
          depositTokenDecimals: token.decimals
        })
      );
    }
  };

  const handleSearchTerm = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tokenIndex = activeOptions.index;
      handleTokenClick(_tokens[tokenIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (_tokens?.length - 1 > activeOptions.index) {
        reducerDispatch({ type: IndexReducerActionType.INCREMENT });
      } else {
        reducerDispatch({ type: IndexReducerActionType.FIRST });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeOptions.index <= 0) {
        reducerDispatch({
          type: IndexReducerActionType.LAST,
          payload: _tokens?.length - 1
        });
      } else {
        reducerDispatch({ type: IndexReducerActionType.DECREMENT });
      }
    } else {
      reducerDispatch({ type: IndexReducerActionType.FIRST });
    }
  };

  const tokenSectionDefaultProps = {
    handleTokenClick,
    activeOptions,
    searchTerm: debouncedSearchTerm,
    loading,
    variant,
    noTokenFound,
    hasTokenError
  };

  return (
    <div className="flex flex-col pt-8 pb-6 min-h-363 max-h-141 rounded-2xl bg-gray-darkBackground border-6 border-gray-darkBackground focus:outline-none">
      <div className="mb-4 sm:flex items-center justify-between px-8">
        <div className="text-xl text-white">Select a token</div>
        {!showTokenGateModal && (
          <div className="inline-flex text-xl text-gray-syn10 sm:pl-16 sm:float-right">
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
        )}
      </div>

      {/* Search field */}
      <div className={`px-8 ${debouncedSearchTerm ? '' : 'mb-4'}`}>
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
        {debouncedSearchTerm ? (
          <TokenSection
            allActiveTokens={_tokens}
            tokenList={tokensList}
            showImportBtn={showImportBtn}
            {...tokenSectionDefaultProps}
          />
        ) : (
          <>
            {variant === TokenModalVariant.RecentlyUsed &&
            suggestionList?.length ? (
              <TokenSection
                allActiveTokens={_tokens}
                header={suggestionListTitle}
                tokenList={suggestionList}
                {...tokenSectionDefaultProps}
              />
            ) : null}
            {/* {showTokenGateModal && nftList.length ? (
              <TokenSection
                allActiveTokens={_tokens}
                header="NFTs"
                tokenList={nftList}
                {...tokenSectionDefaultProps}
              />
            ) : null} */}
            {dedupTokens(tokensList, suggestionList).length ? (
              <TokenSection
                allActiveTokens={_tokens}
                header={
                  showTokenGateModal
                    ? 'Community or social tokens'
                    : 'Common Tokens'
                }
                tokenList={dedupTokens(tokensList, suggestionList || [])}
                {...tokenSectionDefaultProps}
              />
            ) : null}
          </>
        )}
      </div>

      <ImportTokenModal
        showModal={showImportTokenModal}
        handleTokenClick={handleTokenClick}
        closeModal={() => dispatch(setShowImportTokenModal(false))}
      />
    </div>
  );
};
