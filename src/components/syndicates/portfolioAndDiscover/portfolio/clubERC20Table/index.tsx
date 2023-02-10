import { B2, B3 } from '@/components/typography';
import { CustomSyndicateDao } from '@/hooks/clubs/utils/types';
import { AppState } from '@/state';
import {
  floatedNumberWithCommas,
  numberWithCommas
} from '@/utils/formattedNumbers';
import { hasDecimals } from '@/utils/hasDecimals';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import GradientAvatar from '../GradientAvatar';

interface Props {
  columns: string[];
  tableData: Partial<CustomSyndicateDao>[];
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
  const scrollRef = useRef(null);

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

  const processTotalDeposits = (
    totalDeposits: any,
    depositERC20TokenSymbol: any
  ) => {
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
    <div className="overflow-x-scroll h-full no-scroll-bar">
      {tableData.length ? (
        <div className="w-full">
          <div className="flex flex-col">
            {/* scroll to top of table with this button when pagination is clicked  */}
            <button ref={scrollRef} />
            <div
              className={`hidden md:grid ${
                columns.length > 4 ? 'grid-cols-7' : 'grid-cols-4'
              } md:grid-cols-7 gap-8 sm:gap-2 pb-3 text-gray-syn4 text-sm`}
            >
              {columns?.map((col, idx) => (
                <div
                  key={`token-table-header-${idx}`}
                  className={`text-sm ${idx > 3 ? 'text-right' : ''} ${
                    idx === 0 ? 'col-span-2' : ''
                  }`}
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
                  contractAddress,
                  name: clubName,
                  status,
                  ownershipShare,
                  depositERC20TokenSymbol,
                  depositTokenLogo,
                  membersCount,
                  totalDeposits,
                  memberDeposits,
                  isOwner,
                  symbol
                },
                index
              ) => (
                <Link
                  key={`token-table-row-${index}`}
                  href={`/clubs/${contractAddress as string}/${
                    isOwner ? 'manage' : ''
                  }${'?chain=' + activeNetwork.network}`}
                >
                  <div
                    className={`grid gap-2 grid-cols-5 auto-cols-fr md:grid-cols-7 border-b-1 border-gray-steelGrey py-5 cursor-pointer overflow-x-scroll no-scroll-bar sm:overflow-x-auto`}
                  >
                    {/* Gradient avatar, club name, and symbol  */}
                    <div className="flex flex-shrink-0 flex-nowrap flex-row items-center col-span-3 md:col-span-2 space-x-4 md:space-x-0">
                      <div className="flex flex-shrink-0">
                        <div className="sm:mr-4">
                          <GradientAvatar name={clubName} size="h-8 w-8" />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row text-base items-start md:items-center space-y-2 md:space-y-0">
                        <B2 extraClasses="flex text-base items-center mr-2 line-clamp-1">
                          {clubName}
                        </B2>
                        <div className="flex md:hidden text-base items-center">
                          <div className="flex items-center mr-2 flex-shrink-0">
                            <Image
                              src={
                                depositTokenLogo || '/images/token-gray-4.svg'
                              }
                              width={20}
                              height={20}
                              objectFit="contain"
                            />
                          </div>
                          <B3 extraClasses="line-clamp-1">
                            {processTotalDeposits(
                              totalDeposits,
                              depositERC20TokenSymbol
                            )}{' '}
                            {depositERC20TokenSymbol}
                          </B3>
                        </div>

                        <div className="hidden md:flex text-base items-center text-gray-syn4">
                          {symbol}
                        </div>
                      </div>
                    </div>

                    {/* Club status  */}
                    <div className="hidden md:flex text-base items-center">
                      {status}
                    </div>

                    {/* Club total deposits  */}
                    <div className="hidden md:flex text-base items-center">
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

                    {/* right-most column with club status and symbol - only on mobile  */}
                    <div className="flex md:hidden flex-col items-end space-y-2 col-span-2">
                      <B2 extraClasses="text-gray-syn4 line-clamp-1">
                        {symbol.length > 6
                          ? `${symbol.slice(0, 6)}...`
                          : symbol}
                      </B2>
                      <B3 extraClasses="text-gray-syn4 flex-shrink-0">
                        {status}
                      </B3>
                    </div>

                    {/* Member count  */}
                    <div className={`hidden md:flex text-base items-center`}>
                      {membersCount}
                    </div>

                    {/* Columns to show to members only  */}
                    {!isOwner && (
                      <>
                        <div className="hidden md:flex text-base items-center justify-end">
                          <div className="flex items-center mr-2">
                            <Image
                              src={
                                depositTokenLogo || '/images/token-gray-4.svg'
                              }
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
                        <div className="hidden md:flex text-base items-center justify-end">
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
