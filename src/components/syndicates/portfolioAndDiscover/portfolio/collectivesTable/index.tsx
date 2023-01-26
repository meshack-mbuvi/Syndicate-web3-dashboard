import { CopiedLinkIcon, CopyLinkIcon } from '@/components/iconWrappers';
import { B2, B3 } from '@/components/typography';
import { AppState } from '@/state';
import {
  floatedNumberWithCommas,
  numberWithCommas
} from '@/utils/formattedNumbers';
import { hasDecimals } from '@/utils/hasDecimals';
import Image from 'next/image';
import Link from 'next/link';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSelector } from 'react-redux';
import { CollectiveIcon } from '@/components/collectives/collectiveIcon';
import { amplitudeLogger, Flow } from '@/components/amplitude';
import { INVITE_LINK_COPY } from '@/components/amplitude/eventNames';

interface Props {
  columns: string[];
  tableData: any[];
}

const CollectivesTable: FC<Props> = ({ columns, tableData }) => {
  const {
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);

  // pagination
  const dataLimit = 10; // number of items to show on each page.
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedData, setPaginatedData] = useState<any[]>([]);

  // copy invite link
  const [copied, setCopied] = useState(false);
  const collectivesTableRef = useRef(null);

  const updateInviteLinkCopyState = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
    amplitudeLogger(INVITE_LINK_COPY, {
      flow: Flow.COLLECTIVE_CREATE
    });
  };

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

  const formatAmount = (amount: any) => {
    return hasDecimals(amount)
      ? floatedNumberWithCommas(parseFloat(amount))
      : numberWithCommas(amount);
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
            <button ref={collectivesTableRef} />
            <div
              className={`hidden md:grid grid-cols-6 gap-8 sm:gap-2 pb-3 text-gray-syn4 text-sm`}
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
                  address,
                  isOwner,
                  tokenName,
                  tokenSymbol,
                  tokenMedia,
                  totalUnclaimed,
                  maxTotalSupply,
                  totalClaimed,
                  pricePerNft,
                  inviteLink,
                  tokenMediaType
                },
                index
              ) => (
                <Link
                  key={`token-table-row-${index}`}
                  href={`/collectives/${address}/${isOwner ? 'manage' : ''}${
                    '?chain=' + activeNetwork.network
                  }`}
                >
                  <div
                    className={`grid gap-2 grid-cols-5 auto-cols-fr md:grid-cols-6 border-b-1 border-gray-steelGrey py-5 cursor-pointer overflow-x-scroll no-scroll-bar sm:overflow-x-auto group`}
                  >
                    {/* Collective artwork and name */}
                    <div className="flex flex-shrink-0 space-x-4 flex-nowrap flex-row items-center col-span-3 md:col-span-2">
                      <div className="flex flex-shrink-0 justify-center items-start">
                        <CollectiveIcon
                          tokenMedia={tokenMedia}
                          tokenMediaType={tokenMediaType}
                          customClasses="sm:mr-4 w-10 h-10 rounded"
                        />
                      </div>
                      <div className="flex flex-col md:flex-row text-base items-start md:items-center space-y-2 md:space-y-0">
                        <B2 extraClasses="md:mr-2 line-clamp-1">{tokenName}</B2>

                        <div className="flex md:hidden text-base items-center space-x-2">
                          <B3>{formatAmount(totalClaimed)} claimed</B3>
                        </div>

                        {/* move symbol to a different column on mobile devices  */}
                        <B2 extraClasses="hidden md:inline text-gray-syn4">
                          {tokenSymbol}
                        </B2>
                      </div>
                    </div>

                    {/* right-most column with available NFTs and symbol - only on mobile  */}
                    <div className="flex md:hidden flex-col items-end space-y-2 col-span-2">
                      <B2 extraClasses="text-gray-syn4 line-clamp-1">
                        {tokenSymbol.length > 6
                          ? `${tokenSymbol.slice(0, 6)}...`
                          : tokenSymbol}
                      </B2>
                      <B3 extraClasses="text-gray-syn4 flex-shrink-0 line-clamp-1">
                        {`${
                          +maxTotalSupply > 0
                            ? `${formatAmount(totalUnclaimed)} available`
                            : '--'
                        }`}
                      </B3>
                    </div>

                    {/* Available NFTs  */}
                    <div className="hidden md:flex text-base items-center space-x-2">
                      {+maxTotalSupply > 0 ? (
                        <>
                          <B2>{formatAmount(totalUnclaimed)}</B2>
                          <B2 extraClasses="text-gray-syn4">
                            of {formatAmount(maxTotalSupply)}
                          </B2>
                        </>
                      ) : (
                        <B2>-</B2>
                      )}
                    </div>

                    {/* Total claimed NFTs  */}
                    <div className="hidden md:flex text-base items-center space-x-2">
                      <B2>{formatAmount(totalClaimed)}</B2>
                    </div>

                    {/* Price per NFT  */}
                    <div className="hidden md:flex text-base items-center">
                      <div className="flex items-center mr-2 flex-shrink-0">
                        <Image
                          src={activeNetwork.nativeCurrency.logo}
                          width={20}
                          height={20}
                          objectFit="contain"
                        />
                      </div>
                      <div>
                        {formatAmount(pricePerNft)}{' '}
                        {activeNetwork.nativeCurrency.symbol}
                      </div>
                    </div>

                    {/* Copy links  */}
                    <div className="hidden md:flex text-base items-center justify-end opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <CopyToClipboard
                        text={inviteLink}
                        onCopy={updateInviteLinkCopyState}
                      >
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center"
                        >
                          <div className="flex items-center mr-2">
                            {copied ? (
                              <CopiedLinkIcon />
                            ) : (
                              <CopyLinkIcon color="text-gray-syn4" />
                            )}
                          </div>

                          <B2
                            extraClasses={` ${
                              copied ? 'text-green' : 'text-gray-syn4'
                            }`}
                          >
                            {copied ? 'Link copied' : 'Copy invite link'}
                          </B2>
                        </button>
                      </CopyToClipboard>
                    </div>
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

export default CollectivesTable;
