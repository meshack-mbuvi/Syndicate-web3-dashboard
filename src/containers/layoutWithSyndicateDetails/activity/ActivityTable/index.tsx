import { SearchForm } from "@/components/inputs/searchForm";
import TransactionsTable from "@/containers/layoutWithSyndicateDetails/activity/ActivityTable/TransactionsTable";
import { CategoryPill } from "@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill";
import { ANNOTATE_TRANSACTIONS } from "@/graphql/mutations";
import { useIsClubOwner } from "@/hooks/useClubOwner";
import { useDebounce } from "@/hooks/useDebounce";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useFetchRecentTransactions } from "@/hooks/useFetchRecentTransactions";
import { AppState } from "@/state";
import {
  setLoadingTransactions,
  setMyTransactions,
  setTotalTransactionsCount,
} from "@/state/erc20transactions";
import { TransactionCategory } from "@/state/erc20transactions/types";
import {
  mockActivityDepositTransactionsData,
  mockActivityTransactionsData,
} from "@/utils/mockdata";
import { NetworkStatus, useMutation } from "@apollo/client";
import { capitalize } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FilterPill from "../shared/FilterPill";

const ActivityTable: React.FC = () => {
  const dispatch = useDispatch();
  const {
    transactionsReducer: { totalTransactionsCount },
    erc20TokenSliceReducer: {
      erc20Token: { depositsEnabled: isOpenForDeposits },
    },
    web3Reducer: {
      web3: { activeNetwork },
    },
  } = useSelector((state: AppState) => state);
  const isManager = useIsClubOwner();
  const router = useRouter();
  const {
    query: { clubAddress },
  } = router;
  const isDemoMode = useDemoMode();

  const [filter, setFilter] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [canNextPage, setCanNextPage] = useState<boolean>(true);

  // Bulk categorization state
  const [transactionsChecked, setTransactionsChecked] = useState<any[]>([]);
  const [groupCategory, setGroupCategory] =
    useState<TransactionCategory>("SELECT_CATEGORY");
  const [groupTransactionsDestination, setGroupTransactionsDestination] =
    useState<any>([]);
  const [rowCheckboxActiveData, setRowCheckboxActiveData] = useState<any>([]);
  const [activeTransactionHashes, setActiveTransactionHashes] = useState([]);
  const [uncategorisedIcon, setUncategorisedIcon] = useState<string>("");
  const [searchWidth, setSearchWidth] = useState<number>(48);
  const [mockTransactionsData, setMockTransactionsData] = useState<any>(
    mockActivityDepositTransactionsData,
  );

  useEffect(() => {
    if (isOpenForDeposits) {
      setMockTransactionsData(mockActivityDepositTransactionsData);
    } else {
      setMockTransactionsData(mockActivityTransactionsData);
    }
  }, [isOpenForDeposits]);

  useEffect(() => {
    // clearing selection to fix an issue with loader state
    // only showing on selected rows when search is in progress.
    unSelectAllTransactions();

    // one char takes up 8px. Increase input field width as value is typed in.
    const width = 48 + searchValue?.length * 8;

    // input field width should not exceed 320px
    if (width < 320) {
      setSearchWidth(width);
    } else {
      setSearchWidth(320);
    }
  }, [searchValue]);

  // check selected transaction categories and outgoing status
  // we'll use this to show corresponding category pill text and drop-down options.
  useEffect(() => {
    if (transactionsChecked) {
      const categories = new Set(
        transactionsChecked.map((transaction) => {
          return transaction.metadata?.transactionCategory ?? null;
        }),
      );

      // get transactions outgoing status.
      // we'll use this to show the correct icon if the "UNCATEGORISED" option is selected
      // depending on whether all selected transactions are outgoing/incoming or a mix of both.
      const outgoingStatuses = new Set(
        transactionsChecked.map((transaction) => {
          return transaction.isOutgoingTransaction;
        }),
      );

      if (outgoingStatuses.size > 1) {
        setUncategorisedIcon("select-category.svg");
      } else if (outgoingStatuses.size === 1) {
        const selectedOutgoingStatus = Array.from(outgoingStatuses)[0];
        setUncategorisedIcon(
          selectedOutgoingStatus
            ? "outgoing-transaction.svg"
            : "incoming-transaction.svg",
        );
      }

      const transactionHashes = transactionsChecked.map((transaction) => {
        return transaction.hash;
      });
      // we use these to know where to place in-pill loader state
      setActiveTransactionHashes(transactionHashes);
      if (categories.size > 1) {
        setGroupCategory("SELECT_CATEGORY");
      } else if (categories.size === 1 && outgoingStatuses.size === 1) {
        setGroupCategory(Array.from(categories)[0] ?? null);
      } else if (categories.size === 1 && outgoingStatuses.size > 1) {
        setGroupCategory(Array.from(categories)[0]);
      }

      const transactionDestinations = new Set(
        transactionsChecked.map((transaction) => {
          return transaction.isOutgoingTransaction ?? null;
        }),
      );

      if (transactionDestinations.size > 1) {
        setGroupTransactionsDestination(null);
      } else if (transactionDestinations.size === 1) {
        setGroupTransactionsDestination(
          Array.from(transactionDestinations)[0] ?? null,
        );
      }
    }
  }, [transactionsChecked]);

  // mutation to bulk categorise
  const [annotationMutation, { loading: annotationLoading }] = useMutation(
    ANNOTATE_TRANSACTIONS,
  );

  // pagination
  const DATA_LIMIT = 10; // number of items to show on each page.

  /**
   * Generates the query object to be sent to the API to fetch the transactions.
   */
  const generateSearchFilter = (filterValue, searchValue) => {
    let obj = {};
    if (filterValue && filterValue !== "everything") {
      filter === "uncategorised"
        ? (obj = { ...obj, metadata: null })
        : (obj = {
            ...obj,
            metadata: { transactionCategory: `${filter?.toUpperCase()}` },
          });
    }
    if (searchValue) {
      obj = {
        ...obj,
        // Add more items here to be included in the search
        OR: [
          "hash",
          "fromAddress",
          "toAddress",
          "tokenName",
          "tokenSymbol",
        ].map((val) => {
          return { [val]: { contains: searchValue, mode: "insensitive" } };
        }),
      };
    }
    return obj;
  };

  /**
   * Generates the empty states based on the filter and searchValue
   * @param filter :string ;
   * @param searchValue : string
   * @returns JSX.Element
   */
  const generateEmptyStates = (filter, searchValue) => {
    const cleanedFilter = capitalize(filter?.replaceAll("_", " "));

    let title = "";
    let description = "";
    if (searchValue) {
      title = `No results for "${searchValue}"`;
      description = `You can search for transaction IDs, sender or recipient addresses,
      tokens and symbols, or companies.`;
    }

    if (filter && !searchValue && filter === "uncategorised") {
      title = "No uncategorised transactions";
      description =
        "There are currently no uncategorised transactions in this club’s activity.";
    } else {
      if (!searchValue && filter) {
        title = `No transactions categorised as “${cleanedFilter}”`;
        description = `There are currently no transactions categorised as "${cleanedFilter}" in this club’s activity.`;
      } else if (!searchValue && !filter) {
        title = "No activity yet";
        description =
          "Once assets start moving in and out of this club, you will see what’s happening here.";
      }
    }

    return (
      <>
        <p className="text-xl">{title}</p>
        <p className="pt-4 text-gray-syn4">{description}</p>
      </>
    );
  };

  const debouncedSearchTerm = useDebounce(searchValue, 700);
  const memoizedSearchTerm = useMemo(
    () => debouncedSearchTerm,
    [debouncedSearchTerm],
  );

  const {
    loading: transactionsLoading,
    data: transactionsData,
    refetch: refetchTransactions,
    networkStatus,
  } = useFetchRecentTransactions(pageOffset, false, {
    ...generateSearchFilter(filter, memoizedSearchTerm),
  });

  useEffect(() => {
    if (filter) setPageOffset(0);
  }, [filter]);

  useEffect(() => {
    if (isDemoMode) {
      filterMockTransactions();
    } else {
      refetchTransactions();
    }
  }, [pageOffset, filter, isDemoMode, searchValue, activeNetwork.chainId]);

  useEffect(() => {
    if (transactionsData?.Financial_recentTransactions) {
      processERC20Transactions(transactionsData.Financial_recentTransactions);
      // disable next page button if no.of transactions is less than limit.
      const { edges } = transactionsData.Financial_recentTransactions;
      const countofTransactions = pageOffset + DATA_LIMIT;

      if (
        edges.length < DATA_LIMIT ||
        countofTransactions === totalTransactionsCount
      ) {
        setCanNextPage(false);
      } else {
        setCanNextPage(true);
      }
    } else if (isDemoMode) {
      processERC20Transactions(mockTransactionsData);
    }
  }, [
    JSON.stringify(transactionsData?.Financial_recentTransactions),
    clubAddress,
    mockTransactionsData,
    totalTransactionsCount,
  ]);

  const processERC20Transactions = async (txns) => {
    const { edges, totalCount } = txns;
    dispatch(setLoadingTransactions(true));
    dispatch(setMyTransactions({ txns: edges, skip: pageOffset }));
    dispatch(setTotalTransactionsCount(totalCount));
    dispatch(setLoadingTransactions(false));
  };

  // stuff to filter transactions with in the search input
  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);
  };

  // filter function for mock transaction data
  const manualMockDataFilter = (searchParam: string): boolean => {
    const searchTerm = searchValue.toLowerCase();

    // using indexOf here instead of includes because the former has more support browsers-wise.
    return searchParam.toLowerCase().indexOf(searchTerm) > -1;
  };
  const filterMockTransactions = () => {
    const data = isOpenForDeposits
      ? mockActivityDepositTransactionsData
      : mockActivityTransactionsData;
    let filteredData;
    if (filter && filter !== "everything") {
      filteredData = data.edges.filter(
        (transaction) =>
          transaction.metadata.transactionCategory === filter.toUpperCase(),
      );
    }

    if (searchValue) {
      filteredData = data.edges.filter((transaction) => {
        const { hash, fromAddress, toAddress, tokenName, tokenSymbol } =
          transaction;

        return (
          manualMockDataFilter(hash) ||
          manualMockDataFilter(fromAddress) ||
          manualMockDataFilter(toAddress) ||
          manualMockDataFilter(tokenName) ||
          manualMockDataFilter(tokenSymbol)
        );
      });
    }

    setMockTransactionsData({
      edges: filteredData,
      totalCount: filteredData?.length,
    });

    // reset filters
    if (
      (filter === "everything" && !searchValue) ||
      (!searchValue && !filter)
    ) {
      setMockTransactionsData(data);
    }
  };

  // pagination functions
  function goToNextPage() {
    setPageOffset((_offset) => _offset + DATA_LIMIT);

    // clear selected transactions
    unSelectAllTransactions();
  }

  function goToPreviousPage() {
    setPageOffset((_offset) => _offset - DATA_LIMIT);

    // clear selected transactions
    unSelectAllTransactions();
  }

  // bulk annotate
  const bulkCategoriseTransactions = (selectedCategory: string) => {
    const outgoingCategories = ["INVESTMENT", "EXPENSE"];
    const incomingCategories = ["INVESTMENT_TOKEN"];

    let listData;
    if (outgoingCategories.indexOf(selectedCategory) > -1) {
      listData = transactionsChecked.filter(
        (transaction) => transaction.isOutgoingTransaction === true,
      );
    } else if (incomingCategories.indexOf(selectedCategory) > -1) {
      listData = transactionsChecked.filter(
        (transaction) => transaction.isOutgoingTransaction === false,
      );
    } else if (selectedCategory === "OTHER" || selectedCategory === null) {
      listData = transactionsChecked;
    }

    const txnAnnotationListData = listData.map((transaction) => ({
      transactionId: transaction.hash,
      transactionCategory: selectedCategory,
    }));

    annotationMutation({
      variables: {
        transactionAnnotationList: txnAnnotationListData,
      },
      context: { clientName: "backend", chainId: activeNetwork.chainId },
    });

    if (!annotationLoading) {
      refetchTransactions();
    }
  };

  const unSelectAllTransactions = () => {
    setRowCheckboxActiveData([]);
    setTransactionsChecked([]);
  };

  //show/hide row checkboxes
  const toggleRowCheckbox = (
    checkboxIndex: number,
    checkboxVisible: boolean,
  ) => {
    if (!isManager) return;
    const data = transactionsData?.Financial_recentTransactions?.edges?.map(
      (item, index) => {
        return {
          ...item,
          checkboxVisible:
            rowCheckboxActiveData[index]?.checkboxActive ?? false,
          checkboxActive: rowCheckboxActiveData[index]?.checkboxActive ?? false,
        };
      },
    );

    if (
      !rowCheckboxActiveData[checkboxIndex]?.checkboxActive &&
      data?.[checkboxIndex]
    ) {
      data[checkboxIndex]["checkboxVisible"] = checkboxVisible;
    }

    setRowCheckboxActiveData(data);
  };

  // checkbox handle check
  const handleSelect = (e, index: number) => {
    rowCheckboxActiveData[index]["checkboxActive"] = e.target.checked;

    // track number of transactions selected.
    setTransactionsChecked(
      rowCheckboxActiveData.filter((row) => row.checkboxActive),
    );
  };

  const transactionDataLength = useMemo(
    () => transactionsData?.Financial_recentTransactions?.edges?.length,
    [transactionsData?.Financial_recentTransactions?.edges?.length],
  );

  return (
    <div className="mt-2 w-full -z-10">
      <div className="py-14 flex justify-between items-center">
        <div className="flex flex-col sm:flex-row justify-start sm:items-center">
          <div className="pr-8">
            <FilterPill setFilter={(filter) => setFilter(filter)} />
          </div>
          <div className="mt-4 sm:mt-auto">
            <SearchForm
              {...{
                onChangeHandler: handleSearchOnChange,
                searchValue,
                searchItem: "activity",
                clearSearchValue: () => setSearchValue(""),
                disabled:
                  filter &&
                  !transactionsLoading &&
                  !transactionsData?.Financial_recentTransactions?.edges
                    ?.length &&
                  !searchValue &&
                  !mockTransactionsData.edges.length,
                width: searchWidth,
              }}
            />
          </div>
        </div>
        {transactionsChecked.length > 0 && transactionDataLength ? (
          <div className="flex justify-between items-center space-x-8">
            <div className="text-gray-syn4">
              <span>{`${transactionsChecked.length} of ${transactionDataLength} selected:`}</span>
            </div>
            <CategoryPill
              category={groupCategory}
              outgoing={groupTransactionsDestination}
              bulkCategoriseTransactions={bulkCategoriseTransactions}
              uncategorisedIcon={uncategorisedIcon}
            />
            <div
              className="flex justify-start cursor-pointer"
              onClick={() => unSelectAllTransactions()}
              aria-hidden={true}
            >
              <Image
                src="/images/actionIcons/unselectAllCheckboxes.svg"
                height={16}
                width={16}
              />
              <span className="ml-2">Unselect all</span>
            </div>
          </div>
        ) : null}
      </div>
      <div className="overflow-x-scroll no-scroll-bar">
        <TransactionsTable
          canNextPage={canNextPage}
          dataLimit={DATA_LIMIT}
          pageOffset={pageOffset}
          refetchTransactions={refetchTransactions}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          transactionsLoading={
            transactionsLoading || networkStatus === NetworkStatus.refetch
          }
          emptyState={generateEmptyStates(filter, memoizedSearchTerm)}
          toggleRowCheckbox={toggleRowCheckbox}
          handleCheckboxSelect={handleSelect}
          rowCheckboxActiveData={rowCheckboxActiveData}
          activeTransactionHashes={activeTransactionHashes}
          setActiveTransactionHashes={setActiveTransactionHashes}
        />
      </div>
    </div>
  );
};

export default ActivityTable;
