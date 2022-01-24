import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TabsButton from "@/components/TabsButton";
import Collectibles from "@/containers/layoutWithSyndicateDetails/assets/collectibles";
import InvestmentsView from "@/containers/layoutWithSyndicateDetails/assets/InvestmentsView";
import { tokenTableColumns } from "@/containers/layoutWithSyndicateDetails/assets/constants";
import TokenTable from "@/containers/layoutWithSyndicateDetails/assets/tokens/TokenTable";
import { AppState } from "@/state";
import {
  setLoadingTransactions,
  setInvestmentTransactions,
  setTotalInvestmentTransactionsCount,
} from "@/state/erc20transactions";
import { useFetchRecentTransactions } from "@/hooks/useFetchRecentTransactions";
import { mockOffChainTransactionsData } from "@/utils/mockdata";
import { useRouter } from "next/router";
import { useDemoMode } from "@/hooks/useDemoMode";


const Assets: React.FC = () => {
  const {
    assetsSliceReducer: { tokensResult },
    web3Reducer: {
      web3: { account },
    },
    transactionsReducer: { totalInvestmentTransactionsCount },
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const {query: { clubAddress }} = router;
  const isDemoMode = useDemoMode();

  const dispatch = useDispatch();
  const DATA_LIMIT = 10;

  const [activeAssetTab, setActiveAssetTab] = useState<string>("all");
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [canNextPage, setCanNextPage] = useState<boolean>(true);

  useEffect(() => {
    setActiveAssetTab("all");
  }, [account]);

  // fetch off-chain investment transactions
  const {
    loading: transactionsLoading,
    data: transactionsData,
    refetch: refetchTransactions,
  } = useFetchRecentTransactions(pageOffset, false, {
    metadata: { transactionCategory: "INVESTMENT" },
  });

  const processERC20Transactions = async (txns) => {
    const { edges, totalCount } = txns;
    dispatch(setLoadingTransactions(true));
    dispatch(setInvestmentTransactions({ txns: edges, skip: pageOffset }));
    dispatch(setTotalInvestmentTransactionsCount(totalCount));
    dispatch(setLoadingTransactions(false));
  };

  useEffect(() => {
    refetchTransactions();
  }, [pageOffset]);

  const investmentsTransactionsData = JSON.stringify(
    transactionsData?.Financial_recentTransactions,
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
      dispatch(
        setInvestmentTransactions({
          txns: mockOffChainTransactionsData.edges as any,
          skip: pageOffset,
        }),
      );
      dispatch(
        setTotalInvestmentTransactionsCount(mockOffChainTransactionsData.totalCount),
      );
    }
  }, [investmentsTransactionsData, clubAddress]);

  const assetsFilterOptions = [
    {
      label: "All Assets",
      value: "all",
    },
    {
      label: "Tokens",
      value: "tokens",
    },
    {
      label: "Investments",
      value: "investments",
    },
    {
      label: "Collectibles",
      value: "collectibles",
    },
  ];

  return (
    <>
      <div className="mt-14 mb-16">
        <TabsButton
          options={assetsFilterOptions}
          value="all"
          onChange={(val) => setActiveAssetTab(val)}
          activeAssetTab={activeAssetTab}
        />
        {activeAssetTab === "tokens" && (
          <TokenTable
            columns={tokenTableColumns}
            tableData={tokensResult}
            activeAssetTab={activeAssetTab}
          />
        )}

        {activeAssetTab === "collectibles" && (
          <div className="mt-16">
            <Collectibles />
          </div>
        )}

        {activeAssetTab === "investments" && (
          <div className="mt-16">
            <InvestmentsView
              {...{
                setPageOffset,
                pageOffset,
                canNextPage,
                transactionsLoading,
                dataLimit: DATA_LIMIT,
                refetchTransactions: () => refetchTransactions(),
              }}
            />
          </div>
        )}

        {activeAssetTab === "all" && (
          <>
            <TokenTable
              columns={tokenTableColumns}
              tableData={tokensResult}
              activeAssetTab={activeAssetTab}
            />
            <div className="mt-16">
              <InvestmentsView
                {...{
                  setPageOffset,
                  pageOffset,
                  canNextPage,
                  transactionsLoading,
                  dataLimit: DATA_LIMIT,
                  refetchTransactions: () => refetchTransactions(),
                }}
              />
            </div>
            <div className="mt-16">
              <Collectibles />
            </div>
            
          </>
        )}
      </div>
    </>
  );
};

export default Assets;
