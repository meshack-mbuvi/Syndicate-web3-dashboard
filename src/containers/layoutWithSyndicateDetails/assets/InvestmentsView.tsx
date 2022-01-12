import { FC, useRef, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { SkeletonLoader } from "@/components/skeletonLoader";
import { AppState } from "@/state";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";

interface InvestmentsViewProps {
  pageOffset: number;
  setPageOffset: Dispatch<SetStateAction<number>>;
  canNextPage: boolean;
  transactionsLoading: boolean;
  dataLimit: number;
}

const InvestmentsView: FC<InvestmentsViewProps> = ({
  pageOffset,
  setPageOffset,
  canNextPage,
  transactionsLoading,
  dataLimit,
}) => {
  const {
    transactionsReducer: {
      totalInvestmentTransactionsCount,
      investmentTransactions,
    },
  } = useSelector((state: AppState) => state);

  const investmentsTableRef = useRef(null);

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
      <div className="text-xl pl-3">Off-chain investments</div>
    </div>
  );

  // loading state for transactions table.
  const loaderContent = (
    <div>
      {invesmentsTitle}
      {[...Array(4).keys()].map((counter, index) => {
        return (
          <div
            className={`grid grid-cols-12 gap-5 border-b-1 border-gray-syn6 ${
              index === 0 ? "pb-3" : "py-3"
            }`}
            key={index}
          >
            <div className="flex justify-start items-center w-full col-span-3">
              <SkeletonLoader width="50" height="6" borderRadius="rounded-lg" />
            </div>
            <div className="flex justify-start items-center w-full col-span-3">
              <SkeletonLoader width="40" height="6" borderRadius="rounded-lg" />
            </div>
            <div className="flex justify-start items-center w-full col-span-2">
              <SkeletonLoader width="40" height="6" borderRadius="rounded-lg" />
            </div>
            <div className="flex justify-start items-center w-full col-span-2">
              <SkeletonLoader width="40" height="6" borderRadius="rounded-lg" />
            </div>
            <div className="flex items-center justify-end col-span-2">
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

  const columns = [
    "Company",
    "Round",
    "Cost basis",
    "Current investment value",
    "",
  ];

  // when to show pagination
  const showPagination = totalInvestmentTransactionsCount > dataLimit;

  if (transactionsLoading) {
    return loaderContent;
  }

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
                  className={`text-sm ${idx < 2 ? "col-span-3" : "col-span-2"}`}
                >
                  <span className="text-gray-syn4 text-sm">{col}</span>
                </div>
              ))}
            </div>
          </div>

          {investmentTransactions?.[pageOffset].map(
            (
              {
                metadata: {
                  companyName,
                  roundCategory,
                  preMoneyValuation,
                  postMoneyValuation,
                },
              },
              index,
            ) => {
              const [costBasisUSD, costBasisDecimalValue] =
                floatedNumberWithCommas(postMoneyValuation).split(".");
              const [investmentValueUSD, investmentDecimalValue] =
                floatedNumberWithCommas(preMoneyValuation).split(".");
              const dashForMissingValue = (
                <span className="text-gray-syn4">-</span>
              );

              return (
                <div
                  key={`token-table-row-${index}`}
                  className="grid grid-cols-12 gap-5 border-b-1 border-gray-syn7 py-5"
                >
                  <div className="flex flex-row col-span-3 items-center">
                    <div className="text-base flex items-center">
                      {companyName ? companyName : dashForMissingValue}
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
                        {"USD"}
                      </span>
                    ) : (
                      dashForMissingValue
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
                        {"USD"}
                      </span>
                    ) : (
                      dashForMissingValue
                    )}
                  </div>
                  <div className="text-base flex col-span-2 items-center justify-end">
                    <div className="cursor-pointer flex items-center">
                      <div className="mr-2 flex items-center">
                        <Image
                          width="16"
                          height="16"
                          src="/images/assets/memo.svg"
                        />
                      </div>
                      <span className="text-gray-syn4">View memo</span>
                    </div>
                  </div>
                </div>
              );
            },
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
              {investmentTransactions?.[pageOffset]?.length < dataLimit
                ? pageOffset + investmentTransactions[pageOffset].length
                : pageOffset + dataLimit}
              {` of `} {totalInvestmentTransactionsCount}
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
    </>
  );
};

export default InvestmentsView;
