import TabsButton from '@/components/TabsButton';
import { tokenTableColumns } from '@/containers/layoutWithSyndicateDetails/assets/constants';
import InvestmentsView from '@/containers/layoutWithSyndicateDetails/assets/InvestmentsView';
import TokenTable from '@/containers/layoutWithSyndicateDetails/assets/tokens/TokenTable';
import { getMemberBalance } from '@/hooks/clubs/useClubOwner';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useFetchRecentTransactions } from '@/hooks/useFetchRecentTransactions';
import { AppState } from '@/state';
import {
  setInvestmentTransactions,
  setLoadingTransactions,
  setTotalInvestmentTransactionsCount
} from '@/state/erc20transactions';
import { mockOffChainTransactionsData } from '@/utils/mockdata';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Collectibles from './collectibles';

const Assets: React.FC<{ isOwner: boolean }> = ({ isOwner }) => {
  const {
    assetsSliceReducer: { tokensResult },
    web3Reducer: {
      web3: { account, activeNetwork, web3 }
    },
    transactionsReducer: { totalInvestmentTransactionsCount },
    erc20TokenSliceReducer: {
      erc20Token: { depositsEnabled }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const {
    query: { clubAddress }
  } = router;
  const isDemoMode = useDemoMode();

  const dispatch = useDispatch();
  const DATA_LIMIT = 10;

  const [activeAssetTab, setActiveAssetTab] = useState<string>('all');
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [canNextPage, setCanNextPage] = useState<boolean>(true);
  const [isMember, setIsMember] = useState(false);

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

  // fetch off-chain investment transactions
  const {
    loading: transactionsLoading,
    data: transactionsData,
    refetch: refetchTransactions
  } = useFetchRecentTransactions(pageOffset, false, {
    metadata: { transactionCategory: 'INVESTMENT' }
  });

  const processERC20Transactions = async (txns: any) => {
    const { edges, totalCount } = txns;
    dispatch(setLoadingTransactions(true));
    dispatch(setInvestmentTransactions({ txns: edges, skip: pageOffset }));
    dispatch(setTotalInvestmentTransactionsCount(totalCount));
    dispatch(setLoadingTransactions(false));
  };

  useEffect(() => {
    if (activeNetwork.chainId) {
      refetchTransactions();
    }
  }, [pageOffset, activeNetwork.chainId]);

  const investmentsTransactionsData = JSON.stringify(
    transactionsData?.Financial_recentTransactions
  );
  useEffect(() => {
    if (transactionsData?.Financial_recentTransactions) {
      processERC20Transactions(transactionsData.Financial_recentTransactions);
      // disable next page button if no.of transactions is less than limit.
      const { edges } = transactionsData.Financial_recentTransactions;
      const countofTransactions = pageOffset + DATA_LIMIT;

      if (
        edges.length < DATA_LIMIT ||
        countofTransactions === totalInvestmentTransactionsCount
      ) {
        setCanNextPage(false);
      } else {
        setCanNextPage(true);
      }
    } else if (isDemoMode) {
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
    }
  }, [investmentsTransactionsData, clubAddress, depositsEnabled]);

  const assetsFilterOptions = [
    {
      label: 'All Assets',
      value: 'all'
    },
    {
      label: 'Tokens',
      value: 'tokens'
    },
    {
      label: 'Investments',
      value: 'investments'
    },
    {
      label: 'Collectibles',
      value: 'collectibles'
    }
  ];

  return (
    <>
      <div className="mt-14 mb-16">
        <TabsButton
          options={assetsFilterOptions}
          value="all"
          onChange={(val) => setActiveAssetTab(val)}
          activeTab={activeAssetTab}
        />
        {activeAssetTab === 'tokens' && (
          <TokenTable
            columns={tokenTableColumns}
            tableData={tokensResult}
            activeAssetTab={activeAssetTab}
            isOwner={isOwner}
          />
        )}

        {activeAssetTab === 'collectibles' && (
          <div className="mt-16">
            <Collectibles isOwner={isOwner} />
          </div>
        )}

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
                dataLimit: DATA_LIMIT,
                refetchTransactions: () => refetchTransactions()
              }}
            />
          </div>
        )}

        {activeAssetTab === 'all' && (
          <>
            <TokenTable
              columns={tokenTableColumns}
              tableData={tokensResult}
              activeAssetTab={activeAssetTab}
              isOwner={isOwner}
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
                  dataLimit: DATA_LIMIT,
                  refetchTransactions: () => refetchTransactions()
                }}
              />
            </div>
            <div className="mt-16">
              <Collectibles isOwner={isOwner} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Assets;
