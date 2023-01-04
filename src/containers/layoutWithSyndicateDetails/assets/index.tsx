import { tokenTableColumns } from '@/containers/layoutWithSyndicateDetails/assets/constants';
import InvestmentsView from '@/containers/layoutWithSyndicateDetails/assets/InvestmentsView';
import TokenTable from '@/containers/layoutWithSyndicateDetails/assets/tokens/TokenTable';
import { getMemberBalance } from '@/hooks/clubs/useClubOwner';
// import { useDemoMode } from '@/hooks/useDemoMode';
import { AppState } from '@/state';
// import { mockOffChainTransactionsData } from '@/utils/mockdata';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Collectibles } from './collectibles';
import { SearchInput } from '@/components/inputs';
import FilterPill from '@/containers/layoutWithSyndicateDetails/activity/shared/FilterPill';
import { assetsDropDownOptions } from '@/containers/layoutWithSyndicateDetails/activity/shared/FilterPill/dropDownOptions';
import { useLegacyTransactions } from '@/hooks/useLegacyTransactions';
import { TransactionCategory } from '@/state/erc20transactions/types';

export enum SortOrderType {
  TOKENS = 'TOKENS',
  OFF_CHAIN_INVESTMENT = 'OFF_CHAIN_INVESTMENT'
}

export const Assets: React.FC<{ isOwner: boolean }> = ({ isOwner }) => {
  const {
    assetsSliceReducer: { tokensResult },
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    }
    /* erc20TokenSliceReducer: {
      erc20Token: { depositsEnabled }
    } */
  } = useSelector((state: AppState) => state);

  let clubAddress = '';
  if (typeof window !== 'undefined') {
    clubAddress = window?.location?.pathname.split('/')[2];
  }

  // const isDemoMode = useDemoMode();

  const DATA_LIMIT = 10;

  const [activeAssetTab, setActiveAssetTab] = useState<string>('all');
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [canNextPage, setCanNextPage] = useState<boolean>(true);
  const [isMember, setIsMember] = useState(false);
  const [showHiddenAssets, setShowHiddenAssets] = useState(false);

  useEffect(() => {
    setActiveAssetTab('all');
  }, [account]);

  useEffect(() => {
    if (!account || !clubAddress || isEmpty(web3)) return;

    getMemberBalance(clubAddress as string, account, web3, activeNetwork).then(
      (balance) => {
        if (balance) {
          setIsMember(true);
        } else {
          setIsMember(false);
        }
      }
    );
  }, [account, clubAddress, web3, activeNetwork]);

  const {
    transactionsLoading,
    numTransactions,
    transactionEvents,
    refetchTransactions
  } = useLegacyTransactions(
    { category: TransactionCategory.INVESTMENT },
    0,
    200,
    false
  );

  useEffect(() => {
    if (activeNetwork.chainId) {
      refetchTransactions();
    }
  }, [pageOffset, activeNetwork.chainId]);

  useEffect(() => {
    const countofTransactions = pageOffset + DATA_LIMIT;
    if (countofTransactions === numTransactions) {
      setCanNextPage(false);
    } else {
      setCanNextPage(true);
    }
    /* } else if (isDemoMode) {
      if (depositsEnabled) {
        dispatch(
          setInvestmentTransactions({
            txns: [],
            skip: 0
          })
        );
        dispatch(setTotalInvestmentTransactionsCount(0));
      } else {
        dispatch(
          setInvestmentTransactions({
            txns: mockOffChainTransactionsData.edges as any,
            skip: pageOffset
          })
        );
        dispatch(
          setTotalInvestmentTransactionsCount(
            mockOffChainTransactionsData.totalCount
          )
        );
      }
    } */
  }, [numTransactions, pageOffset]);

  // get current state to hide/show hidden assets
  useEffect(() => {
    if (window.localStorage) {
      const existingClubsHiddenState =
        JSON.parse(localStorage.getItem('clubsHideAssetsState') as string) ||
        {};
      const currentClubHideAssetsState =
        existingClubsHiddenState[clubAddress as string] || false;
      setShowHiddenAssets(currentClubHideAssetsState);
    }
  }, [clubAddress]);

  // store the state of the hide assets toggle in local storage
  const storeHiddenAssetsState = (hiddenState: boolean) => {
    if (window.localStorage) {
      // get existing clubs hidden assets status
      const existingClubsHiddenState =
        JSON.parse(localStorage.getItem('clubsHideAssetsState') as string) ||
        {};
      existingClubsHiddenState[clubAddress as string] = hiddenState;
      localStorage.setItem(
        'clubsHideAssetsState',
        JSON.stringify(existingClubsHiddenState)
      );
    }

    setShowHiddenAssets(hiddenState);
  };

  // store data on hidden assets in local storage
  const showOrHideAssets = (_contractAddress: string) => {
    // check if club already has hidden assets
    const existingClubsHiddenAssets =
      JSON.parse(localStorage.getItem('hiddenAssets') as string) || {};
    const clubHiddenAssets =
      existingClubsHiddenAssets[clubAddress as string] || [];

    let updatedAssets;
    if (clubHiddenAssets.length) {
      if (clubHiddenAssets.indexOf(_contractAddress) > -1) {
        // unhide hidden asset
        updatedAssets = clubHiddenAssets.filter(
          (contractAddress: string) => contractAddress !== _contractAddress
        );
      } else {
        // hide asset
        updatedAssets = Array.from(
          new Set([...clubHiddenAssets, _contractAddress])
        );
      }
    } else {
      updatedAssets = [_contractAddress];
    }

    // we'll use local storage for now as we wait for the backend implementation
    // to store this data.
    existingClubsHiddenAssets[clubAddress as string] = updatedAssets;
    localStorage.setItem(
      'hiddenAssets',
      JSON.stringify(existingClubsHiddenAssets)
    );
  };

  // store data on current sort column and sort order in local storage
  const storeSortColumn = (
    column: string,
    sortAscending: boolean,
    assetSection: SortOrderType
  ) => {
    // check if club already has hidden assets
    const existingClubAssetsSortOrder =
      JSON.parse(localStorage.getItem('clubAssetsSortOrder') as string) || {};

    const currentClubAssetsSortOrder =
      existingClubAssetsSortOrder[clubAddress as string] || {};

    currentClubAssetsSortOrder[assetSection] = { column, sortAscending };
    existingClubAssetsSortOrder[clubAddress as string] =
      currentClubAssetsSortOrder;

    localStorage.setItem(
      'clubAssetsSortOrder',
      JSON.stringify(existingClubAssetsSortOrder)
    );
  };

  // TO-DO: re-enable this to show search field
  const showSearchField = false;

  return (
    <>
      <div className="mt-14 mb-16">
        {/* filter buttons  */}
        <div className="w-full flex justify-between items-center">
          {/* search assets button  */}
          <div>
            {showSearchField ? (
              <SearchInput
                onChangeHandler={() => null}
                searchValue=""
                searchItem="assets"
              />
            ) : null}
          </div>

          {/* viewing options filter  */}
          <FilterPill
            setFilter={(filter) => setActiveAssetTab(filter)}
            dropDownOptions={assetsDropDownOptions}
            filter={activeAssetTab}
            showViewingOptionsPlaceholder={true}
            showHiddenAssetsToggle={true}
            setShowHiddenAssets={storeHiddenAssetsState}
            showHiddenAssets={showHiddenAssets}
            isOwner={isOwner}
          />
        </div>

        {/* tokens filter active  */}
        {activeAssetTab === 'tokens' && (
          <TokenTable
            columns={tokenTableColumns}
            tableData={tokensResult}
            activeAssetTab={activeAssetTab}
            isOwner={isOwner}
            showHiddenTokens={showHiddenAssets}
            showOrHideTokens={showOrHideAssets}
            storeSortColumn={storeSortColumn}
          />
        )}

        {/* collectibles filter active  */}
        {activeAssetTab === 'nfts' && (
          <div className="mt-16">
            <Collectibles
              showHiddenNfts={showHiddenAssets}
              showOrHideNfts={showOrHideAssets}
              isOwner={isOwner}
            />
          </div>
        )}

        {/* investments filter active  */}
        {activeAssetTab === 'investments' && (
          <div className="mt-16">
            <InvestmentsView
              {...{
                isOwner,
                isMember,
                setPageOffset,
                pageOffset,
                canNextPage,
                transactionsLoading,
                numTransactions,
                transactionEvents,
                dataLimit: DATA_LIMIT,
                refetchTransactions: () => refetchTransactions(),
                storeSortColumn
              }}
            />
          </div>
        )}

        {/* all tabs active  */}
        {(activeAssetTab === 'everything' || activeAssetTab === 'all') && (
          <>
            <TokenTable
              columns={tokenTableColumns}
              tableData={tokensResult}
              activeAssetTab={activeAssetTab}
              isOwner={isOwner}
              showHiddenTokens={showHiddenAssets}
              showOrHideTokens={showOrHideAssets}
              storeSortColumn={storeSortColumn}
            />

            <div className="mt-16">
              <InvestmentsView
                {...{
                  isOwner,
                  isMember,
                  setPageOffset,
                  pageOffset,
                  canNextPage,
                  transactionsLoading,
                  numTransactions,
                  transactionEvents,
                  dataLimit: DATA_LIMIT,
                  refetchTransactions: () => refetchTransactions(),
                  storeSortColumn
                }}
              />
            </div>
            <div className="mt-16">
              <Collectibles
                showHiddenNfts={showHiddenAssets}
                showOrHideNfts={showOrHideAssets}
                isOwner={isOwner}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};
