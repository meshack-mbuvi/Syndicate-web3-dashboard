import {
  floatedNumberWithCommas,
  numberWithCommas,
} from "@/utils/formattedNumbers";
import { hasDecimals } from "@/utils/hasDecimals";
import Image from "next/image";
import router from "next/router";
import React, { FC, useEffect, useRef, useState } from "react";
import GradientAvatar from "../GradientAvatar";

interface Props {
  columns: string[];
  tableData: any[];
}

const ClubERC20Table: FC<Props> = ({ columns, tableData }) => {
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

  return (
    <>
      {tableData.length ? (
        <div>
          <div className="flex flex-col">
            {/* scroll to top of table with this button when pagination is clicked  */}
            <button ref={tokensTableRef} />
            <div className="grid grid-cols-6 pb-3 text-gray-syn4 font-whyte text-sm">
              {columns?.map((col, idx) => (
                <div
                  key={`token-table-header-${idx}`}
                  className={`text-sm ${idx > 3 ? "text-right" : ""}`}
                >
                  {col}
                </div>
              ))}
            </div>
          </div>

          {paginatedData.map((dataItem, index) => {
            const {
              address,
              clubName,
              status,
              ownershipShare,
              depositAmount,
              depositERC20TokenSymbol,
              membersCount,
              totalDeposits,
              isOwner,
            } = dataItem;

            return (
              <div
                key={`token-table-row-${index}`}
                className="grid grid-cols-6 border-b-1 w-full border-gray-steelGrey py-5 cursor-pointer"
                onClick={() => {
                  if (isOwner) {
                    router.replace(`/clubs/${address}/manage`);
                  } else {
                    router.replace(`/clubs/${address}/deposit`);
                  }
                }}
              >
                <div className="flex flex-row items-center">
                  <div className="flex flex-shrink-0">
                    <div className="mr-4">
                      <GradientAvatar
                        syndicateAddress={clubName}
                        size="h-8 w-8"
                      />
                    </div>
                  </div>
                  <div className="flex text-base items-center">{clubName}</div>
                </div>
                <div className="flex text-base items-center">{status}</div>
                <div className="flex text-base items-center">
                  {hasDecimals(totalDeposits)
                    ? floatedNumberWithCommas(parseFloat(totalDeposits))
                    : numberWithCommas(totalDeposits)}{" "}
                  {depositERC20TokenSymbol}
                </div>
                <div className="flex text-base items-center">
                  {membersCount}
                </div>

                {!isOwner && (
                  <>
                    <div className="flex text-base items-center justify-end">
                      {hasDecimals(depositAmount)
                        ? floatedNumberWithCommas(depositAmount)
                        : numberWithCommas(depositAmount)}{" "}
                      {depositAmount?.trim() !== "-" && depositERC20TokenSymbol}
                    </div>
                    <div className="flex text-base items-center justify-end">
                      {`${
                        hasDecimals(ownershipShare)
                          ? ownershipShare.toFixed(2)
                          : ownershipShare
                      } %`}
                    </div>
                  </>
                )}
              </div>
            );
          })}
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

export default ClubERC20Table;
