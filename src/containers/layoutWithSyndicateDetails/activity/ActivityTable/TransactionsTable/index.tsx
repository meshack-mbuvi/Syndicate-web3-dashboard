import { SkeletonLoader } from '@/components/skeletonLoader';
import ActivityModal from '@/containers/layoutWithSyndicateDetails/activity/shared/ActivityModal';
import { CategoryPill } from '@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill';
import TransactionDetails from '@/containers/layoutWithSyndicateDetails/activity/shared/TransactionDetails';
import useModal from '@/hooks/useModal';
import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import moment from 'moment';
import Image from 'next/image';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { TransactionEvents } from '@/hooks/useLegacyTransactions';
import {
  CurrentTransaction,
  emptyCurrentTransaction
} from '@/state/erc20transactions/types';
import { BatchIdTokenDetails } from '../index';
import BatchTransactionDetails from '../../shared/BatchTransactionDetails';

interface ITransactionsTableProps {
  canNextPage: boolean;
  isOwner: boolean;
  dataLimit: number;
  pageOffset: number;
  refetchTransactions: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  transactionsLoading: boolean;
  numTransactions: number;
  transactionEvents: Array<TransactionEvents>;
  batchIdentifiers: BatchIdTokenDetails;
  emptyState: JSX.Element;
  toggleRowCheckbox: (checkboxIndex: number, checkboxVisible: boolean) => void;
  handleCheckboxSelect: (e: any, index: number) => void;
  rowCheckboxActiveData: any[];
  activeTransactionHashes?: Array<string>;
  setActiveTransactionHashes?: (transactionHashes: Array<string>) => void;
}

const TransactionsTable: FC<ITransactionsTableProps> = ({
  canNextPage,
  dataLimit,
  pageOffset,
  refetchTransactions,
  goToPreviousPage,
  goToNextPage,
  transactionsLoading,
  numTransactions,
  transactionEvents,
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
      web3: { web3, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  const [pillHover, setPillHover] = useState<any>([]);
  const [currentTransaction, setCurrentTransaction] =
    useState<CurrentTransaction>(emptyCurrentTransaction);
  const [currentBatchIdentifier, setCurrentBatchIdentifier] =
    useState<string>('');
  // table functionality
  const [inlineCategorising, setInlineCategorising] = useState<boolean>(false);
  const [showAnnotationsModal, toggleShowAnnotationsModal] = useModal();
  const [checkboxActive, setCheckboxActive] = useState<boolean>(false);
  const [showNote, setShowNote] = useState<boolean>(false);

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
    transactionEvents.length == 0
  ) {
    return loaderContent;
  }

  // flip the category pill to drop-down on mouse hover
  const toggleCategoryPillReadOnly = (
    pillIndex: number,
    categoryReadonlyState: boolean
  ) => {
    if (!isOwner) return;
    const data = transactionEvents.map((item) => {
      return {
        ...item,
        categoryIsReadonly: true
      };
    });
    data[pillIndex]['categoryIsReadonly'] = categoryReadonlyState;
    setPillHover(data);
  };

  // when to show pagination
  let showPagination = true;
  if (Object.keys(batchIdentifiers).length < dataLimit) {
    showPagination = false;
  } else {
    showPagination = true;
  }

  return (
    <div className="w-max sm:w-full">
      {Object.keys(batchIdentifiers).length !== 0 ? (
        <div>
          {
            Object.keys(batchIdentifiers).map(function (key) {
              const tokensList: any = [];
              if (
                !(
                  key === 'nonDistributionTransactions' ||
                  batchIdentifiers[key].length === 1
                )
              ) {
                batchIdentifiers[key].map((transaction) => {
                  tokensList.push({
                    name: transaction.transfers[0].tokenName
                      ? transaction.transfers[0].tokenName
                      : activeNetwork.nativeCurrency.name,
                    symbol: transaction.transfers[0].tokenSymbol
                      ? transaction.transfers[0].tokenSymbol
                      : activeNetwork.nativeCurrency.symbol,
                    icon: transaction.transfers[0].tokenLogo
                      ? transaction.transfers[0].tokenLogo
                      : activeNetwork.nativeCurrency.logo,
                    amount: transaction.transfers[0].tokenDecimal
                      ? getWeiAmount(
                          web3,
                          String(transaction.transfers[0].value),
                          Number(transaction.transfers[0].tokenDecimal),
                          false
                        )
                      : getWeiAmount(
                          web3,
                          String(transaction.transfers[0].value),
                          Number(activeNetwork.nativeCurrency.decimals),
                          false
                        )
                  });
                });
              }
              return batchIdentifiers[key].map(
                (
                  {
                    annotation,
                    hash,
                    timestamp,
                    transfers,
                    ownerAddress,
                    syndicateEvents
                  },
                  index
                ) => {
                  if (
                    !(
                      key === 'nonDistributionTransactions' ||
                      batchIdentifiers[key].length === 1
                    ) &&
                    index > 0
                  )
                    return;
                  const currentTransfer = transfers[0];
                  const isOutgoingTransaction =
                    ownerAddress === currentTransfer.from;
                  const timeSinceTransaction = moment(
                    timestamp * 1000
                  ).fromNow();

                  const formattedBlockTime = moment(timestamp * 1000).format(
                    'dddd, MMM Do YYYY, h:mm A'
                  );

                  const category: any = annotation?.transactionCategory
                    ? syndicateEvents[0]?.eventType === 'MEMBER_DISTRIBUTED'
                    : 'DISTRIBUTION' ?? null;
                  return (
                    <div
                      key={`token-table-row-${index}`}
                      className="relative grid grid-cols-12 gap-5 border-b-1 border-gray-syn6 cursor-pointer"
                      onClick={() => {
                        if (
                          !inlineCategorising &&
                          !checkboxActive &&
                          !transactionsLoading
                        ) {
                          const selectedTransactionData = {
                            category,
                            note: annotation ? annotation.memo : '',
                            hash,
                            transactionInfo: {
                              transactionHash: hash,
                              from: currentTransfer.from,
                              to: currentTransfer.to,
                              isOutgoingTransaction
                            },
                            amount: getWeiAmount(
                              web3,
                              String(currentTransfer.value),
                              Number(currentTransfer.tokenDecimal),
                              false
                            ),
                            tokenSymbol: currentTransfer.tokenSymbol
                              ? currentTransfer.tokenSymbol
                              : activeNetwork.nativeCurrency.symbol,
                            tokenLogo: currentTransfer.tokenLogo,
                            tokenName: currentTransfer.tokenName
                              ? currentTransfer.tokenName
                              : activeNetwork.nativeCurrency.name,
                            readOnly: category === 'DEPOSIT' ? true : false,
                            timestamp: formattedBlockTime,
                            transactionId: annotation?.transactionId,
                            annotation,
                            blockTimestamp: timestamp
                          };
                          setCurrentTransaction(selectedTransactionData);
                          setCurrentBatchIdentifier(
                            syndicateEvents[0]?.distributionBatch
                          );
                          toggleShowAnnotationsModal();
                          if (annotation?.memo) {
                            setShowNote(true);
                          }
                        }
                      }}
                      aria-hidden={true}
                      onMouseEnter={() => {
                        if (category !== 'DEPOSIT')
                          toggleRowCheckbox(index, true);
                      }}
                      onMouseLeave={() => {
                        if (category !== 'DEPOSIT')
                          toggleRowCheckbox(index, false);
                      }}
                    >
                      <div
                        className="absolute -left-12 flex items-center pr-10 pl-4 h-full"
                        onMouseEnter={() => {
                          if (category !== 'DEPOSIT')
                            toggleRowCheckbox(index, true);
                        }}
                        onMouseLeave={() => {
                          if (category !== 'DEPOSIT')
                            toggleRowCheckbox(index, false);
                        }}
                      >
                        {rowCheckboxActiveData[index] &&
                          rowCheckboxActiveData[index].checkboxVisible && (
                            <div
                              onMouseEnter={() => setCheckboxActive(true)}
                              onMouseLeave={() => setCheckboxActive(false)}
                            >
                              <input
                                type="checkbox"
                                className="bg-transparent rounded focus:ring-offset-0"
                                onChange={(e) => handleCheckboxSelect(e, index)}
                                checked={
                                  rowCheckboxActiveData[index].checkboxActive
                                }
                              />
                            </div>
                          )}
                      </div>
                      <div className="flex flex-row col-span-3 items-center">
                        <div
                          className="w-fit-content py-3"
                          onMouseEnter={() =>
                            toggleCategoryPillReadOnly(index, false)
                          }
                          onMouseLeave={() =>
                            toggleCategoryPillReadOnly(index, true)
                          }
                        >
                          <CategoryPill
                            isOwner={isOwner}
                            outgoing={isOutgoingTransaction}
                            category={category}
                            renderedInline={true}
                            setInlineCategorising={setInlineCategorising}
                            readonly={
                              pillHover[index]?.categoryIsReadonly ===
                                undefined || category === 'DEPOSIT'
                                ? true
                                : pillHover[index]?.categoryIsReadonly
                            }
                            transactionHash={hash}
                            refetchTransactions={refetchTransactions}
                            showLoader={
                              transactionsLoading &&
                              activeTransactionHashes?.includes(hash) &&
                              !showAnnotationsModal
                            }
                            setActiveTransactionHash={
                              setActiveTransactionHashes
                            }
                          />
                        </div>
                      </div>

                      {/* For distributions that have > 1 token */}
                      {!(
                        key === 'nonDistributionTransactions' ||
                        batchIdentifiers[key].length === 1
                      ) && (
                        <div className="text-base col-span-6 flex space-x-3 items-center">
                          <BatchTransactionDetails
                            contractAddress={erc20Token.address}
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
                            category={annotation?.transactionCategory}
                            companyName={annotation?.companyName}
                            round={annotation?.roundCategory}
                          />
                        </div>
                      )}

                      {(key === 'nonDistributionTransactions' ||
                        batchIdentifiers[key].length === 1) && (
                        <div className="text-base col-span-6 flex space-x-3 items-center">
                          <TransactionDetails
                            contractAddress={erc20Token.address}
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
                                amount: getWeiAmount(
                                  web3,
                                  String(currentTransfer.value),
                                  Number(currentTransfer.tokenDecimal),
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
                            category={annotation?.transactionCategory}
                            companyName={annotation?.companyName}
                            round={annotation?.roundCategory}
                          />
                        </div>
                      )}

                      <div className="text-base flex col-span-3 items-center justify-end">
                        <span className="text-gray-syn5">
                          {timeSinceTransaction}
                        </span>
                      </div>
                    </div>
                  );
                }
              );
            })
            // sort by timestamp
          }
          {/* Pagination  */}
          {showPagination && (
            <div className="flex w-full text-white space-x-4 justify-center my-8 leading-6">
              <button
                className={`pt-1 ${
                  pageOffset === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:opacity-90'
                }`}
                onClick={() => goToPreviousPage()}
                disabled={pageOffset === 0}
              >
                <Image
                  src={'/images/arrowBack.svg'}
                  height="16"
                  width="16"
                  alt="Previous"
                />
              </button>
              <p className="">
                {pageOffset === 0 ? '1' : pageOffset} -{' '}
                {Object.keys(batchIdentifiers).length < dataLimit
                  ? pageOffset + Object.keys(batchIdentifiers).length
                  : pageOffset + dataLimit}
                {` of `} {numTransactions}
              </p>

              <button
                className={`pt-1 ${
                  !canNextPage
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:opacity-90'
                }`}
                onClick={() => goToNextPage()}
                disabled={!canNextPage}
              >
                <Image
                  src={'/images/arrowNext.svg'}
                  height="16"
                  width="16"
                  alt="Next"
                />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="pt-14 flex justify-center items-center flex-col">
          {emptyState}
        </div>
      )}
      <div>
        <ActivityModal
          isOwner={isOwner}
          showModal={showAnnotationsModal}
          closeModal={() => {
            setShowNote(false);
            toggleShowAnnotationsModal();
          }}
          refetchTransactions={refetchTransactions}
          currentTransaction={currentTransaction}
          currentBatchIdentifier={currentBatchIdentifier}
          batchIdentifiers={batchIdentifiers}
          transactionEvents={transactionEvents}
          setCurrentTransaction={setCurrentTransaction}
          showNote={showNote}
          setShowNote={setShowNote}
        />
      </div>
    </div>
  );
};

export default TransactionsTable;
