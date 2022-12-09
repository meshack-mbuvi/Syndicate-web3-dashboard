/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { SkeletonLoader } from '@/components/skeletonLoader';
import { H4 } from '@/components/typography';
import { useDemoMode } from '@/hooks/useDemoMode';
import useModal from '@/hooks/useModal';
import { AppState } from '@/state';
import {
  CurrentTransaction,
  emptyCurrentTransaction,
  TransactionCategory
} from '@/state/erc20transactions/types';
import { getWeiAmount } from '@/utils/conversions';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { ArrowRightIcon } from '@heroicons/react/outline';
import moment from 'moment';
import Image from 'next/image';
import {
  Dispatch,
  FC,
  SetStateAction,
  useRef,
  useState,
  useEffect
} from 'react';
import { useSelector } from 'react-redux';
import ActivityModal from '../activity/shared/ActivityModal';
import {
  CollapseChevronButton,
  CollapsedSectionType
} from '@/containers/layoutWithSyndicateDetails/assets/shared/CollapseChevronButton';
import { SortOrderType } from '@/containers/layoutWithSyndicateDetails/assets';
import {
  TransactionEvents,
  SyndicateTransfers,
  SyndicateAnnotation
} from '@/hooks/useLegacyTransactions';
interface InvestmentsViewProps {
  pageOffset: number;
  setPageOffset: Dispatch<SetStateAction<number>>;
  canNextPage: boolean;
  isMember: boolean;
  transactionsLoading: boolean;
  numTransactions: number;
  transactionEvents: Array<TransactionEvents>;
  dataLimit: number;
  refetchTransactions: () => void;
  isOwner: boolean;
  storeSortColumn: (
    column: string,
    sortAscending: boolean,
    assetSection: SortOrderType
  ) => void;
}

const InvestmentsView: FC<InvestmentsViewProps> = ({
  isOwner,
  pageOffset,
  setPageOffset,
  canNextPage,
  transactionsLoading,
  numTransactions,
  transactionEvents,
  dataLimit,
  refetchTransactions,
  isMember
}) => {
  const {
    web3Reducer: {
      web3: { web3, activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  let clubAddress = '';
  if (typeof window !== 'undefined') {
    clubAddress = window?.location?.pathname.split('/')[2];
  }

  const [currentTransaction, setCurrentTransaction] =
    useState<CurrentTransaction>(emptyCurrentTransaction);
  const [showOffChainInvestmentsModal, toggleShowOffChainInvestmentsModal] =
    useModal();
  const [showNote, setShowNote] = useState(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // show/hide investments table
  const [isInvestmentsTableCollapsed, setIsInvestmentsTableCollapsed] =
    useState(false);

  const investmentsTableBoundsRef = useRef<HTMLDivElement>(null);

  const isDemoMode = useDemoMode();

  const investmentsTableRef = useRef(null);

  // pagination functions
  function goToNextPage() {
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    investmentsTableRef.current.focus();
    setPageOffset((_offset) => _offset + dataLimit);
  }

  function goToPreviousPage() {
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    investmentsTableRef.current.focus();
    setPageOffset((_offset) => _offset - dataLimit);
  }

  const investmentsTableTitle = (
    <div className="flex w-full justify-between items-center">
      {/* title text  */}
      <div className="flex items-center justify-start">
        <img src="/images/investments-title-icon.svg" alt="Invesments title" />
        <H4 extraClasses="pl-3">Off-chain investments</H4>
      </div>

      {/* collapse button  */}
      {transactionsLoading ? null : (
        <CollapseChevronButton
          isCollapsed={isInvestmentsTableCollapsed}
          setIsCollapsed={setIsInvestmentsTableCollapsed}
          collapsedSection={CollapsedSectionType.OFF_CHAIN_INVESTMENT}
        />
      )}
    </div>
  );

  // get state of off-chain investment section collapsed from localStorage
  useEffect(() => {
    if (window.localStorage) {
      const existingClubsCollapsedStates =
        JSON.parse(
          localStorage.getItem('clubAssetsCollapsedState') as string
        ) || {};
      const currentClubCollapsedState =
        existingClubsCollapsedStates[clubAddress as string] || {};

      const isInvestmentsSectionCollapsed =
        currentClubCollapsedState[CollapsedSectionType.OFF_CHAIN_INVESTMENT] ||
        false;

      setIsInvestmentsTableCollapsed(isInvestmentsSectionCollapsed);
    }
  }, [clubAddress]);

  // loading/empty state for investments table.
  const LoaderContent: React.FC<{
    animate: boolean;
    titleText?: string;
    subText?: string;
  }> = ({
    animate,
    titleText = 'This club has no off-chain investments yet.',
    subText = 'Any off-chain investments added will appear here.'
  }) => {
    return (
      <div>
        <div className={`relative ${!animate ? 'px-2' : 'px-0'}`}>
          {!animate && (
            <div className="absolute flex flex-col justify-center items-center top-1/3 w-full z-10">
              <H4 extraClasses="text-white mb-4">{titleText}</H4>
              <span className="text-gray-syn4">{subText}</span>
            </div>
          )}

          <div className={!animate ? `filter grayscale blur-md` : undefined}>
            {[...Array(5).keys()].map((_, index) => {
              return (
                <div
                  className={`grid grid-cols-12 gap-5 border-b-1 border-gray-syn6 ${
                    index === 0 ? 'pb-3' : 'py-3'
                  }`}
                  key={index}
                >
                  {[...Array(2).keys()].map((_, index) => (
                    <div
                      className="flex justify-start items-center w-full col-span-3"
                      key={index}
                    >
                      <SkeletonLoader
                        width="50"
                        height="6"
                        borderRadius="rounded-lg"
                        animate={animate}
                      />
                    </div>
                  ))}
                  {[...Array(2).keys()].map((_, index) => (
                    <div
                      className="flex justify-start items-center w-full col-span-2"
                      key={index}
                    >
                      <SkeletonLoader
                        width="40"
                        height="6"
                        borderRadius="rounded-lg"
                        animate={animate}
                      />
                    </div>
                  ))}

                  <div className="flex items-center justify-end col-span-2">
                    <SkeletonLoader
                      width="36"
                      height="6"
                      borderRadius="rounded-lg"
                      animate={animate}
                    />
                  </div>
                </div>
              );
            })}
            {animate && (
              <div className="w-full flex items-center justify-center pt-8">
                <SkeletonLoader
                  width="36"
                  height="6"
                  borderRadius="rounded-full"
                  animate={animate}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const columns = [
    'Company',
    'Round',
    'Cost basis',
    'Current investment value',
    ''
  ];

  // when to show pagination
  const showPagination = numTransactions > dataLimit;

  const viewInvestmentDetails: any = (
    annotation: SyndicateAnnotation,
    hash: string,
    timestamp: number,
    transfers: Array<SyndicateTransfers>,
    ownerAddress: string
  ) => {
    if (!isMember && !isOwner) return;
    const currentTransfer = transfers[0];
    const { from, to } = currentTransfer;
    const { memo } = annotation;
    const formattedBlockTime = moment(timestamp * 1000).format(
      'dddd, MMM Do YYYY, h:mm A'
    );

    const category = TransactionCategory.OFF_CHAIN_INVESTMENT;
    const isOutgoingTransaction = ownerAddress === currentTransfer.from;

    const selectedTransactionData = {
      category,
      note: memo ?? '',
      hash,
      transactionInfo: {
        transactionHash: hash,
        from: from,
        to: to,
        isOutgoingTransaction: isOutgoingTransaction
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
      tokenLogo: '/images/token-gray-4.svg',
      tokenName: currentTransfer.tokenName
        ? currentTransfer.tokenName
        : activeNetwork.nativeCurrency.name,
      readOnly: false,
      timestamp: formattedBlockTime,
      transactionId: annotation?.transactionId,
      annotation,
      blockTimestamp: timestamp
    };
    setCurrentTransaction(selectedTransactionData);
    toggleShowOffChainInvestmentsModal();
  };

  const [containerHeight, setContainerHeight] = useState<number>(0);

  // get height of investments table to animate on collapse
  useEffect(() => {
    if (investmentsTableBoundsRef) {
      const containerHeight = investmentsTableBoundsRef.current
        ? investmentsTableBoundsRef.current.getBoundingClientRect().height
        : 0;

      setContainerHeight(containerHeight);
    }
  }, [JSON.stringify(transactionEvents)]);

  return (
    <div>
      {investmentsTableTitle}
      <div
        className="duration-500 transition-all h-full overflow-hidden"
        style={{
          height: isInvestmentsTableCollapsed ? '0' : `${containerHeight}px`
        }}
      >
        <div className="w-full pt-8" ref={investmentsTableBoundsRef}>
          {/* loading state  */}
          {transactionsLoading && <LoaderContent animate={true} />}

          {/* show empty state if account is not a member or the admin  */}
          {!isMember && !isOwner && !isDemoMode && !transactionsLoading && (
            <LoaderContent
              animate={false}
              titleText="Off-chain investments are only visible to members."
              subText="If you're a member of this club, connect the same wallet you used to deposit."
            />
          )}
          {isDemoMode && <LoaderContent animate={false} />}
          {transactionEvents?.[pageOffset]?.length !== 0 &&
          (isMember || isOwner) &&
          !transactionsLoading ? (
            <div className="w-full">
              <div className="flex flex-col">
                {/* scroll to top of table with this button when pagination is clicked  */}
                <button ref={investmentsTableRef} />
                <div className="grid grid-cols-12 gap-5 pb-3">
                  {columns?.map((col, idx) => (
                    <div
                      key={`token-table-header-${idx}`}
                      className={`text-sm flex items-center group ${
                        idx < 1 ? 'col-span-3' : 'col-span-2'
                      } ${idx > 1 ? 'md:justify-end' : ''}`}
                    >
                      <span className="text-gray-syn4 text-sm">{col}</span>
                    </div>
                  ))}
                </div>
              </div>
              {transactionEvents.map(
                (
                  { annotation, hash, timestamp, transfers, ownerAddress },
                  index
                ) => {
                  // Handles cases where annotations are null or transactions are not investments
                  if (
                    !annotation ||
                    annotation.transactionCategory !==
                      TransactionCategory.INVESTMENT
                  )
                    return;
                  const currentTransfer = transfers[0];
                  const {
                    companyName,
                    roundCategory,
                    preMoneyValuation,
                    postMoneyValuation
                  } = annotation;
                  const showAddMemo =
                    !companyName ||
                    !roundCategory ||
                    !postMoneyValuation ||
                    !preMoneyValuation;
                  const [costBasisUSD, costBasisDecimalValue] =
                    floatedNumberWithCommas(postMoneyValuation).split('.');
                  const [investmentValueUSD, investmentDecimalValue] =
                    floatedNumberWithCommas(preMoneyValuation).split('.');
                  const dashForMissingValue = (
                    <span className="text-gray-syn4">-</span>
                  );
                  const defaultCompanyName = (
                    <span className="text-gray-syn4">
                      No company name added
                    </span>
                  );
                  const investmentDataValue = getWeiAmount(
                    web3,
                    String(currentTransfer.value),
                    Number(currentTransfer.tokenDecimal),
                    false
                  );
                  const [defaultCostBasisUSD, defaultCostBasisDecimalValue] =
                    floatedNumberWithCommas(investmentDataValue).split('.');

                  const defaultCostBasis = (
                    <span>
                      {defaultCostBasisUSD}
                      {defaultCostBasisDecimalValue && (
                        <span className="text-gray-lightManatee">
                          .{defaultCostBasisDecimalValue}
                        </span>
                      )}
                      &nbsp;
                      {currentTransfer.tokenSymbol}
                    </span>
                  );

                  return (
                    <div
                      key={`token-table-row-${index}`}
                      className={`grid grid-cols-12 gap-5 border-b-1 border-gray-syn7 py-5 ${
                        isMember || isOwner ? 'cursor-pointer' : ''
                      }`}
                      onClick={() =>
                        viewInvestmentDetails(
                          annotation,
                          hash,
                          timestamp,
                          transfers,
                          ownerAddress
                        )
                      }
                    >
                      {/* company name  */}
                      <div className="flex flex-row col-span-3 items-center">
                        <div className="text-base flex items-center">
                          {companyName ? companyName : defaultCompanyName}
                        </div>
                      </div>

                      {/* seed round  */}
                      <div className="text-base col-span-3 flex items-center">
                        {roundCategory ? roundCategory : dashForMissingValue}
                      </div>

                      {/* cost basis  */}
                      <div className="text-base flex col-span-2 items-center">
                        {+postMoneyValuation > 0 ? (
                          <span>
                            {costBasisUSD}
                            {costBasisDecimalValue && (
                              <span className="text-gray-lightManatee">
                                .{costBasisDecimalValue}
                              </span>
                            )}
                            &nbsp;
                            {'USD'}
                          </span>
                        ) : (
                          defaultCostBasis
                        )}
                      </div>

                      {/* current investment value  */}

                      <div className="text-base flex col-span-2 items-center">
                        {+preMoneyValuation > 0 ? (
                          <span>
                            {investmentValueUSD}
                            {investmentDecimalValue && (
                              <span className="text-gray-lightManatee">
                                .{investmentDecimalValue}
                              </span>
                            )}
                            &nbsp;
                            {'USD'}
                          </span>
                        ) : (
                          dashForMissingValue
                        )}
                      </div>
                      {(isMember || isOwner || isDemoMode) && (
                        <div className="text-base flex col-span-2 items-center justify-end">
                          {isOwner && showAddMemo ? (
                            <div className="cursor-pointer flex items-center text-blue">
                              <span
                                aria-hidden={true}
                                onClick={() =>
                                  viewInvestmentDetails(
                                    annotation,
                                    hash,
                                    timestamp,
                                    transfers,
                                    ownerAddress
                                  )
                                }
                              >
                                Add memo
                              </span>
                              <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </div>
                          ) : (
                            <div className="cursor-pointer flex items-center">
                              <div className="mr-2 flex items-center">
                                <Image
                                  width="16"
                                  height="16"
                                  src="/images/assets/memo.svg"
                                />
                              </div>
                              <span
                                className="text-gray-syn4"
                                aria-hidden={true}
                                onClick={() =>
                                  viewInvestmentDetails(
                                    annotation,
                                    hash,
                                    timestamp,
                                    transfers,
                                    ownerAddress
                                  )
                                }
                              >
                                View memo
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          ) : null}

          <div>
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
                  {transactionEvents.length < dataLimit
                    ? pageOffset + transactionEvents.length
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
          <ActivityModal
            isOwner={isOwner}
            showModal={showOffChainInvestmentsModal}
            isAnnotationsModalShown={false}
            assetsView={true}
            closeModal={() => {
              setShowNote(false);
              toggleShowOffChainInvestmentsModal();
            }}
            refetchTransactions={() => {
              refetchTransactions();
            }}
            currentTransaction={currentTransaction}
            currentBatchIdentifier={''}
            batchIdentifiers={{}}
            setCurrentTransaction={setCurrentTransaction}
            showNote={showNote}
            showDetails={showDetails}
            setShowNote={setShowNote}
            setShowDetails={setShowDetails}
          />
        </div>
      </div>
    </div>
  );
};

export default InvestmentsView;
