import { SkeletonLoader } from "@/components/skeletonLoader";
import GradientAvatar from "@/components/syndicates/portfolioAndDiscover/portfolio/GradientAvatar";
import useModal from "@/hooks/useModal";
import { AppState } from "@/state";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import Image from "next/image";
import { FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import PriceContainer from "../collectibles/shared/PriceContainer";
import TokenModal from "./TokenModal";
interface Props {
  columns: string[];
  tableData: any[];
  activeAssetTab: string;
}

const TokenTable: FC<Props> = ({ columns, tableData }) => {
  const {
    assetsSliceReducer: { loading },
  } = useSelector((state: AppState) => state);

  // pagination
  const dataLimit = 10; // number of items to show on each page.
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedData, setpaginatedData] = useState<any[]>([]);
  const [canNextPage, setCanNextPage] = useState<boolean>(true);
  const [canPreviousPage, setCanPreviousPage] = useState<boolean>(true);
  const tokensTableRef = useRef(null);
  const [skeletonState, setSkeletonState] = useState<boolean>(loading);
  const [showTokenModal, setShowTokenModal] = useModal();
  const [tokenDetails, setTokenDetails] = useState({});

  function goToNextPage() {
    setCurrentPage((page) => page + 1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => page - 1);
  }

  const getPaginatedData = () => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    setpaginatedData(tableData.slice(startIndex, endIndex));
  };

  useEffect(() => {
    getPaginatedData();
    if (currentPage === 1) {
      setCanPreviousPage(false);
    } else {
      setCanPreviousPage(true);
    }

    if (tableData.length - (currentPage - 1) * dataLimit > dataLimit) {
      setCanNextPage(true);
    } else {
      setCanNextPage(false);
    }
    // defaults to time of 1 second or loading time (whichever is higher)
    if (skeletonState) {
      setTimeout(() => {
        setSkeletonState(false);
      }, 1000);
    }
  }, [tableData, currentPage, dataLimit]);

  const LoaderContent: React.FC<{ animate: boolean }> = ({ animate }) => (
    <div className="relative">
      {!animate && (
        <div className="absolute flex flex-col justify-center items-center top-1/3 w-full z-10">
          <span className="text-white mb-4 text-xl">
            This club has no tokens yet.
          </span>
          <span className="text-gray-syn4">
            Any tokens held in this club’s wallet will appear here, including
            member deposits.
          </span>
        </div>
      )}
      <div className={!animate && `filter grayscale blur-md`}>
        {[...Array(4).keys()].map((_, index) => {
          return (
            <div
              className="grid grid-cols-12 gap-5 border-b-1 border-gray-syn6 py-3"
              key={index}
            >
              <div className="flex justify-start space-x-4 items-center w-full col-span-3">
                <div className="flex-shrink-0">
                  <SkeletonLoader
                    width="8"
                    height="8"
                    borderRadius="rounded-full"
                    animate={animate}
                  />
                </div>
                <SkeletonLoader
                  width="36"
                  height="6"
                  borderRadius="rounded-md"
                  animate={animate}
                />
              </div>
              {[...Array(2).keys()].map((_, index) => {
                return (
                  <div
                    className="w-full flex items-center col-span-3"
                    key={index}
                  >
                    <SkeletonLoader
                      width="36"
                      height="6"
                      borderRadius="rounded-md"
                      animate={animate}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  const tokensTitle = (
    <div className="flex text-base items-center">
      <img alt="token" src="/images/token.svg" />
      <div className="pl-3 text-xl">Tokens</div>
    </div>
  );

  if (loading) {
    return (
      <div className="mt-16">
        {tokensTitle}
        <LoaderContent animate={true} />
      </div>
    );
  }

  return (
    <>
      {!loading && tableData.length > 0 ? (
        <div className="mt-16">
          {tokensTitle}
          <div className="flex flex-col pt-8">
            {/* scroll to top of table with this button when pagination is clicked  */}
            <button ref={tokensTableRef} />
            <div className="grid grid-cols-12 gap-5 pb-3 text-gray-lightManatee">
              {columns?.map((col, idx) => (
                <div
                  key={`token-table-header-${idx}`}
                  className="text-sm col-span-3"
                >
                  {col}
                </div>
              ))}
            </div>
          </div>
          {loading || skeletonState ? (
            <LoaderContent animate={true} />
          ) : (
            paginatedData.map(
              (
                { tokenBalance, tokenName, tokenSymbol, price, logo },
                index,
              ) => {
                const [balanceValue, balanceDecimalValue] =
                  floatedNumberWithCommas(tokenBalance).split(".");
                const tokenValue =
                  parseFloat(Number(price) ? price : price?.usd ?? 0) *
                  parseFloat(tokenBalance);
                const [usd, usdDecimalValue] =
                  floatedNumberWithCommas(tokenValue).split(".");

                return (
                  <div
                    key={`token-table-row-${index}`}
                    className="grid grid-cols-12 gap-5 border-b-1 border-gray-syn7 py-5 cursor-pointer"
                    onClick={() => {
                      setShowTokenModal();
                      setTokenDetails({
                        tokenBalance,
                        tokenName,
                        tokenSymbol,
                        value:
                          parseFloat(Number(price) ? price : price?.usd ?? 0) *
                          parseFloat(tokenBalance),
                        logo,
                      });
                    }}
                  >
                    <div className="flex flex-row col-span-3 items-center">
                      <div className="flex flex-shrink-0 pr-4">
                        {logo ? (
                          <img
                            alt="token-icon"
                            src={logo}
                            className="w-8 h-8"
                          />
                        ) : (
                          <GradientAvatar name={tokenName} size={"w-8 h-8"} />
                        )}
                      </div>
                      <div className="text-base flex items-center">
                        {tokenName}&nbsp;
                        <span className="text-gray-lightManatee">
                          ({tokenSymbol})
                        </span>
                      </div>
                    </div>
                    <PriceContainer
                      wholeNumberValue={balanceValue}
                      decimalValue={balanceDecimalValue}
                    >
                      &nbsp;
                      {tokenSymbol}
                    </PriceContainer>

                    <PriceContainer
                      wholeNumberValue={usd}
                      decimalValue={usdDecimalValue}
                    >
                      &nbsp;
                      {"USD"}
                    </PriceContainer>
                  </div>
                );
              },
            )
          )}
        </div>
      ) : (
        <div className="mt-16">
          {tokensTitle}
          <LoaderContent animate={false} />
        </div>
      )}
      <div>
        {/* Pagination  */}
        {tableData.length > 10 ? (
          <div className="flex w-full text-white space-x-4 justify-center my-8 leading-6">
            <button
              className={`pt-1 ${
                !canPreviousPage
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
              onClick={goToPreviousPage}
              disabled={!canPreviousPage}
            >
              <Image
                src="/images/arrowBack.svg"
                height="16"
                width="16"
                alt="Previous"
              />
            </button>
            <p className="">
              {currentPage === 1 ? "1" : (currentPage - 1) * dataLimit} -{" "}
              {(currentPage - 1) * dataLimit + paginatedData.length}
              {` of `} {tableData.length}
            </p>

            <button
              className={`pt-1 ${
                !canNextPage
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
              onClick={goToNextPage}
              disabled={!canNextPage}
            >
              <Image
                src="/images/arrowNext.svg"
                height="16"
                width="16"
                alt="Next"
              />
            </button>
          </div>
        ) : (
          ""
        )}
        <div>
          <TokenModal
            showModal={showTokenModal}
            closeModal={() => setShowTokenModal()}
            tokenDetails={tokenDetails}
          />
        </div>
      </div>
    </>
  );
};

export default TokenTable;
