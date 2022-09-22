import { SkeletonLoader } from '@/components/skeletonLoader';
import { H4 } from '@/components/typography';
import { useDemoMode } from '@/hooks/useDemoMode';
import useModal from '@/hooks/useModal';
import { AppState } from '@/state';
import {
  clearCurrentTransaction,
  setCurrentTransaction
} from '@/state/erc20transactions';
import { TransactionCategory } from '@/state/erc20transactions/types';
import { getWeiAmount } from '@/utils/conversions';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { ArrowRightIcon } from '@heroicons/react/outline';
import moment from 'moment';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ActivityModal from '../activity/shared/ActivityModal';

interface InvestmentsViewProps {
  pageOffset: number;
  setPageOffset: Dispatch<SetStateAction<number>>;
  canNextPage: boolean;
  isMember: boolean;
  transactionsLoading: boolean;
  dataLimit: number;
  refetchTransactions: () => void;
  isOwner: boolean;
}

const InvestmentsView: FC<InvestmentsViewProps> = ({
  isOwner,
  pageOffset,
  setPageOffset,
  canNextPage,
  transactionsLoading,
  dataLimit,
  refetchTransactions,
  isMember
}) => {
  const {
    transactionsReducer: {
      totalInvestmentTransactionsCount,
      investmentTransactions,
      currentTransaction
    },
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);

  const [showOffChainInvestmentsModal, toggleShowOffChainInvestmentsModal] =
    useModal();
  const [showNote, setShowNote] = useState(false);

  const isDemoMode = useDemoMode();

  const investmentsTableRef = useRef(null);

  const dispatch = useDispatch();

  // pagination functions
  function goToNextPage() {
    investmentsTableRef.current.focus();
    setPageOffset((_offset) => _offset + dataLimit);
  }

  function goToPreviousPage() {
    investmentsTableRef.current.focus();
    setPageOffset((_offset) => _offset - dataLimit);
  }

  const invesmentsTitle = (
    <div className="flex items-center justify-start pb-8">
      <img src="/images/investments-title-icon.svg" alt="Invesments title" />
      <H4 extraClasses="pl-3">Off-chain investments</H4>
    </div>
  );

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
        {invesmentsTitle}
        <div className="relative">
          {!animate && (
            <div className="absolute flex flex-col justify-center items-center top-1/3 w-full z-10">
              <H4 extraClasses="text-white mb-4">{titleText}</H4>
              <span className="text-gray-syn4">{subText}</span>
            </div>
          )}

          <div className={!animate ? `filter grayscale blur-md` : undefined}>
            {[...Array(4).keys()].map((_, index) => {
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
  const showPagination = totalInvestmentTransactionsCount > dataLimit;

  if (transactionsLoading && !currentTransaction.hash) {
    return <LoaderContent animate={true} />;
  }

  // show empty state if account is not a member or the admin
  if (!isMember && !isOwner && !isDemoMode) {
    return (
      <LoaderContent
        animate={false}
        titleText="Off-chain investments are only visible to members."
        subText="If you're a member of this club, connect the same wallet you used to deposit."
      />
    );
  }

  const viewInvestmentDetails = (investmentData) => {
    if (!isMember && !isOwner) return;
    const {
      fromAddress,
      toAddress,
      isOutgoingTransaction,
      hash,
      tokenName,
      blockTimestamp,
      tokenSymbol,
      tokenDecimal,
      value,
      tokenLogo,
      metadata
    } = investmentData;
    const { memo } = metadata;
    const formattedBlockTime = moment(blockTimestamp * 1000).format(
      'dddd, MMM Do YYYY, h:mm A'
    );

    const category = 'OFF_CHAIN_INVESTMENT' as TransactionCategory;

    const selectedTransactionData = {
      category,
      note: memo ?? '',
      hash,
      transactionInfo: {
        transactionHash: hash,
        from: fromAddress,
        to: toAddress,
        isOutgoingTransaction: isOutgoingTransaction
      },
      amount: getWeiAmount(web3, value, tokenDecimal, false),
      tokenSymbol,
      tokenLogo,
      tokenName,
      readOnly: false,
      timestamp: formattedBlockTime,
      transactionId: metadata?.transactionId,
      metadata,
      blockTimestamp
    };
    dispatch(setCurrentTransaction(selectedTransactionData));
    toggleShowOffChainInvestmentsModal();
  };

  return (
    <>
      {investmentTransactions?.[pageOffset]?.length ? (
        <div className="mt-16">
          {invesmentsTitle}
          <div className="flex flex-col">
            {/* scroll to top of table with this button when pagination is clicked  */}
            <button ref={investmentsTableRef} />
            <div className="grid grid-cols-12 gap-5 pb-3">
              {columns?.map((col, idx) => (
                <div
                  key={`token-table-header-${idx}`}
                  className={`text-sm ${idx < 2 ? 'col-span-3' : 'col-span-2'}`}
                >
                  <span className="text-gray-syn4 text-sm">{col}</span>
                </div>
              ))}
            </div>
          </div>

          {investmentTransactions?.[pageOffset].map((investmentData, index) => {
            const { metadata } = investmentData;
            const {
              companyName,
              roundCategory,
              preMoneyValuation,
              postMoneyValuation
            } = metadata;
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
              <span className="text-gray-syn4">No company name added</span>
            );
            const investmentDataValue = getWeiAmount(
              web3,
              investmentData.value,
              investmentData.tokenDecimal,
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
                {investmentData.tokenSymbol}
              </span>
            );

            return (
              <div
                key={`token-table-row-${index}`}
                className={`grid grid-cols-12 gap-5 border-b-1 border-gray-syn7 py-5 ${
                  isMember || isOwner ? 'cursor-pointer' : ''
                }`}
                onClick={() => viewInvestmentDetails(investmentData)}
                onKeyDown={() => viewInvestmentDetails(investmentData)}
                tabIndex={index}
                role="button"
              >
                <div className="flex flex-row col-span-3 items-center">
                  <div className="text-base flex items-center">
                    {companyName ? companyName : defaultCompanyName}
                  </div>
                </div>

                <div className="text-base col-span-3 flex items-center">
                  {roundCategory ? roundCategory : dashForMissingValue}
                </div>

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
                          onClick={() => viewInvestmentDetails(investmentData)}
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
                          onClick={() => viewInvestmentDetails(investmentData)}
                        >
                          View memo
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <LoaderContent animate={false} />
      )}
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
              {investmentTransactions?.[pageOffset]?.length < dataLimit
                ? pageOffset + investmentTransactions[pageOffset].length
                : pageOffset + dataLimit}
              {` of `} {totalInvestmentTransactionsCount}
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
        closeModal={() => {
          setTimeout(() => dispatch(clearCurrentTransaction()), 400); // Quick hack. clearCurrentTransaction is dispatched before Modal is closed hence it appears like second modal pops up before closing modal.
          setShowNote(false);
          toggleShowOffChainInvestmentsModal();
        }}
        refetchTransactions={() => {
          refetchTransactions();
        }}
        showNote={showNote}
        setShowNote={setShowNote}
      />
    </>
  );
};

export default InvestmentsView;
