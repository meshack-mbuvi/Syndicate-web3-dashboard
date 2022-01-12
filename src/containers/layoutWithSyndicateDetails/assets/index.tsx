import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TabsButton from "@/components/TabsButton";
import AssetEmptyState from "@/containers/layoutWithSyndicateDetails/assets/AssetEmptyState";
import Collectibles from "@/containers/layoutWithSyndicateDetails/assets/Collectibles";
import InvestmentsView from "@/containers/layoutWithSyndicateDetails/assets/InvestmentsView";
import { tokenTableColumns } from "@/containers/layoutWithSyndicateDetails/assets/constants";
import TokenTable from "@/containers/layoutWithSyndicateDetails/assets/TokenTable";
import { AppState } from "@/state";
import {
  setLoadingTransactions,
  setInvestmentTransactions,
  setTotalInvestmentTransactionsCount,
} from "@/state/erc20transactions";
import { useFetchRecentTransactions } from "@/hooks/useFetchRecentTransactions";

const Assets: React.FC = () => {
  const {
    assetsSliceReducer: { tokensResult, collectiblesResult },
    web3Reducer: {
      web3: { account },
    },
    transactionsReducer: { totalInvestmentTransactionsCount },
  } = useSelector((state: AppState) => state);

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
    }
  }, [investmentsTransactionsData]);

  const tokensFound = tokensResult.length > 0;
  const collectiblesFound = collectiblesResult.length > 0;
  const investmentsFound = totalInvestmentTransactionsCount > 0;
  const noAssetsFound = !tokensFound && !collectiblesFound && !investmentsFound;

  const showAllAssetsTab =
    [tokensFound, collectiblesFound, investmentsFound].filter(
      (value) => value === true,
    ).length > 1;

  const assetsFilterOptions = [
    {
      label: "All Assets",
      value: "all",
      show: showAllAssetsTab,
    },
    {
      label: "Tokens",
      value: "tokens",
      show: tokensFound && (investmentsFound || collectiblesFound),
    },
    {
      label: "Investments",
      value: "investments",
      show: investmentsFound && (tokensFound || collectiblesFound),
    },
    {
      label: "Collectibles",
      value: "collectibles",
      show: collectiblesFound && (tokensFound || investmentsFound),
    },
  ];

  // return empty state if account has no assets
  if (noAssetsFound) {
    return (
      <div>
        <div className="mt-14 mb-16">
          <TabsButton
            options={assetsFilterOptions}
            value="all"
            onChange={(val) => setActiveAssetTab(val)}
            activeAssetTab={activeAssetTab}
          />
          <AssetEmptyState activeAssetTab={activeAssetTab} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${showAllAssetsTab ? "mt-14" : ""} mb-16`}>
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
            <Collectibles activeAssetTab={activeAssetTab} />
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
                }}
              />
            </div>
            <div className="mt-16">
              <Collectibles activeAssetTab={activeAssetTab} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Assets;
