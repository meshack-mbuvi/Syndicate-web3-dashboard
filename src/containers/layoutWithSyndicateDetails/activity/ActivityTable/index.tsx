import { SearchInput } from '@/components/inputs';
import TransactionsTable from '@/containers/layoutWithSyndicateDetails/activity/ActivityTable/TransactionsTable';
import { CategoryPill } from '@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill';
import { activityDropDownOptions } from '@/containers/layoutWithSyndicateDetails/activity/shared/FilterPill/dropDownOptions';
import { ANNOTATE_TRANSACTIONS } from '@/graphql/mutations';
import { useDemoMode } from '@/hooks/useDemoMode';
import {
  getInput,
  SyndicateAnnotation,
  SyndicateEvents,
  SyndicateTransfers,
  useLegacyTransactions
} from '@/hooks/useLegacyTransactions';
import useForceUpdate from '@/hooks/utils/forceUpdate';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { TransactionCategory } from '@/state/erc20transactions/types';
import { getWeiAmount } from '@/utils/conversions';
import {
  mockActivityDepositTransactionsData,
  mockActivityTransactionsData
} from '@/utils/mockdata';
import { useMutation } from '@apollo/client';
import { capitalize } from 'lodash';
import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import FilterPill from '../shared/FilterPill';

interface DistributionTokenDetails {
  annotation: SyndicateAnnotation;
  hash: string;
  timestamp: number;
  ownerAddress: string;
  syndicateEvents: Array<SyndicateEvents>;
  transfers: Array<SyndicateTransfers>;
  tokenName: string | undefined;
  tokenSymbol: string | undefined;
  tokenDecimal: number | undefined;
  icon: string | undefined;
  tokenAmount: number | undefined;
  isOutgoingTransaction?: boolean;
}

export interface BatchIdTokenDetails {
  [key: string]: Array<DistributionTokenDetails>;
}
interface IActivityTable {
  isOwner: boolean;
}

const ActivityTable: React.FC<IActivityTable> = ({ isOwner }) => {
  const {
    erc20TokenSliceReducer: {
      erc20Token: {
        depositsEnabled: isOpenForDeposits,
        address: erc20TokenAddress
      }
    },
    web3Reducer: {
      web3: { web3, activeNetwork, account }
    }
  } = useSelector((state: AppState) => state);

  const isDemoMode = useDemoMode();

  const [filter, setFilter] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [canNextPage, setCanNextPage] = useState<boolean>(true);

  // Bulk categorization state
  const [transactionsChecked, setTransactionsChecked] = useState<any[]>([]);
  const [groupCategory, setGroupCategory] =
    useState<TransactionCategory>('SELECT_CATEGORY');
  const [groupTransactionsDestination, setGroupTransactionsDestination] =
    useState<any>([]);
  const [rowCheckboxActiveData, setrowCheckboxActiveData] = useState<any>({});
  const [activeTransactionHashes, setActiveTransactionHashes] = useState([]);
  const [uncategorizedIcon, setUncategorizedIcon] = useState<string>('');
  const [searchWidth, setSearchWidth] = useState<number>(48);
  const [mockTransactionsData, setMockTransactionsData] = useState<any>(
    mockActivityDepositTransactionsData
  );

  const forceUpdate = useForceUpdate();

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
          return transaction.annotation?.transactionCategory ?? null;
        })
      );

      // get transactions outgoing status.
      // we'll use this to show the correct icon if the "UNCATEGORIZED" option is selected
      // depending on whether all selected transactions are outgoing/incoming or a mix of both.
      const outgoingStatuses = new Set(
        transactionsChecked.map((transaction) => {
          return transaction.isOutgoingTransaction;
        })
      );

      if (outgoingStatuses.size > 1) {
        setUncategorizedIcon('/images/activity/select-category.svg');
      } else if (outgoingStatuses.size === 1) {
        const selectedOutgoingStatus = Array.from(outgoingStatuses)[0];
        setUncategorizedIcon(
          selectedOutgoingStatus
            ? '/images/activity/outgoing-transaction.svg'
            : '/images/activity/incoming-transaction.svg'
        );
      }

      const transactionHashes = transactionsChecked.map((transaction) => {
        return transaction.hash;
      });

      // we use these to know where to place in-pill loader state
      // @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
      setActiveTransactionHashes(transactionHashes);
      if (categories.size > 1) {
        setGroupCategory('SELECT_CATEGORY');
      } else if (categories.size === 1 && outgoingStatuses.size === 1) {
        setGroupCategory(Array.from(categories)[0] ?? null);
      } else if (categories.size === 1 && outgoingStatuses.size > 1) {
        setGroupCategory(Array.from(categories)[0]);
      }

      const transactionDestinations = new Set(
        transactionsChecked.map((transaction) => {
          return transaction.isOutgoingTransaction ?? null;
        })
      );

      if (transactionDestinations.size > 1) {
        setGroupTransactionsDestination(null);
      } else if (transactionDestinations.size === 1) {
        setGroupTransactionsDestination(
          Array.from(transactionDestinations)[0] ?? null
        );
      }
    }
  }, [transactionsChecked]);

  // mutation to bulk categorise
  const [annotationMutation, { loading: annotationLoading }] = useMutation(
    ANNOTATE_TRANSACTIONS
  );

  // pagination
  const DATA_LIMIT = 10; // number of items to show on each page.

  /**
   * Generates the query object to be sent to the API to fetch the transactions.
   */
  const generateSearchFilter = (filterValue: string, searchValue: string) => {
    let obj = {};
    if (filterValue) {
      obj = {
        ...obj,
        category: filterValue
      };
    }
    if (searchValue) {
      obj = {
        ...obj,
        search: searchValue
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
  const generateEmptyStates = (filter: any, searchValue: any) => {
    const cleanedFilter = capitalize(filter?.replaceAll('_', ' '));

    let title = '';
    let description = '';
    if (searchValue) {
      title = `No results for "${searchValue}"`;
      description = `You can search for transaction IDs, sender or recipient addresses,
      tokens and symbols, or companies.`;
    }

    if (filter && !searchValue && filter === 'uncategorized') {
      title = 'No uncategorized transactions';
      description =
        'There are currently no uncategorized transactions in this club’s activity.';
    } else {
      if (!searchValue && filter) {
        title = `No transactions categorised as “${cleanedFilter}”`;
        description = `There are currently no transactions categorised as "${cleanedFilter}" in this club’s activity.`;
      } else if (!searchValue && !filter) {
        title = 'No activity yet';
        description =
          'Once assets start moving in and out of this club, you will see what’s happening here.';
      }
    }

    return (
      <>
        <p className="text-xl">{title}</p>
        <p className="pt-4 text-gray-syn4">{description}</p>
      </>
    );
  };

  const memoizedSearchTerm = useMemo(() => searchValue, [searchValue]);

  const [batchIdentifiers, setBatchIdentifiers] = useState<BatchIdTokenDetails>(
    {}
  );

  let activityViewLength = 0;
  Object.keys(batchIdentifiers).map(function (key) {
    if (key === 'nonDistributionTransactions') {
      activityViewLength += batchIdentifiers[key].length;
    } else {
      activityViewLength += 1;
    }
  });

  const {
    transactionsLoading,
    numTransactions,
    transactionEvents,
    refetchTransactions
  } = useLegacyTransactions(
    {
      ...generateSearchFilter(filter, memoizedSearchTerm)
    },
    pageOffset,
    100,
    false
  );

  const [transactionEventsState, setTransactionEventsState] = useState<any>();

  useEffect(() => {
    if (isDemoMode) {
      setTransactionEventsState(mockTransactionsData.events);
    } else {
      if (transactionsLoading) return;

      setTransactionEventsState(transactionEvents);
      const countofTransactions = pageOffset + DATA_LIMIT;

      if (
        numTransactions < DATA_LIMIT ||
        countofTransactions === numTransactions
      ) {
        setCanNextPage(false);
      } else {
        setCanNextPage(true);
      }
    }
  }, [
    numTransactions,
    pageOffset,
    JSON.stringify(transactionEvents),
    transactionsLoading
  ]);

  // Prepares token distributions per distributionBatch
  useEffect(() => {
    if (!transactionEventsState || transactionEventsState[0]?.length == 0)
      return;
    const batchIds: BatchIdTokenDetails = {};
    let newBatchIdValue: Array<DistributionTokenDetails> = [];
    let last = '';

    transactionEventsState.map(
      (transaction: {
        [x: string]: any;
        transfers?: any;
        annotation?: any;
        hash?: any;
        timestamp?: any;
        ownerAddress?: any;
        syndicateEvents?: any;
        contractAddress?: any;
      }) => {
        const {
          annotation,
          hash,
          timestamp,
          ownerAddress,
          syndicateEvents,
          contractAddress,
          transfers,
          ...rest
        } = transaction;

        /**
         * For erc20 token, the first transfer recorded is incorrect.
         * The second item seems to have the correct data
         * */
        const transfer = transfers[1] ?? transfers[0];

        const newTokenDetails: DistributionTokenDetails = {
          ...rest,
          annotation,
          hash,
          timestamp,
          ownerAddress: ownerAddress,
          transfers: transfers,
          syndicateEvents: syndicateEvents,
          tokenName:
            contractAddress === ''
              ? activeNetwork.nativeCurrency.name
              : transfer.tokenName,
          tokenSymbol:
            contractAddress === ''
              ? activeNetwork.nativeCurrency.symbol
              : transfer.tokenSymbol,
          tokenDecimal:
            contractAddress === ''
              ? Number(activeNetwork.nativeCurrency.decimals)
              : transfer.tokenDecimal,
          icon:
            contractAddress === ''
              ? activeNetwork.nativeCurrency.logo
              : transfer.tokenLogo,
          tokenAmount:
            contractAddress === ''
              ? getWeiAmount(
                  web3,
                  String(transfer.value),
                  Number(activeNetwork.nativeCurrency.decimals),
                  false
                )
              : getWeiAmount(
                  web3,
                  String(transfer.value),
                  Number(transfer.tokenDecimal),
                  false
                )
        };

        if (
          syndicateEvents?.length === 0 ||
          syndicateEvents[0]?.eventType !== 'MEMBER_DISTRIBUTED'
        ) {
          const newId = uuidv4();
          batchIds[`nonBatching-${newId}`] = [
            {
              ...newTokenDetails,
              isOutgoingTransaction: ownerAddress === transfer?.from
            }
          ];
          return;
        }

        const event = syndicateEvents[0];
        // Checks if transaction is a Distribution
        if (event.distributionBatch) {
          if (last === '' || last !== event.distributionBatch) {
            last = event.distributionBatch;
            newBatchIdValue = [];
          }
          newBatchIdValue.push(newTokenDetails);
        }

        batchIds[event.distributionBatch] = newBatchIdValue;
      }
    );

    setBatchIdentifiers(batchIds);
  }, [
    activeNetwork.nativeCurrency.decimals,
    activeNetwork.nativeCurrency.name,
    activeNetwork.nativeCurrency.symbol,
    activeNetwork.nativeCurrency.logo,
    transactionEventsState
  ]);

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

  // stuff to filter transactions with in the search input
  const handleSearchOnChange = (e: any): void => {
    setSearchValue(e.target.value);
  };

  // filter function for mock transaction data
  const manualMockDataFilter = (searchParam: string): boolean => {
    const searchTerm = searchValue.toLowerCase();

    // using indexOf here instead of includes because the former has more support browsers-wise.
    return searchParam.toLowerCase().indexOf(searchTerm) > -1;
  };

  const filterMockTransactions = (): void => {
    const data = isOpenForDeposits
      ? mockActivityDepositTransactionsData
      : mockActivityTransactionsData;
    let filteredData;
    if (filter && filter !== 'everything') {
      filteredData = data.events.filter(
        (transaction) =>
          transaction.annotation?.transactionCategory === filter.toUpperCase()
      );
    }

    if (searchValue) {
      filteredData = data.events.filter((transaction: any) => {
        const { hash, from, to, tokenName, tokenSymbol } = transaction;

        return (
          manualMockDataFilter(hash) ||
          manualMockDataFilter(from) ||
          manualMockDataFilter(to) ||
          manualMockDataFilter(tokenName) ||
          manualMockDataFilter(tokenSymbol)
        );
      });
    }

    setMockTransactionsData({
      events: filteredData,
      // @ts-expect-error TS(2454): Variable 'filteredData' is used before being assig... Remove this comment to see the full error message
      totalCount: filteredData?.length
    });

    // reset filters
    if (
      (filter === 'everything' && !searchValue) ||
      (!searchValue && !filter)
    ) {
      setMockTransactionsData(data);
    }
  };

  // pagination functions
  function goToNextPage(): void {
    setPageOffset((_offset) => _offset + DATA_LIMIT);

    // clear selected transactions
    unSelectAllTransactions();
  }

  function goToPreviousPage(): void {
    setPageOffset((_offset) => _offset - DATA_LIMIT);

    // clear selected transactions
    unSelectAllTransactions();
  }

  // bulk annotate
  const bulkCategoriseTransactions = (selectedCategory: string): void => {
    const outgoingCategories = ['INVESTMENT', 'EXPENSE'];
    const incomingCategories = ['INVESTMENT_TOKEN'];

    let listData = [];
    if (outgoingCategories.indexOf(selectedCategory) > -1) {
      listData = transactionsChecked.filter(
        (transaction) => transaction.isOutgoingTransaction === true
      );
    } else if (incomingCategories.indexOf(selectedCategory) > -1) {
      listData = transactionsChecked.filter(
        (transaction) => transaction.isOutgoingTransaction === false
      );
    } else if (selectedCategory === 'OTHER' || selectedCategory === null) {
      listData = transactionsChecked;
    }

    const txnAnnotationListData = listData.map((transaction) => ({
      transactionId: transaction.hash,
      transactionCategory: selectedCategory
    }));

    annotationMutation({
      variables: {
        transactionAnnotationList: txnAnnotationListData,
        chainId: activeNetwork.chainId,
        input: getInput(`${erc20TokenAddress}:${account}`)
      },
      context: {
        clientName: SUPPORTED_GRAPHS.BACKEND,
        chainId: activeNetwork.chainId
      }
    });

    if (!annotationLoading) {
      refetchTransactions();
    }
  };

  const unSelectAllTransactions = (): void => {
    setTransactionsChecked([]);
    setrowCheckboxActiveData({});
  };

  //show/hide row checkboxes
  const toggleRowCheckbox = (
    batchId: string,
    checkboxVisible: boolean
  ): void => {
    if (!isOwner) return;
    if (batchId) {
      // active batch IDs
      const _batchIdCopy = rowCheckboxActiveData;
      _batchIdCopy[batchId] = {
        ...batchIdentifiers[batchId][0],
        checkboxVisible:
          rowCheckboxActiveData[batchId]?.checkboxActive ?? false,
        checkboxActive: rowCheckboxActiveData[batchId]?.checkboxActive ?? false
      };

      if (
        !rowCheckboxActiveData[batchId]?.checkboxActive &&
        rowCheckboxActiveData[batchId]
      ) {
        _batchIdCopy[`${batchId}`].checkboxVisible = checkboxVisible;
      }

      forceUpdate();

      setrowCheckboxActiveData(_batchIdCopy);
    }
  };

  // checkbox handle check
  const handleSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    batchId: string
  ): void => {
    const _batchIdCopy = {
      ...rowCheckboxActiveData,
      [batchId]: {
        ...batchIdentifiers[batchId][0],
        ...rowCheckboxActiveData[batchId],
        checkboxActive: e.target.checked
      }
    };

    setrowCheckboxActiveData(_batchIdCopy);

    // track number of transactions selected.
    setTransactionsChecked(
      Object.values(_batchIdCopy).filter((row: any) => row.checkboxActive)
    );
  };

  return (
    <div className="mt-2 w-full -z-10">
      <div className="py-14 flex justify-between items-center">
        <div className="flex flex-col sm:flex-row justify-start sm:items-center">
          <div className="pr-8">
            <FilterPill
              setFilter={(filter): void => setFilter(filter)}
              dropDownOptions={activityDropDownOptions}
            />
          </div>
          <div className="mt-4 sm:mt-auto">
            <SearchInput
              onChangeHandler={handleSearchOnChange}
              searchValue={searchValue}
              searchItem={'activity'}
              clearSearchValue={(): void => setSearchValue('')}
              disabled={
                filter !== '' &&
                !transactionsLoading &&
                !numTransactions &&
                !searchValue &&
                !mockTransactionsData.events.length
              }
              width={searchWidth}
            />
          </div>
        </div>
        {transactionsChecked.length > 0 && numTransactions ? (
          <div className="flex justify-between items-center space-x-8">
            <div className="text-gray-syn4">
              <span>{`${transactionsChecked.length} of ${numTransactions} selected:`}</span>
            </div>
            <CategoryPill
              category={groupCategory}
              outgoing={groupTransactionsDestination}
              bulkCategoriseTransactions={bulkCategoriseTransactions}
              uncategorizedIcon={uncategorizedIcon}
              isOwner={isOwner}
            />
            <div
              className="flex justify-start cursor-pointer"
              onClick={(): void => unSelectAllTransactions()}
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

      {/* removed overflow settings here because the categories drop-down gets cut off
      and requires scrolling to reveal.
      Feel free to re-introduce if a better fix is found. */}
      <TransactionsTable
        canNextPage={canNextPage}
        isOwner={isOwner}
        dataLimit={DATA_LIMIT}
        pageOffset={pageOffset}
        activityViewLength={activityViewLength}
        refetchTransactions={refetchTransactions}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        transactionsLoading={transactionsLoading}
        numTransactions={numTransactions}
        batchIdentifiers={batchIdentifiers}
        emptyState={generateEmptyStates(filter, memoizedSearchTerm)}
        toggleRowCheckbox={toggleRowCheckbox}
        handleCheckboxSelect={handleSelect}
        rowCheckboxActiveData={rowCheckboxActiveData}
        activeTransactionHashes={activeTransactionHashes}
        // @ts-expect-error TS(2322): Type 'Dispatch<SetStateAction<never[]>>' is not as... Remove this comment to see the full error message
        setActiveTransactionHashes={setActiveTransactionHashes}
      />
    </div>
  );
};

export default ActivityTable;
