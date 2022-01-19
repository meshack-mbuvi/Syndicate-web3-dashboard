import { FC, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "@/state";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { CategoryPill } from "@/containers/layoutWithSyndicateDetails/activity/shared/CategoryPill";
import useModal from "@/hooks/useModal";
import ActivityModal from "@/containers/layoutWithSyndicateDetails/activity/shared/ActivityModal";
import TransactionDetails from "@/containers/layoutWithSyndicateDetails/activity/shared/TransactionDetails";
import { getWeiAmount } from "@/utils/conversions";
import {
  setCurrentTransaction,
  clearCurrentTransaction,
} from "@/state/erc20transactions";

interface ITransactionsTableProps {
  canNextPage: boolean;
  dataLimit: number;
  pageOffset: number;
  refetchTransactions: () => void;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  transactionsLoading: boolean;
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
  emptyState,
  toggleRowCheckbox,
  handleCheckboxSelect,
  rowCheckboxActiveData,
  activeTransactionHashes,
  setActiveTransactionHashes,
}) => {
  const {
    transactionsReducer: {
      myTransactions,
      currentTransaction,
      totalTransactionsCount,
    },
    erc20TokenSliceReducer: { erc20Token },
    web3Reducer: {
      web3: { account },
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const isManager = account === erc20Token.owner;

  const [pillHover, setPillHover] = useState<any>([]);

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
    !activeTransactionHashes.length &&
    !currentTransaction.hash
  ) {
    return loaderContent;
  }

  // flip the category pill to drop-down on mouse hover
  const toggleCategoryPillReadOnly = (
    pillIndex: number,
    categoryReadonlyState: boolean,
  ) => {
    if (!isManager) return;
    const data = myTransactions[pageOffset].map((item) => {
      return {
        ...item,
        categoryIsReadonly: true,
      };
    });
    data[pillIndex]["categoryIsReadonly"] = categoryReadonlyState;
    setPillHover(data);
  };

  // when to show pagination
  let showPagination = true;
  if (
    Object.keys(myTransactions).length === 1 &&
    myTransactions?.[pageOffset]?.length < dataLimit
  ) {
    showPagination = false;
  } else {
    showPagination = true;
  }

  return (
    <>
      {myTransactions?.[pageOffset]?.length ? (
        <div>
          {myTransactions[pageOffset].map(
            (
              {
                fromAddress,
                toAddress,
                isOutgoingTransaction,
                hash,
                tokenName,
                blockTimestamp,
                tokenSymbol,
                tokenDecimal,
                value,
                metadata,
                tokenLogo,
              },
              index,
            ) => {
              const timeSinceTransaction = moment(
                blockTimestamp * 1000,
              ).fromNow();

              const formattedBlockTime = moment(blockTimestamp * 1000).format(
                "dddd, MMM Do YYYY, h:mm A",
              );

              const category = metadata?.transactionCategory ?? null;

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
                        category: category,
                        note: metadata ? metadata.memo : "",
                        hash,
                        transactionInfo: {
                          transactionHash: hash,
                          from: fromAddress,
                          to: toAddress,
                          isOutgoingTransaction: isOutgoingTransaction,
                        },
                        amount: getWeiAmount(value, tokenDecimal, false),
                        tokenSymbol,
                        tokenLogo,
                        tokenName,
                        readOnly: category === "DEPOSIT" ? true : false,
                        timestamp: formattedBlockTime,
                        transactionId: metadata?.transactionId,
                        metadata,
                        blockTimestamp,
                      };
                      dispatch(setCurrentTransaction(selectedTransactionData));
                      toggleShowAnnotationsModal();
                      if (metadata?.memo) {
                        setShowNote(true);
                      }
                    }
                  }}
                  aria-hidden={true}
                  onMouseEnter={() => {
                    if (category !== "DEPOSIT") toggleRowCheckbox(index, true);
                  }}
                  onMouseLeave={() => {
                    if (category !== "DEPOSIT") toggleRowCheckbox(index, false);
                  }}
                >
                  <div
                    className="absolute -left-12 flex items-center pr-10 pl-4 h-full"
                    onMouseEnter={() => {
                      if (category !== "DEPOSIT")
                        toggleRowCheckbox(index, true);
                    }}
                    onMouseLeave={() => {
                      if (category !== "DEPOSIT")
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
                        outgoing={isOutgoingTransaction}
                        category={category}
                        renderedInline={true}
                        setInlineCategorising={setInlineCategorising}
                        readonly={
                          pillHover[index]?.categoryIsReadonly === undefined ||
                          category === "DEPOSIT"
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
                        setActiveTransactionHash={setActiveTransactionHashes}
                      />
                    </div>
                  </div>

                  <div className="text-base col-span-6 flex space-x-3 items-center">
                    <TransactionDetails
                      tokenLogo={tokenLogo}
                      tokenSymbol={tokenSymbol}
                      tokenName={tokenName}
                      transactionType={
                        isOutgoingTransaction ? "outgoing" : "incoming"
                      }
                      isTransactionAnnotated={metadata ? true : false}
                      amount={getWeiAmount(value, tokenDecimal, false)}
                      address={isOutgoingTransaction ? toAddress : fromAddress}
                      category={metadata?.transactionCategory}
                      companyName={metadata?.companyName}
                      round={metadata?.roundCategory}
                    />
                  </div>

                  <div className="text-base flex col-span-3 items-center justify-end">
                    <span className="text-gray-syn5">
                      {timeSinceTransaction}
                    </span>
                  </div>
                </div>
              );
            },
          )}
          {/* Pagination  */}
          {showPagination && (
            <div className="flex w-full text-white space-x-4 justify-center my-8 leading-6">
              <button
                className={`pt-1 ${
                  pageOffset === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
                onClick={() => goToPreviousPage()}
                disabled={pageOffset === 0}
              >
                <Image
                  src={"/images/arrowBack.svg"}
                  height="16"
                  width="16"
                  alt="Previous"
                />
              </button>
              <p className="">
                {pageOffset === 0 ? "1" : pageOffset} -{" "}
                {myTransactions?.[pageOffset]?.length < dataLimit
                  ? pageOffset + myTransactions[pageOffset].length
                  : pageOffset + dataLimit}
                {` of `} {totalTransactionsCount}
              </p>

              <button
                className={`pt-1 ${
                  !canNextPage
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
                onClick={() => goToNextPage()}
                disabled={!canNextPage}
              >
                <Image
                  src={"/images/arrowNext.svg"}
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
          showModal={showAnnotationsModal}
          closeModal={() => {
            setTimeout(() => dispatch(clearCurrentTransaction()), 400); // Quick hack. clearCurrentTransaction is dispatched before Modal is closed hence it appears like second modal pops up before closing modal.
            setShowNote(false);
            toggleShowAnnotationsModal();
          }}
          refetchTransactions={refetchTransactions}
          showNote={showNote}
          setShowNote={setShowNote}
        />
      </div>
    </>
  );
};

export default TransactionsTable;
