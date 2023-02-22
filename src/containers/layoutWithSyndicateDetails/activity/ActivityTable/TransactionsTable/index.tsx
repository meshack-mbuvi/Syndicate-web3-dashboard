import { SkeletonLoader } from '@/components/skeletonLoader';
import useOnClickOutside from '@/containers/createInvestmentClub/shared/useOnClickOutside';
import ActivityModal from '@/containers/layoutWithSyndicateDetails/activity/shared/ActivityModal';
import { CategoryPill } from '@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill';
import TransactionDetails from '@/containers/layoutWithSyndicateDetails/activity/shared/TransactionDetails';
import useClubTokenMembers from '@/hooks/clubs/useClubTokenMembers';
import useModal from '@/hooks/useModal';
import { AppState } from '@/state';
import {
  emptyCurrentTransaction,
  TransactionCategory
} from '@/state/erc20transactions/types';
import { getWeiAmount } from '@/utils/conversions';
import { isEmpty } from 'lodash';
import moment from 'moment';
import Image from 'next/image';
import { FC, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import BatchTransactionDetails from '../../shared/BatchTransactionDetails';
import { BatchIdTokenDetails } from '../index';

interface ITransactionsTableProps {
  canNextPage: boolean;
  isOwner: boolean;
  dataLimit: number;
  numTransactions: number;
  pageOffset: number;
  activityViewLength: number;
  refetchTransactions: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  transactionsLoading: boolean;
  batchIdentifiers: BatchIdTokenDetails;
  emptyState: JSX.Element;
  toggleRowCheckbox: (batchKey: string, checkboxVisible: boolean) => void;
  handleCheckboxSelect: (e: any, key: string) => void;
  rowCheckboxActiveData: any;
  activeTransactionHashes?: Array<string>;
  setActiveTransactionHashes?: (transactionHashes: Array<string>) => void;
}

const TransactionsTable: FC<ITransactionsTableProps> = ({
  canNextPage,
  dataLimit,
  pageOffset,
  numTransactions,
  activityViewLength,
  refetchTransactions,
  goToPreviousPage,
  goToNextPage,
  transactionsLoading,
  batchIdentifiers,
  emptyState,
  toggleRowCheckbox,
  handleCheckboxSelect,
  rowCheckboxActiveData,
  activeTransactionHashes,
  setActiveTransactionHashes,
  isOwner
}) => {
  const {
    erc20TokenSliceReducer: { erc20Token },
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const ref = useRef(null);
  useOnClickOutside(ref, () => setCurrentBatchIdentifier(''));

  const [pillHover, setPillHover] = useState<any>({});
  const [currentTransaction, setCurrentTransaction] = useState(
    emptyCurrentTransaction
  );
  const [currentBatchIdentifier, setCurrentBatchIdentifier] =
    useState<string>('');
  // table functionality
  const [inlineCategorising, setInlineCategorising] = useState<boolean>(false);
  const [isAnnotationsModalShown, setIsAnnotationsModalShown] =
    useState<boolean>(false);
  const [showAnnotationsModal, toggleShowAnnotationsModal] = useModal();
  const [checkboxActive, setCheckboxActive] = useState<boolean>(false);
  const [showNote, setShowNote] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const { clubMembers } = useClubTokenMembers();

  // loading state for transactions table.
  const loaderContent = (
    <div>
      {[...Array(4).keys()].map((index) => {
        return (
          <div
            className="grid grid-cols-12 gap-5 border-b-1 border-gray-syn6 py-3"
            key={index}
          >
            <div className="flex justify-start items-center w-full col-span-3">
              <SkeletonLoader
                width="8"
                height="8"
                borderRadius="rounded-full"
                customClass="mr-2"
              />
              <SkeletonLoader width="40" height="6" borderRadius="rounded-lg" />
            </div>
            <div className="flex justify-start items-center w-full col-span-3">
              <SkeletonLoader width="96" height="6" borderRadius="rounded-lg" />
            </div>
            <div className="flex items-center justify-end col-span-6">
              <SkeletonLoader width="36" height="6" borderRadius="rounded-lg" />
            </div>
          </div>
        );
      })}
      <div className="w-full flex items-center justify-center pt-8">
        <SkeletonLoader width="36" height="6" borderRadius="rounded-full" />
      </div>
    </div>
  );

  // use loading state
  if (
    transactionsLoading &&
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    !activeTransactionHashes.length &&
    !batchIdentifiers &&
    !emptyState
  ) {
    return loaderContent;
  }

  // flip the category pill to drop-down on mouse hover
  const toggleCategoryPillReadOnly = (
    batchId: string,
    categoryReadonlyState: boolean
  ) => {
    if (!isOwner) return;

    const _pillHover = pillHover;

    _pillHover[`${batchId}`] = {
      ...batchIdentifiers[`${batchId}`],
      categoryIsReadonly: true
    };

    _pillHover[`${batchId}`]['categoryIsReadonly'] = categoryReadonlyState;
    setPillHover(_pillHover);
  };

  const batchTransactionsList = Object.keys(batchIdentifiers).map(function (
    key
  ) {
    const tokensList: any = [];
    if (!(batchIdentifiers[key].length === 1)) {
      batchIdentifiers[key].map((transaction) => {
        /**
         * For erc20 token, the first transfer recorded is incorrect.
         * The second item seems to have the correct data
         * */
        const transfer =
          transaction?.transfers?.[1] ?? transaction?.transfers?.[0];

        if (transfer && !isEmpty(transfer)) {
          tokensList.push({
            name: transfer.tokenName
              ? transfer.tokenName
              : activeNetwork.nativeCurrency.name,
            symbol: transfer.tokenSymbol
              ? transfer.tokenSymbol
              : activeNetwork.nativeCurrency.symbol,
            icon: transfer.tokenLogo
              ? transfer.tokenLogo
              : activeNetwork.nativeCurrency.logo,
            amount: transfer.tokenDecimal
              ? getWeiAmount(
                  String(transfer.value),
                  Number(transfer.tokenDecimal),
                  false
                )
              : getWeiAmount(
                  String(transfer.value),
                  Number(activeNetwork.nativeCurrency.decimals),
                  false
                )
          });
        }
      });
    }
    return batchIdentifiers[key].map(
      (
        {
          annotation,
          hash = '',
          transfers,
          ownerAddress,
          syndicateEvents,
          timestamp = 0
        },
        index
      ) => {
        if ((!(batchIdentifiers[key].length === 1) && index > 0) || !transfers)
          return;
        /**
         * For erc20 token, the first transfer recorded is incorrect.
         * The second item seems to have the correct data
         * */
        const currentTransfer = transfers[1] ?? transfers[0];

        if (!currentTransfer) return;

        const isOutgoingTransaction = ownerAddress === currentTransfer.from;
        const timeSinceTransaction = moment(timestamp * 1000).fromNow();

        const formattedBlockTime = moment(timestamp * 1000).format(
          'dddd, MMM Do YYYY, h:mm A'
        );

        let category: TransactionCategory = TransactionCategory.Uncategorized;

        if (annotation?.transactionCategory) {
          category = annotation?.transactionCategory;
        } else if (
          syndicateEvents?.[0]?.eventType === 'MEMBER_DISTRIBUTED' &&
          isOutgoingTransaction
        ) {
          category = TransactionCategory.Distribution;
        } else if (
          syndicateEvents?.[0]?.eventType === 'MEMBER_MINTED' ||
          syndicateEvents?.[0]?.eventType === 'MEMBER_MINTED_ETH'
        ) {
          category = TransactionCategory.Deposit;
        }

        return (
          <div
            key={`token-table-row-${key}`}
            className="relative grid grid-cols-12 gap-5 border-b-1 border-gray-syn6 cursor-pointer"
            ref={ref}
            onClick={(): void => {
              if (
                !inlineCategorising &&
                !checkboxActive &&
                !transactionsLoading
              ) {
                const selectedTransactionData = {
                  category,
                  note: annotation ? annotation.memo ?? '' : '',
                  hash,
                  transactionInfo: {
                    transactionHash: hash,
                    from: currentTransfer.from,
                    to: currentTransfer.to,
                    isOutgoingTransaction
                  },
                  amount: currentTransfer.tokenDecimal
                    ? getWeiAmount(
                        String(currentTransfer.value),
                        Number(currentTransfer.tokenDecimal),
                        false
                      )
                    : getWeiAmount(
                        String(currentTransfer.value),
                        Number(activeNetwork.nativeCurrency.decimals),
                        false
                      ),
                  tokenSymbol: currentTransfer.tokenSymbol
                    ? currentTransfer.tokenSymbol
                    : activeNetwork.nativeCurrency.symbol,
                  tokenLogo: currentTransfer.tokenLogo ?? '',
                  tokenName: currentTransfer.tokenName
                    ? currentTransfer.tokenName
                    : activeNetwork.nativeCurrency.name,
                  readOnly:
                    category === TransactionCategory.Deposit ? true : false,
                  timestamp: formattedBlockTime,
                  transactionId: annotation?.transactionId,
                  annotation,
                  blockTimestamp: timestamp
                };
                setCurrentTransaction(selectedTransactionData);
                setCurrentBatchIdentifier(key);
                toggleShowAnnotationsModal();
                setIsAnnotationsModalShown(true);
                setShowDetails(true);
                if (annotation?.memo) {
                  setShowNote(true);
                }
              }
            }}
            aria-hidden={true}
            onMouseEnter={(): void => {
              if (category !== TransactionCategory.Deposit)
                toggleRowCheckbox(key, true);
            }}
            onMouseLeave={(): void => {
              if (category !== TransactionCategory.Deposit)
                toggleRowCheckbox(key, false);
            }}
          >
            <div
              className="absolute -left-12 flex items-center pr-10 pl-4 h-full"
              onMouseEnter={(): void => {
                if (category !== TransactionCategory.Deposit)
                  toggleRowCheckbox(key, true);
              }}
              onMouseLeave={(): void => {
                if (category !== TransactionCategory.Deposit)
                  toggleRowCheckbox(key, false);
              }}
            >
              {rowCheckboxActiveData &&
                rowCheckboxActiveData[key] &&
                rowCheckboxActiveData[key].checkboxVisible &&
                category !== TransactionCategory.Distribution && (
                  <div
                    onMouseEnter={(): void => {
                      setCheckboxActive(true);
                    }}
                    onMouseLeave={(): void => {
                      setCheckboxActive(false);
                    }}
                  >
                    <input
                      type="checkbox"
                      className="bg-transparent rounded focus:ring-offset-0"
                      onChange={(e): void => handleCheckboxSelect(e, key)}
                      checked={rowCheckboxActiveData[key].checkboxActive}
                    />
                  </div>
                )}
            </div>
            <div className="flex flex-row col-span-3 items-center">
              <div
                className="w-fit-content py-3"
                onMouseEnter={(): void => {
                  if (category !== TransactionCategory.Distribution)
                    toggleCategoryPillReadOnly(key, false);
                }}
                onMouseLeave={(): void => {
                  if (category !== TransactionCategory.Distribution)
                    toggleCategoryPillReadOnly(key, true);
                }}
              >
                <CategoryPill
                  isOwner={isOwner}
                  outgoing={isOutgoingTransaction}
                  category={category}
                  renderedInline={true}
                  setInlineCategorising={setInlineCategorising}
                  readonly={
                    pillHover[key]?.categoryIsReadonly === undefined ||
                    category === TransactionCategory.Deposit ||
                    category === TransactionCategory.Distribution
                      ? true
                      : pillHover[key]?.categoryIsReadonly
                  }
                  transactionHash={hash}
                  refetchTransactions={refetchTransactions}
                  showLoader={
                    transactionsLoading &&
                    activeTransactionHashes?.includes(hash) &&
                    !showAnnotationsModal
                  }
                  setActiveTransactionHash={setActiveTransactionHashes}
                />
              </div>
            </div>

            {/* For distributions that have > 1 token */}
            {!(batchIdentifiers[key].length === 1) && (
              <div className="text-base col-span-6 flex space-x-3 items-center">
                <BatchTransactionDetails
                  contractAddress={erc20Token.address}
                  isAnnotationsModalShown={isAnnotationsModalShown}
                  tokenDetails={tokensList}
                  transactionType={
                    isOutgoingTransaction ? 'outgoing' : 'incoming'
                  }
                  isTransactionAnnotated={annotation ? true : false}
                  addresses={[
                    isOutgoingTransaction
                      ? currentTransfer.to
                      : currentTransfer.from
                  ]}
                  category={category}
                  companyName={annotation?.companyName ?? ''}
                  round={annotation?.roundCategory ?? ''}
                  numClubMembers={clubMembers.length}
                />
              </div>
            )}

            {batchIdentifiers[key].length === 1 && (
              <div className="text-base col-span-6 flex space-x-3 items-center">
                <TransactionDetails
                  contractAddress={erc20Token.address}
                  isAnnotationsModalShown={isAnnotationsModalShown}
                  tokenDetails={[
                    {
                      name: currentTransfer.tokenName
                        ? currentTransfer.tokenName
                        : activeNetwork.nativeCurrency.name,
                      symbol: currentTransfer.tokenSymbol
                        ? currentTransfer.tokenSymbol
                        : activeNetwork.nativeCurrency.symbol,
                      icon: currentTransfer.tokenLogo
                        ? currentTransfer.tokenLogo
                        : activeNetwork.nativeCurrency.logo,
                      amount: currentTransfer.tokenDecimal
                        ? getWeiAmount(
                            String(currentTransfer.value),
                            Number(currentTransfer.tokenDecimal),
                            false
                          )
                        : getWeiAmount(
                            String(currentTransfer.value),
                            Number(activeNetwork.nativeCurrency.decimals),
                            false
                          )
                    }
                  ]}
                  transactionType={
                    isOutgoingTransaction ? 'outgoing' : 'incoming'
                  }
                  isTransactionAnnotated={annotation ? true : false}
                  addresses={[
                    isOutgoingTransaction
                      ? currentTransfer.to
                      : currentTransfer.from
                  ]}
                  category={category}
                  companyName={annotation?.companyName ?? ''}
                  round={annotation?.roundCategory ?? ''}
                  numClubMembers={clubMembers.length}
                />
              </div>
            )}

            <div className="text-base flex col-span-3 items-center justify-end">
              <span className="text-gray-syn5">{timeSinceTransaction}</span>
            </div>
          </div>
        );
      }
    );
  });

  return (
    <div className="w-max sm:w-full">
      {Object.keys(batchIdentifiers).length !== 0 ? (
        <div>
          {pageOffset === 0
            ? batchTransactionsList.slice(pageOffset, dataLimit)
            : pageOffset < numTransactions
            ? batchTransactionsList.slice(pageOffset, dataLimit + pageOffset)
            : batchTransactionsList.slice(
                pageOffset - dataLimit,
                numTransactions
              )}
          {/* Pagination  */}
          <div className="flex w-full text-white space-x-4 justify-center my-8 leading-6">
            <button
              className={`pt-1 ${
                pageOffset === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-90'
              }`}
              onClick={(): void => goToPreviousPage()}
            >
              <Image
                src={'/images/arrowBack.svg'}
                height="16"
                width="16"
                alt="Previous"
              />
            </button>
            <p className="">
              {pageOffset === 0 ? '1' : pageOffset + 1} -{' '}
              {activityViewLength < pageOffset + dataLimit
                ? activityViewLength
                : pageOffset + dataLimit}
            </p>

            <button
              className={`pt-1 ${
                !canNextPage
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-90'
              }`}
              onClick={(): void | null =>
                pageOffset + dataLimit < numTransactions ? goToNextPage() : null
              }
            >
              <Image
                src={'/images/arrowNext.svg'}
                height="16"
                width="16"
                alt="Next"
              />
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-14 flex justify-center items-center flex-col">
          {transactionsLoading ? loaderContent : emptyState}
        </div>
      )}
      <div>
        <ActivityModal
          isOwner={isOwner}
          showModal={showAnnotationsModal}
          assetsView={false}
          isAnnotationsModalShown={isAnnotationsModalShown}
          closeModal={(): void => {
            setShowNote(false);
            toggleShowAnnotationsModal();
            setIsAnnotationsModalShown(false);
          }}
          refetchTransactions={refetchTransactions}
          currentTransaction={currentTransaction}
          currentBatchIdentifier={currentBatchIdentifier}
          batchIdentifiers={batchIdentifiers}
          setCurrentTransaction={setCurrentTransaction}
          showNote={showNote}
          showDetails={showDetails}
          setShowNote={setShowNote}
          setShowDetails={setShowDetails}
        />
      </div>
    </div>
  );
};

export default TransactionsTable;
