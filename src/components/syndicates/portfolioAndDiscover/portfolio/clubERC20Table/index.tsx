import {
  floatedNumberWithCommas,
  numberWithCommas,
} from "@/utils/formattedNumbers";
import { hasDecimals } from "@/utils/hasDecimals";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import GradientAvatar from "../GradientAvatar";
import { AppState } from '@/state';
import { useSelector } from 'react-redux';

interface Props {
  columns: string[];
  tableData: any[];
}

const ClubERC20Table: FC<Props> = ({ columns, tableData }) => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  // pagination
  const dataLimit = 10; // number of items to show on each page.
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedData, setPaginatedData] = useState<any[]>([]);
  const tokensTableRef = useRef(null);

  function goToNextPage() {
    setCurrentPage((page) => page + 1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => page - 1);
  }

  const canPreviousPage = useMemo(() => currentPage !== 1, [currentPage]);
  const canNextPage = useMemo(
    () => tableData.length - (currentPage - 1) * dataLimit > dataLimit,
    [tableData.length, currentPage, dataLimit]
  );

  const processTotalDeposits = (rawTotalDeposits, depositERC20TokenSymbol) => {
    const totalDeposits =
      depositERC20TokenSymbol == activeNetwork.nativeCurrency.symbol
        ? rawTotalDeposits / 10000
        : rawTotalDeposits;
    return hasDecimals(totalDeposits)
      ? floatedNumberWithCommas(
          parseFloat(totalDeposits),
          depositERC20TokenSymbol == activeNetwork.nativeCurrency.symbol
            ? true
            : false
        )
      : numberWithCommas(totalDeposits);
  };

  useEffect(() => {
    const startIndex = currentPage * dataLimit - dataLimit;
    const endIndex = startIndex + dataLimit;
    setPaginatedData(tableData.slice(startIndex, endIndex));
  }, [currentPage, dataLimit, tableData]);

  return (
    <div className="overflow-x-scroll no-scroll-bar">
      {tableData.length ? (
        <div className="w-max sm:w-full">
          <div className="flex flex-col">
            {/* scroll to top of table with this button when pagination is clicked  */}
            <button ref={tokensTableRef} />
            <div
              className={`grid ${
                columns.length > 4 ? 'grid-cols-6' : 'grid-cols-4'
              } md:grid-cols-6 gap-8 pb-3 text-gray-syn4 font-whyte text-sm`}
            >
              {columns?.map((col, idx) => (
                <div
                  key={`token-table-header-${idx}`}
                  className={`text-sm ${idx > 3 ? 'text-right' : ''}`}
                >
                  {col}
                </div>
              ))}
            </div>
          </div>

          <div className="">
            {paginatedData.map(
              (
                {
                  address,
                  clubName,
                  status,
                  ownershipShare,
                  depositERC20TokenSymbol,
                  depositTokenLogo,
                  membersCount,
                  totalDeposits,
                  memberDeposits,
                  isOwner
                },
                index
              ) => (
                <Link
                  key={`token-table-row-${index}`}
                  href={`/clubs/${address}/${isOwner ? 'manage' : ''}`}
                >
                  <div
                    className={`grid sm:gap-2 ${
                      isOwner ? 'grid-cols-4' : 'grid-cols-6'
                    } auto-cols-fr md:grid-cols-6 gap-8 border-b-1 border-gray-steelGrey py-5 cursor-pointer overflow-x-scroll no-scroll-bar sm:overflow-x-auto`}
                  >
                    <div className="flex flex-shrink-0 flex-nowrap flex-row items-center">
                      <div className="flex flex-shrink-0">
                        <div className="hidden sm:block sm:mr-4">
                          <GradientAvatar name={clubName} size="h-8 w-8" />
                        </div>
                      </div>
                      <div className="flex text-base items-center">
                        {clubName}
                      </div>
                    </div>
                    <div className="flex text-base items-center">{status}</div>
                    <div className="flex text-base items-center">
                      <div className="flex items-center mr-2 flex-shrink-0">
                        <Image
                          src={depositTokenLogo || '/images/token-gray-4.svg'}
                          width={20}
                          height={20}
                          objectFit="contain"
                        />
                      </div>
                      <div>
                        {processTotalDeposits(
                          totalDeposits,
                          depositERC20TokenSymbol
                        )}{' '}
                        {depositERC20TokenSymbol}
                      </div>
                    </div>
                    <div className={`flex text-base items-center`}>
                      {membersCount}
                    </div>

                    {!isOwner && (
                      <>
                        <div className="flex text-base items-center justify-end">
                          <div className="flex items-center mr-2">
                            <Image
                              src={depositTokenLogo}
                              width={20}
                              height={20}
                            />
                          </div>
                          {floatedNumberWithCommas(
                            memberDeposits,
                            depositERC20TokenSymbol ==
                              activeNetwork.nativeCurrency.symbol
                              ? true
                              : false
                          )}{' '}
                          {depositERC20TokenSymbol}
                        </div>
                        <div className="flex text-base items-center justify-end">
                          {`${
                            hasDecimals(ownershipShare)
                              ? ownershipShare.toFixed(2)
                              : ownershipShare
                          }%`}
                        </div>
                      </>
                    )}
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      ) : null}
      <div>
        {/* Pagination  */}
        {tableData.length > 10 ? (
          <div className="flex w-full text-white space-x-4 justify-center my-8 leading-6">
            <button
              className={`pt-1 ${
                !canPreviousPage
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-90'
              }`}
              onClick={goToPreviousPage}
              disabled={!canPreviousPage}
            >
              <Image
                src={'/images/arrowBack.svg'}
                height="16"
                width="16"
                alt="Previous"
              />
            </button>
            <p className="">
              {currentPage === 1 ? '1' : (currentPage - 1) * dataLimit} -{' '}
              {(currentPage - 1) * dataLimit + paginatedData.length}
              {` of `} {tableData.length}
            </p>

            <button
              className={`pt-1 ${
                !canNextPage
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-90'
              }`}
              onClick={goToNextPage}
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
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default ClubERC20Table;
