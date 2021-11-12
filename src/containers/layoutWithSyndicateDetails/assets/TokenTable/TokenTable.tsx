import { FC, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import GradientAvatar from "@/components/syndicates/portfolioAndDiscover/portfolio/GradientAvatar";
import { SkeletonLoader } from "@/components/skeletonLoader";
import AssetEmptyState from "@/containers/layoutWithSyndicateDetails/assets/AssetEmptyState";
interface Props {
  columns: string[];
  tableData: any[];
  activeAssetTab: string;
}

const TokenTable: FC<Props> = ({ columns, tableData, activeAssetTab }) => {
  const {
    assetsSliceReducer: { loading, tokensResult },
  } = useSelector((state: RootState) => state);

  // pagination
  const dataLimit = 10; // number of items to show on each page.
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedData, setpaginatedData] = useState<any[]>([]);
  const [canNextPage, setCanNextPage] = useState<boolean>(true);
  const [canPreviousPage, setCanPreviousPage] = useState<boolean>(true);
  const tokensTableRef = useRef(null);

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
  }, [tableData, currentPage, dataLimit]);

  // generate multiple skeleton loader components
  const generateSkeletons = (
    num: number,
    width: string,
    height: string,
    borderRadius?: string,
  ) => {
    const skeletonsWrapper = [];
    for (let i = 0; i < num; i++) {
      skeletonsWrapper.push(
        <div className="w-full flex items-center" key={i}>
          <SkeletonLoader
            width={width}
            height={height}
            borderRadius={borderRadius}
          ></SkeletonLoader>
        </div>,
      );
    }
    return skeletonsWrapper;
  };

  const loaderContent = (
    <div>
      {[1, 2, 3, 4].map((index) => {
        return (
          <div
            className="grid grid-cols-3 border-b-1 border-gray-steelGrey py-3"
            key={index}
          >
            <div className="flex justify-start space-x-4 items-center w-full">
              <div className="flex-shrink-0">
                <SkeletonLoader
                  width="8"
                  height="8"
                  borderRadius="rounded-full"
                />
              </div>
              <SkeletonLoader width="36" height="6" borderRadius="rounded-md" />
            </div>
            {generateSkeletons(2, "36", "6", "rounded-md")}
          </div>
        );
      })}
    </div>
  );

  // return empty state if on active tab and there are no collectibles
  if (activeAssetTab === "tokens" && !loading && !tokensResult.length) {
    return <AssetEmptyState activeAssetTab={activeAssetTab} />;
  }

  return (
    <>
      {tableData.length ? (
        <div className="mt-16">
          <div className="flex text-base items-center">
            <img alt="token" src="/images/token.svg" />
            <div className="pl-3 text-xl">Tokens</div>
          </div>
          <div className="flex flex-col pt-8">
            {/* scroll to top of table with this button when pagination is clicked  */}
            <button ref={tokensTableRef} />
            <div className="grid grid-cols-3 pb-3 text-gray-lightManatee">
              {columns?.map((col, idx) => (
                <div key={`token-table-header-${idx}`} className="text-sm">{col}</div>
              ))}
            </div>
          </div>
          {loading
            ? loaderContent
            : paginatedData.map(
                (
                  { tokenBalance, tokenName, tokenSymbol, price, logo },
                  index,
                ) => {
                  const [balanceValue, balanceDecimalValue] =
                    floatedNumberWithCommas(tokenBalance).split(".");
                  const tokenValue =
                    parseFloat(price ? price : 1) * parseFloat(tokenBalance);
                  const [usd, usdDecimalValue] =
                    floatedNumberWithCommas(tokenValue).split(".");
                  return (
                    <div
                      key={`token-table-row-${index}`}
                      className="grid grid-cols-3 border-b-1 border-gray-steelGrey py-5"
                    >
                      <div className="flex flex-row items-center">
                        <div className="flex flex-shrink-0 pr-4">
                          {logo ? (
                            <img
                              alt="token-icon"
                              src={logo}
                              className="w-8 h-8"
                            />
                          ) : (
                            <GradientAvatar
                              syndicateAddress={tokenName}
                              size={"w-8 h-8"}
                            />
                          )}
                        </div>
                        <div className="text-base flex items-center">
                          {tokenName}&nbsp;
                          <span className="text-gray-lightManatee">
                            ({tokenSymbol})
                          </span>
                        </div>
                      </div>
                      <div className="text-base flex items-center">
                        {balanceValue}
                        {balanceDecimalValue && (
                          <span className="text-gray-lightManatee">
                            .{balanceDecimalValue}
                          </span>
                        )}
                        &nbsp;
                        {tokenSymbol}
                      </div>
                      <div className="text-base flex items-center">
                        {usd}
                        {usdDecimalValue && (
                          <span className="text-gray-lightManatee">
                            .{usdDecimalValue}
                          </span>
                        )}
                        &nbsp;
                        {"USD"}
                      </div>
                    </div>
                  );
                },
              )}
        </div>
      ) : null}
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
              onClick={() => goToPreviousPage()}
              disabled={!canPreviousPage}
            >
              <Image
                src={"/images/arrowBack.svg"}
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
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default TokenTable;
