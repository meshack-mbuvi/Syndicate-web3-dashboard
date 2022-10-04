/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { SkeletonLoader } from '@/components/skeletonLoader';
import GradientAvatar from '@/components/syndicates/portfolioAndDiscover/portfolio/GradientAvatar';
import { H4 } from '@/components/typography';
import useModal from '@/hooks/useModal';
import { AppState } from '@/state';
import Image from 'next/image';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PriceContainer from '../collectibles/shared/PriceContainer';
import TokenModal from './TokenModal';
import {
  CollapseChevronButton,
  CollapsedSectionType
} from '@/containers/layoutWithSyndicateDetails/assets/shared/CollapseChevronButton';
import HideAssetPill from '@/containers/layoutWithSyndicateDetails/assets/shared/HideAssetPill';
import ArrowDown from '@/components/icons/arrowDown';
import { SortOrderType } from '@/containers/layoutWithSyndicateDetails/assets';
import { isEmpty } from 'lodash';
interface Props {
  columns: string[];
  tableData: any[];
  activeAssetTab: string;
  isOwner: boolean;
  showHiddenTokens?: boolean;
  showOrHideTokens: (contractAddress: string) => void;
  storeSortColumn: (
    column: string,
    sortAscending: boolean,
    assetSection: SortOrderType
  ) => void;
}

interface Token {
  contractAddress: string;
  hidden?: boolean;
  logo: string;
  price: { usd: number };
  tokenBalance: string;
  tokenDecimal: string;
  tokenName: string;
  tokenSymbol: string;
  tokenValue: string;
}

const TokenTable: FC<Props> = ({
  columns,
  tableData,
  showHiddenTokens,
  showOrHideTokens,
  isOwner,
  storeSortColumn
}) => {
  const {
    assetsSliceReducer: { loading },
    erc20TokenSliceReducer: {
      depositDetails: { nativeDepositToken }
    }
  } = useSelector((state: AppState) => state);

  let clubAddress = '';
  if (typeof window !== 'undefined') {
    clubAddress = window?.location?.pathname.split('/')[2];
  }

  // pagination
  const dataLimit = 10; // number of items to show on each page.
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [canNextPage, setCanNextPage] = useState<boolean>(true);
  const [canPreviousPage, setCanPreviousPage] = useState<boolean>(true);

  // refs
  const tokensTableNavRef = useRef(null);
  const tokensTableRef = useRef<HTMLDivElement>(null);

  const [skeletonState, setSkeletonState] = useState<boolean>(loading);
  const [showTokenModal, setShowTokenModal] = useModal();
  const [tokenDetails, setTokenDetails] = useState({});

  // sort
  const [currentSortColumn, setCurrentSortColumn] = useState({
    column: 'Club balance',
    sortAscending: false
  });
  const [sortedTableData, setSortedTableData] = useState<Token[]>([]);

  // state to show/hide section
  const [isTokensTableCollapsed, setIsTokensTableCollapsed] = useState(false);
  const [totalTokensCount, setTotalTokensCount] = useState(0);
  const [tokensData, setTokensData] = useState<Token[]>([]);

  function goToNextPage() {
    setCurrentPage((page) => page + 1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => page - 1);
  }

  // sort tokens table data based on selected column
  const sortData = useCallback(
    (column: string, sortDataArray: any) => {
      if (column === 'Token') {
        setSortedTableData(
          [...sortDataArray].sort((a, b) => {
            const textA = a.tokenName.toUpperCase();
            const textB = b.tokenName.toUpperCase();
            if (currentSortColumn.sortAscending) {
              return textA > textB ? -1 : textA < textB ? 1 : 0;
            } else {
              return textA < textB ? -1 : textA > textB ? 1 : 0;
            }
          })
        );
      } else if (column === 'Club balance') {
        setSortedTableData(
          [...sortDataArray].sort((a, b) => {
            if (currentSortColumn.sortAscending) {
              return +a.tokenBalance - +b.tokenBalance;
            } else {
              return +b.tokenBalance - +a.tokenBalance;
            }
          })
        );
      } else if (column === 'Value') {
        setSortedTableData(
          [...sortDataArray].sort((a, b) => {
            if (currentSortColumn.sortAscending) {
              return +a.tokenValue - +b.tokenValue;
            } else {
              return +b.tokenValue - +a.tokenValue;
            }
          })
        );
      }
    },
    [currentSortColumn?.sortAscending]
  );

  useEffect(() => {
    // get sort column from local storage if set
    // otherwise use local state
    const existingClubAssetsSortOrder =
      JSON.parse(localStorage.getItem('clubAssetsSortOrder') as string) || {};

    const currentClubAssetsSortOrder =
      existingClubAssetsSortOrder[clubAddress as string] || {};

    const clubTokensSortOrder =
      currentClubAssetsSortOrder[SortOrderType.TOKENS] || {};

    const tokensSortOrder = isEmpty(clubTokensSortOrder)
      ? currentSortColumn
      : clubTokensSortOrder;

    // update current sort order if we already have data in local storage
    setCurrentSortColumn({
      column: tokensSortOrder.column,
      sortAscending: tokensSortOrder.sortAscending
    });

    if (tableData.length) {
      sortData(tokensSortOrder.column, tableData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData, clubAddress, sortData]);

  // sort by selected column
  const sortByColumn = (column: string) => {
    sortData(column, sortedTableData);

    setCurrentSortColumn({
      column,
      sortAscending: !currentSortColumn.sortAscending
    });

    // push current sort column to local storage
    storeSortColumn(
      column,
      !currentSortColumn.sortAscending,
      SortOrderType.TOKENS
    );
  };

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    const existingClubsHiddenAssets =
      JSON.parse(localStorage.getItem('hiddenAssets') as string) || {};

    // filter out hidden tokens
    let filteredPaginatedData, filteredData;
    if (Object.keys(existingClubsHiddenAssets).length) {
      const clubHiddenAssets = existingClubsHiddenAssets[clubAddress as string];

      if (clubHiddenAssets && clubHiddenAssets?.length) {
        filteredData = sortedTableData.map((data: Token) => {
          const { contractAddress } = data;
          return {
            ...data,
            hidden: clubHiddenAssets.indexOf(contractAddress) > -1
          };
        });

        filteredPaginatedData = sortedTableData.filter((data: Token) => {
          const { contractAddress } = data;
          return clubHiddenAssets.indexOf(contractAddress) < 0;
        });

        // setting correct data array to use based on whether we need to
        // show hidden tokens or not.
        const tokensDataPostFilter = showHiddenTokens
          ? filteredData.slice(startIndex, endIndex)
          : filteredPaginatedData.slice(startIndex, endIndex);
        setTokensData(tokensDataPostFilter);

        // adjusting pagination to cater for hidden tokens.
        const totalTokensCount = showHiddenTokens
          ? sortedTableData.length
          : sortedTableData.filter(
              (token: Token) =>
                clubHiddenAssets.indexOf(token.contractAddress) < 0
            ).length;
        setTotalTokensCount(totalTokensCount);

        // go back to previous page if all tokens on the current page are hidden
        if (tokensDataPostFilter.length < 1 && totalTokensCount > 0) {
          goToPreviousPage();
        }
      } else {
        setTokensData(sortedTableData.slice(startIndex, endIndex));
        setTotalTokensCount(sortedTableData.length);
      }
    } else {
      setTokensData(sortedTableData.slice(startIndex, endIndex));
      setTotalTokensCount(sortedTableData.length);
    }
  };

  useEffect(() => {
    getPaginatedData();
    if (currentPage === 1) {
      setCanPreviousPage(false);
    } else {
      setCanPreviousPage(true);
    }

    if (totalTokensCount - (currentPage - 1) * dataLimit > dataLimit) {
      setCanNextPage(true);
    } else {
      setCanNextPage(false);
    }
    // defaults to time of 1 second or loading time (whichever is higher)
    if (skeletonState) {
      setTimeout(() => {
        setSkeletonState(false);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentPage,
    dataLimit,
    totalTokensCount,
    showHiddenTokens,
    sortedTableData,
    currentSortColumn?.sortAscending
  ]);

  const LoaderContent: React.FC<{ animate: boolean }> = ({ animate }) => (
    <div className={`relative ${!animate ? 'px-2' : 'px-0'}`}>
      {!animate && (
        <div className="absolute flex flex-col justify-center items-center top-1/3 w-full z-10">
          <H4 extraClasses="text-white mb-4">This club has no tokens yet.</H4>
          <span className="text-gray-syn4">
            Any tokens held in this club’s wallet will appear here, including
            member deposits.
          </span>
        </div>
      )}
      <div className={!animate ? `filter grayscale blur-md` : ''}>
        {[...Array(4).keys()].map((_, index) => {
          return (
            <div
              className="grid grid-cols-12 gap-5 border-b-1 border-gray-syn6 py-3"
              key={index}
            >
              <div className="flex justify-start space-x-4 items-center w-full col-span-3">
                <div className="flex-shrink-0">
                  <SkeletonLoader
                    width="8"
                    height="8"
                    borderRadius="rounded-full"
                    animate={animate}
                  />
                </div>
                <SkeletonLoader
                  width="36"
                  height="6"
                  borderRadius="rounded-md"
                  animate={animate}
                />
              </div>
              {[...Array(2).keys()].map((_, index) => {
                return (
                  <div
                    className="w-full flex items-center col-span-3"
                    key={index}
                  >
                    <SkeletonLoader
                      width="36"
                      height="6"
                      borderRadius="rounded-md"
                      animate={animate}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  const tokensTitle = (
    <div className="flex w-full justify-between items-center">
      <div className="flex text-base items-center">
        <img alt="token" src="/images/token.svg" />
        <H4 extraClasses="pl-3">Tokens</H4>
      </div>

      {/* hide/unhide tokens button */}
      <CollapseChevronButton
        isCollapsed={isTokensTableCollapsed}
        setIsCollapsed={setIsTokensTableCollapsed}
        collapsedSection={CollapsedSectionType.TOKENS}
      />
    </div>
  );

  const loadingContent = loading || skeletonState;

  // get state of token section collapsed from localStorage
  useEffect(() => {
    if (window.localStorage) {
      const existingClubsCollapsedStates =
        JSON.parse(
          localStorage.getItem('clubAssetsCollapsedState') as string
        ) || {};

      const currentClubCollapsedState =
        existingClubsCollapsedStates[clubAddress as string] || {};

      const isTokensSectionCollapsed =
        currentClubCollapsedState[CollapsedSectionType.TOKENS] || false;

      setIsTokensTableCollapsed(isTokensSectionCollapsed);
    }
  }, [clubAddress]);

  // hide/show a given token
  const showOrHideToken = (e: Event, _contractAddress: string) => {
    e.stopPropagation();

    // show or hide selected token
    showOrHideTokens(_contractAddress);

    // update paginated data
    getPaginatedData();
  };

  const [containerHeight, setContainerHeight] = useState<number>(0);

  // get height of tokens table to animate on collapse
  useEffect(() => {
    if (tokensTableRef) {
      const containerHeight = tokensTableRef.current
        ? tokensTableRef.current.getBoundingClientRect().height
        : 0;

      setContainerHeight(containerHeight + 32);
    }
  }, [JSON.stringify(tokensData)]);

  return (
    <div className="mt-16">
      {/* title and collapsible button  */}
      {tokensTitle}
      <div
        className={`overflow-x-scroll no-scroll-bar -mr-6 sm:mr-auto duration-500 transition-all `}
        style={{
          height: isTokensTableCollapsed ? '0' : `${containerHeight}px`
        }}
      >
        <div className={`w-max sm:w-full pt-8`} ref={tokensTableRef}>
          {/* loading state  */}
          {loadingContent && <LoaderContent animate={true} />}

          {/* empty state  */}
          {!loadingContent && !tokensData?.length ? (
            <LoaderContent animate={false} />
          ) : null}

          {!loadingContent && tokensData?.length ? (
            <div className="w-full">
              <div className="flex flex-col">
                {/* scroll to top of table with this button when pagination is clicked  */}
                <button ref={tokensTableNavRef} />

                {/* table columns  */}
                <div className="grid grid-cols-3 md:grid-cols-12 gap-8 md:gap-5 pb-3 text-gray-lightManatee ">
                  {columns?.map((col, idx) => (
                    <button
                      key={`token-table-header-${idx}`}
                      className={`text-sm md:col-span-3 flex items-center group ${
                        idx > 0 ? 'md:justify-end' : ''
                      } ${idx === 0 ? 'md:col-span-4' : ''} ${
                        idx === columns.length - 1 ? 'md:col-span-2' : ''
                      } `}
                      onClick={() => sortByColumn(col)}
                    >
                      <div>{col}</div>

                      {/* sort table data  */}
                      {col ? (
                        <div
                          className={`duration-300 transition-all ${
                            col === currentSortColumn.column
                              ? 'opacity-100'
                              : 'opacity-0'
                          } group-hover:opacity-100`}
                          style={{ marginLeft: '5.12px' }}
                        >
                          <ArrowDown
                            flipped={
                              col === currentSortColumn.column
                                ? !currentSortColumn.sortAscending
                                : currentSortColumn.sortAscending
                            }
                          />
                        </div>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
              {tokensData.map(
                (
                  {
                    tokenBalance,
                    tokenName,
                    tokenSymbol,
                    price,
                    logo,
                    contractAddress,
                    hidden = false
                  },
                  index
                ) => {
                  const tokenValue =
                    parseFloat(
                      (Number(price) ? price : price?.usd ?? 0).toString()
                    ) * parseFloat(tokenBalance);

                  return (
                    <div
                      key={`token-table-row-${index}`}
                      className={`group grid grid-cols-3 md:grid-cols-12 gap-8 md:gap-5 border-b-1 border-gray-syn7 py-5   ${
                        hidden && !showHiddenTokens ? 'hidden' : 'block'
                      } ${hidden ? 'cursor-not-allowed' : 'cursor-pointer '}`}
                      onClick={() => {
                        // disallow clicks if token is hidden
                        if (hidden) return;

                        setShowTokenModal();
                        setTokenDetails({
                          tokenBalance,
                          tokenName,
                          tokenSymbol,
                          value: tokenValue,
                          logo
                        });
                      }}
                    >
                      {/* token name and symbol  */}
                      <div className="flex flex-row md:col-span-4 items-center">
                        <div
                          className={`hidden sm:flex flex-shrink-0 pr-4 ${
                            hidden && showHiddenTokens
                              ? 'opacity-50'
                              : 'opacity-100'
                          }`}
                        >
                          {logo ? (
                            <img
                              alt="token-icon"
                              src={logo}
                              className="w-8 h-8"
                            />
                          ) : (
                            <GradientAvatar name={tokenName} size={'w-8 h-8'} />
                          )}
                        </div>
                        <div
                          className={`text-base flex md:flex-row md:items-center ${
                            hidden && showHiddenTokens
                              ? 'opacity-50'
                              : 'opacity-100'
                          }`}
                        >
                          <span>{tokenName}&nbsp;</span>
                          <span className="text-gray-lightManatee">
                            ({tokenSymbol})
                          </span>
                        </div>

                        <div
                          className={`pl-4 transition-all duration-300 ${
                            hidden && showHiddenTokens
                              ? 'opacity-100'
                              : 'opacity-0'
                          }`}
                        >
                          <HideAssetPill currentlyHidden={true} />
                        </div>
                      </div>

                      {/* club balance  */}
                      <div
                        className={`flex md:col-span-3 md:justify-end ${
                          hidden && showHiddenTokens
                            ? 'opacity-50'
                            : 'opacity-100'
                        }`}
                      >
                        <PriceContainer
                          numberValue={tokenBalance}
                          customSymbol={tokenSymbol}
                          nativeDepositToken={nativeDepositToken}
                          flexColumn={false}
                        />
                      </div>

                      {/* Value  */}
                      <div
                        className={`flex md:col-span-3 md:justify-end ${
                          hidden && showHiddenTokens
                            ? 'opacity-50'
                            : 'opacity-100'
                        }`}
                      >
                        <PriceContainer
                          numberValue={`${tokenValue || ''}`}
                          noUSDValue={!price?.usd && !price}
                          flexColumn={false}
                        />
                      </div>

                      {/* show/hide button  */}

                      {isOwner ? (
                        <div className="flex md:col-span-2 md:justify-end transition-all opacity-0 group-hover:opacity-100 duration-300">
                          <HideAssetPill
                            hide={!hidden}
                            onClick={(e) => showOrHideToken(e, contractAddress)}
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                }
              )}
            </div>
          ) : null}

          <div>
            {/* Pagination  */}
            {totalTokensCount > 10 && !loadingContent && (
              <div className="flex w-full text-white space-x-4 justify-center my-8 leading-6">
                <button
                  className={`pt-1 ${
                    !canPreviousPage
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:opacity-90'
                  }`}
                  onClick={goToPreviousPage}
                  disabled={!canPreviousPage}
                >
                  <Image
                    src="/images/arrowBack.svg"
                    height="16"
                    width="16"
                    alt="Previous"
                  />
                </button>
                <p className="">
                  {currentPage === 1 ? '1' : (currentPage - 1) * dataLimit} -{' '}
                  {(currentPage - 1) * dataLimit + tokensData.length}
                  {` of `} {totalTokensCount}
                </p>

                <button
                  className={`pt-1 ${
                    !canNextPage
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:opacity-90'
                  }`}
                  onClick={goToNextPage}
                  disabled={!canNextPage}
                >
                  <Image
                    src="/images/arrowNext.svg"
                    height="16"
                    width="16"
                    alt="Next"
                  />
                </button>
              </div>
            )}
            <div>
              <TokenModal
                showModal={showTokenModal}
                closeModal={() => setShowTokenModal()}
                tokenDetails={tokenDetails}
                isOwner={isOwner}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenTable;
