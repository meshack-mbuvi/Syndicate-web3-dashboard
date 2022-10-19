import { ActionButton } from '@/components/actionButton';
import { SearchInput } from '@/components/inputs';
import { Checkbox } from '@/components/inputs/simpleCheckbox';
import {
  AddressImageSize,
  AddressWithENS
} from '@/components/shared/ensAddress';
import { B2, H4 } from '@/components/typography';
import { getFormattedDateTimeWithTZ } from '@/utils/dateUtils';
import {
  numberWithCommas,
  removeTrailingDecimalPoint
} from '@/utils/formattedNumbers';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  membersDetails: {
    ensName: string;
    avatar?: string;
    address: string;
    createdAt: string;
    clubTokenHolding?: number;
    distributionShare: number;
    ownershipShare: number;
    receivingTokens: {
      amount: number;
      tokenSymbol: string;
      tokenIcon: string;
    }[];
  }[];
  tokens: {
    tokenSymbol: string;
    tokenAmount: string;
    symbol: string;
    icon: string;
  }[];
  activeAddresses: Array<string>;
  handleActiveAddressesChange: (addresses: string[]) => void;
  isEditing: boolean;
  handleIsEditingChange: () => void;
  hideSearch?: boolean;
  handleSearchChange: (event: any) => void;
  searchValue: string;
  clearSearchValue: (event: any) => void;
  extraClasses?: string;
  ethersProvider?: any;
  isBlurred?: boolean;
}

enum SORT_BY {
  createdAt = 'createdAt',
  distributionShare = 'distributionShare'
}

enum SORT_ORDER {
  ASC = 'ASC',
  DESC = 'DESC'
}

export const DistributionMembersTable: React.FC<Props> = ({
  membersDetails,
  activeAddresses,
  isEditing,
  tokens,
  handleIsEditingChange,
  hideSearch = false,
  handleSearchChange,
  searchValue,
  clearSearchValue,
  handleActiveAddressesChange,
  extraClasses,
  ethersProvider,
  isBlurred = false
}: Props) => {
  const isAddressActive = (address: string): boolean => {
    return activeAddresses.includes(address);
  };

  const dataLimit = 10;

  const [sortBy, setSortBy] = useState({
    key: '',
    order: SORT_ORDER.ASC
  });

  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredHeader, setHoveredHeader] = useState('');

  const [_membersDetails, setMemberDetails] = useState<
    {
      createdAt: string;
      ensName: string;
      address: string;
      avatar?: string;
      clubTokenHolding?: number;
      distributionShare: string | number;
      ownershipShare: number;
      receivingTokens: {
        amount: number;
        tokenSymbol: string;
        tokenIcon: string;
      }[];
    }[]
  >(membersDetails.slice(0, dataLimit));

  const [currentPage, setCurrentPage] = useState(1);

  const canLoadMore = useMemo(
    () => membersDetails.length - (currentPage - 1) * dataLimit > dataLimit,
    [membersDetails.length, currentPage, dataLimit]
  );

  const handleLoadMore = (): void => {
    setCurrentPage(currentPage + 1);
  };

  const [loadMoreText, setLoadMoreText] = useState(dataLimit);

  useEffect(() => {
    const _sortedMembers = membersDetails
      .map((m) => m)
      .sort((a, b) => {
        const { key, order } = sortBy;
        if (key === SORT_BY.createdAt) {
          if (order === SORT_ORDER.ASC) return +b.createdAt - +a.createdAt;

          return +a.createdAt - +b.createdAt;
        }

        if (key === SORT_BY.distributionShare) {
          const aDistributionShare = parseFloat(a.distributionShare.toString());
          const bDistributionShare = parseFloat(b.distributionShare.toString());

          if (order === SORT_ORDER.ASC)
            return bDistributionShare - aDistributionShare;

          return aDistributionShare - bDistributionShare;
        }

        return 0;
      });

    setMemberDetails(_sortedMembers);
  }, [sortBy]);

  useEffect(() => {
    const remainingItems = membersDetails.length - _membersDetails.length;

    if (remainingItems > dataLimit) {
      setLoadMoreText(dataLimit);
    } else {
      setLoadMoreText(remainingItems);
    }
  }, [_membersDetails.length, currentPage, membersDetails.length]);

  useEffect(() => {
    setMemberDetails(membersDetails.slice(0, dataLimit * currentPage));
  }, [currentPage, membersDetails]);

  // We re-calculate the total token distribution for each member when
  // a member is de-selected or selected.
  // should execute only when activeAddresses array changes.
  useEffect(() => {
    if (membersDetails.length && tokens.length) {
      const cumulativeActiveMemberOwnership = membersDetails.reduce(
        (acc, curr) => {
          // if member is active
          if (activeAddresses.includes(curr.address)) {
            return acc + +curr.ownershipShare;
          } else {
            return acc;
          }
        },
        0
      );

      const memberDetails = membersDetails
        .slice(0, currentPage * dataLimit)
        .map(({ ownershipShare, createdAt, ...rest }) => {
          return {
            ...rest,
            createdAt,
            ownershipShare,
            distributionShare: (
              (+ownershipShare * 100) /
              cumulativeActiveMemberOwnership
            ).toFixed(4),
            receivingTokens: tokens.map(({ tokenAmount, symbol, icon }) => {
              return {
                amount:
                  (ownershipShare / cumulativeActiveMemberOwnership) *
                  +tokenAmount,
                tokenSymbol: symbol,
                tokenIcon: icon || '/images/token-gray.svg'
              };
            })
          };
        })
        .sort((a, b) => {
          const { key, order } = sortBy;
          if (key === SORT_BY.createdAt) {
            if (order === SORT_ORDER.ASC) return +b.createdAt - +a.createdAt;

            return +a.createdAt - +b.createdAt;
          }

          if (key === SORT_BY.distributionShare) {
            if (order === SORT_ORDER.ASC)
              return (
                parseFloat(b.distributionShare) -
                parseFloat(a.distributionShare)
              );
            return (
              parseFloat(a.distributionShare) - parseFloat(b.distributionShare)
            );
          }

          return 0;
        });

      setMemberDetails(memberDetails);
    } else {
      setMemberDetails([]);
    }

    return (): void => {
      setMemberDetails([]);
    };
  }, [activeAddresses]);

  const normalCellHeight = 'h-16';
  const memberCellStyles = (address: string): string => {
    return `${
      (hoveredRow === address && 'bg-gray-syn8') || ''
    } transition-all ease-out ${normalCellHeight} border-gray-syn6
    } ${(!isAddressActive(address) && 'text-gray-syn5') || ''} ${
      (isBlurred && 'opacity-50 filter blur-md') || ''
    }`;
  };

  const footerCellStyles = `${normalCellHeight}`;
  const wideCellStyles = `w-60 xl:w-72`;
  const narrowCellStyles = `w-12`;
  const headerCellStyles = 'w-60 xl:w-72';
  const amountCellStyles = 'font-mono';

  const handleSetSortParams = (_sortBy: SORT_BY): void => {
    let order = SORT_ORDER.ASC;
    const _currentSortBy = sortBy.key;

    if (_currentSortBy == _sortBy) {
      if (sortBy.order === SORT_ORDER.ASC) {
        order = SORT_ORDER.DESC;
      } else {
        order = SORT_ORDER.ASC;
      }
    } else {
      // retain current sort order
      order = sortBy.order;
    }

    setSortBy({
      order,
      key: _sortBy
    });
  };

  // This iterates through the rows finding all unique
  // tokens to determine the table columns (e.g "Receiving {tokenSymbol}")
  // @ts-expect-error TS(2739): Type '{ memberName: string; clubTokenHolding?: num... Remove this comment to see the full error message
  const allUniqueReceivingTokens: {
    tokenSymbols: string[];
    tokenIcons: string[];
  } = _membersDetails.reduce(
    // @ts-expect-error TS(2769): No overload matches this call.
    (
      columns: { tokenSymbols: [string]; tokenIcons: [string] },
      memberDetails
    ) => {
      const newTokenSymbols: any = [];
      const newTokenIcons: any = [];
      memberDetails.receivingTokens.forEach((receivingToken) => {
        const tokenSymbol = receivingToken.tokenSymbol;
        const tokenIcon = receivingToken.tokenIcon;

        if (!columns.tokenSymbols.includes(tokenSymbol)) {
          newTokenSymbols.push(tokenSymbol);
          newTokenIcons.push(tokenIcon);
        }
      });
      return {
        tokenSymbols: [...columns.tokenSymbols, ...newTokenSymbols],
        tokenIcons: [...columns.tokenIcons, ...newTokenIcons]
      };
    },
    { tokenSymbols: [], tokenIcons: [] }
  );

  const [tokenAmountTotals, setTokenAmountTotals] = useState([]);

  useEffect(() => {
    // Even during editing, token totals don't change so no need to re-calculate
    // them
    if (isEditing) return;

    setTokenAmountTotals(
      // @ts-expect-error TS(2345): Argument of type 'number[]' is not assignable to p... Remove this comment to see the full error message
      allUniqueReceivingTokens.tokenSymbols.map((tokenSymbol) => {
        return _membersDetails.reduce((total: number, memberDetails) => {
          let memberTotal = 0;
          memberDetails.receivingTokens.forEach((receivingToken) => {
            if (
              receivingToken.tokenSymbol === tokenSymbol &&
              isAddressActive(memberDetails.address)
            ) {
              memberTotal += +receivingToken.amount;
            }
          });
          return total + +memberTotal;
        }, 0);
      })
    );
  }, [activeAddresses, JSON.stringify(_membersDetails), isEditing]);

  // The top row with column titles
  const renderedHeader = (
    <div className="flex text-sm text-gray-syn4">
      {/* Left columns - member, share */}
      <div
        className={`flex ${(isBlurred && 'opacity-50 filter blur-md') || ''}`}
      >
        {/* Checkbox */}
        {isEditing ? (
          <div className={`flex items-center ${narrowCellStyles}`}>
            <Checkbox
              isActive={
                activeAddresses.length <= _membersDetails.length &&
                activeAddresses.length > 0
              }
              usePartialCheck={activeAddresses.length < _membersDetails.length}
              onChange={() => {
                if (
                  activeAddresses.length <= _membersDetails.length &&
                  activeAddresses.length > 0
                ) {
                  handleActiveAddressesChange([]);
                } else {
                  const activeAddresses: any = [];
                  _membersDetails.forEach((member) =>
                    activeAddresses.push(member.address)
                  );

                  handleActiveAddressesChange(activeAddresses);
                }
              }}
              extraClasses="mx-auto"
            />
          </div>
        ) : null}

        {/* Members */}
        <div className={`flex items-center ${headerCellStyles}`}>
          Members ({_membersDetails.length})
        </div>

        <div
          className={`flex items-center ${headerCellStyles}`}
          onClick={(): void => handleSetSortParams(SORT_BY.createdAt)}
          role="button"
          tabIndex={0}
          onKeyDown={(): void => handleSetSortParams(SORT_BY.createdAt)}
          onMouseEnter={(): void => setHoveredHeader('date/joined')}
          onMouseLeave={(): void => setHoveredHeader('')}
        >
          {sortBy.key === SORT_BY.createdAt ||
          hoveredHeader == 'date/joined' ? (
            <span className="mr-1">
              <Image
                src={`/images/${
                  sortBy.order == SORT_ORDER.ASC
                    ? 'arrowUpWhite'
                    : 'arrowDownWhite'
                }.svg`}
                width={12}
                height={12}
              />
            </span>
          ) : null}
          Date joined/added
        </div>

        {/* Distribution share */}
        <div
          className={`flex items-center ${headerCellStyles}`}
          onClick={(): void => handleSetSortParams(SORT_BY.distributionShare)}
          role="button"
          tabIndex={0}
          onKeyDown={(): void => handleSetSortParams(SORT_BY.distributionShare)}
          onMouseEnter={(): void => setHoveredHeader('distributionShare')}
          onMouseLeave={(): void => setHoveredHeader('')}
        >
          {sortBy.key === SORT_BY.distributionShare ||
          hoveredHeader == 'distributionShare' ? (
            <span className="mr-1">
              <Image
                src={`/images/${
                  sortBy.order == SORT_ORDER.ASC
                    ? 'arrowUpWhite'
                    : 'arrowDownWhite'
                }.svg`}
                width={12}
                height={12}
              />
            </span>
          ) : null}
          Distribution share
        </div>
      </div>

      {/* Middle column - spacer */}
      <div className="flex-grow" />

      {/* Right columns - receiving tokens */}
      <div
        className={`flex ${(isBlurred && 'opacity-50 filter blur-md') || ''}`}
      >
        {allUniqueReceivingTokens.tokenSymbols.map((tokenSymbol, index) => {
          return (
            <div
              key={index}
              className={`flex space-x-2 items-center text-right justify-end ${headerCellStyles}`}
            >
              <div>Receiving</div>
              <div className="flex align-center">
                <Image
                  src={allUniqueReceivingTokens.tokenIcons[index]}
                  alt=""
                  width={24}
                  height={24}
                />
              </div>
              <div>{tokenSymbol}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPagination = (
    <div
      className={`flex ${
        (isBlurred && 'opacity-50 filter blur-md') || ''
      } justify-center w-full border-t-1 text-blue whitespace-nowrap ${narrowCellStyles} ${footerCellStyles}`}
    >
      <button onClick={handleLoadMore}>Load {loadMoreText} more</button>
    </div>
  );

  // The rows with individual member distribution data filtered by search value
  const renderedTable = (
    searchValue
      ? _membersDetails.filter(
          (member) =>
            member.address.toLowerCase().includes(searchValue.toLowerCase()) ||
            member.ensName.toLowerCase().includes(searchValue.toLowerCase())
        )
      : _membersDetails
  ).map((memberDetails) => {
    return (
      <button
        onClick={(): void => {
          if (!isEditing) return;
          // The index was active so make it inactive
          if (isAddressActive(memberDetails.address)) {
            let newactiveIndices;
            const indexToRemove = activeAddresses.indexOf(
              memberDetails.address
            );
            if (indexToRemove > -1) {
              const arrayWithoutIndex = (array: any, index: any): string[] =>
                array.filter((_: any, i: any) => i !== index);
              newactiveIndices = arrayWithoutIndex(
                activeAddresses,
                indexToRemove
              );
              handleActiveAddressesChange(newactiveIndices);
            }
          }

          // The index was inactive so make it active
          else {
            handleActiveAddressesChange([
              ...activeAddresses,
              memberDetails.address
            ]);
          }
        }}
        onMouseOver={() => {
          if (!isEditing) return;

          // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
          setHoveredRow(memberDetails.address);
        }}
        onFocus={() => {
          if (!isEditing) return;

          // @ts-expect-error TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
          setHoveredRow(memberDetails.address);
        }}
        onMouseLeave={() => {
          if (!isEditing) return;

          setHoveredRow(null);
        }}
        className={`w-full flex justify-between ${
          isEditing ? 'cursor-pointer' : 'cursor-text'
        } transition-all ease-out border-b-1 border-gray-syn6 ${
          isBlurred ? 'opacity-70 filter blur-md' : ''
        }`}
        key={memberDetails.address}
      >
        {/* Left columns - member, share */}
        <div className="flex">
          {/* Checkbox */}
          {isEditing ? (
            <div
              className={`flex items-center ${narrowCellStyles} ${memberCellStyles(
                memberDetails.address
              )}`}
            >
              <Checkbox
                isActive={isAddressActive(memberDetails.address)}
                extraClasses="mx-auto"
              />
            </div>
          ) : null}

          {/* Member name */}
          <div
            className={`flex items-center space-x-4  ${wideCellStyles} ${memberCellStyles(
              memberDetails.address
            )}`}
          >
            <AddressWithENS
              ethersProvider={ethersProvider}
              userPlaceholderImg={'/images/user.svg'}
              address={memberDetails.address}
              imageSize={AddressImageSize.LARGE}
              disableTransition={isEditing}
              disabled={!isAddressActive(memberDetails.address)}
            />
          </div>

          {/* Date member joined */}
          <div
            className={`flex space-x-3 items-center font-mono ${wideCellStyles} ${memberCellStyles(
              memberDetails.address
            )}`}
          >
            <div>
              {getFormattedDateTimeWithTZ(
                +memberDetails.createdAt * 1000,
                'MMMM DD YYYY'
              )}
            </div>
          </div>

          {/* Share of holdings */}
          <div
            className={`flex space-x-3 items-center font-mono ${wideCellStyles} ${memberCellStyles(
              memberDetails.address
            )}`}
          >
            {/* Percentage */}
            <div>
              {isAddressActive(memberDetails.address)
                ? parseFloat(`${memberDetails.distributionShare}`)
                : '0'}
              %
            </div>
          </div>
        </div>

        {/* Middle column - spacer */}
        {/* This is needed to continue the borders and hover effect */}
        <div
          className={`flex-grow h-16 ${memberCellStyles(
            memberDetails.address
          )}`}
        />

        {/* Right columns - receiving tokens */}
        <div className={`flex`}>
          {/* Each column represents a different token a member is receiving */}
          {allUniqueReceivingTokens?.tokenSymbols.map((tokenSymbol, index) => {
            const amount =
              memberDetails?.receivingTokens
                ?.find((receivingToken) => {
                  return receivingToken?.tokenSymbol === tokenSymbol;
                })
                ?.amount.toFixed(4) || 0;
            return (
              // Individual column
              <div
                className={`flex space-x-1 items-center justify-end pl-6 lg:pl-10 xl:pl-20 ${wideCellStyles} ${memberCellStyles(
                  memberDetails.address
                )} ${amountCellStyles}`}
                key={index}
              >
                <div className="text-right truncate w-full">
                  {isAddressActive(memberDetails.address)
                    ? removeTrailingDecimalPoint(numberWithCommas(amount))
                    : 0}
                </div>
                <div
                  className={`flex-shrink-0 ${
                    !isAddressActive(memberDetails.address)
                      ? 'text-gray-syn5'
                      : 'text-gray-syn4'
                  }`}
                >
                  {tokenSymbol}
                </div>
              </div>
            );
          })}
        </div>
      </button>
    );
  });

  // The bottom footer row with aggregate data
  const renderedFooter = (
    <div className={`flex ${isBlurred ? 'opacity-70 filter blur-md' : ''}`}>
      {/* Left columns - member, share */}
      <div className="flex">
        <div
          className={`flex items-center whitespace-nowrap ${
            !isEditing ? 'w-0' : narrowCellStyles
          } ${footerCellStyles}`}
        >
          Total distributed
        </div>

        {/* Space reserved for member name column */}
        <div
          className={`flex items-center ${wideCellStyles} ${footerCellStyles}`}
        />

        <div
          className={`flex items-center ${wideCellStyles} ${footerCellStyles}`}
        />

        <div
          className={`flex items-center ${wideCellStyles} ${footerCellStyles}`}
        />
      </div>

      {/* Middle column - spacer */}
      <div className={`flex-grow ${footerCellStyles}`} />

      {/* Right columns - receiving tokens */}
      <div className="flex">
        {allUniqueReceivingTokens.tokenSymbols.map((tokenSymbol, index) => {
          return (
            <div
              className={`flex space-x-2 items-center justify-end ${wideCellStyles} ${footerCellStyles} ${amountCellStyles}`}
              key={index}
            >
              <div>
                {parseFloat(tokenAmountTotals[index]) > 0
                  ? removeTrailingDecimalPoint(
                      numberWithCommas(
                        parseFloat(tokenAmountTotals[index]).toFixed(4)
                      )
                    )
                  : '0'}

                <span className={`text-gray-syn4 ml-1`}>{tokenSymbol}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`relative w-full mb-32 sm:mb-auto ${extraClasses ?? ''}`}>
      {!hideSearch && _membersDetails.length !== 0 && (
        <div
          className={`flex md:mt-10 mt-4.5 mb-8 space-y-6 sm:space-y-0 flex-col sm:flex-row col-span-12 sm:space-x-8 sm:justify-between sm:items-center ${
            isBlurred ? 'opacity-70 filter blur-md' : ''
          }`}
        >
          <SearchInput
            {...{
              onChangeHandler: handleSearchChange,
              searchValue: searchValue || '',
              itemsCount: _membersDetails.length,
              clearSearchValue: clearSearchValue,
              padding: ''
            }}
          />
          {!isEditing ? (
            <div className="flex sm:space-x-8">
              <ActionButton
                label="Edit distribution"
                icon="/images/edit-circle-blue.svg"
                onClick={handleIsEditingChange}
              />
            </div>
          ) : null}
        </div>
      )}

      {searchValue &&
      _membersDetails.filter(
        (member) =>
          member.address.toLowerCase().includes(searchValue.toLowerCase()) ||
          member.ensName.toLowerCase().includes(searchValue.toLowerCase())
      ).length === 0 ? (
        <div className="flex flex-col justify-center">
          <H4 className="text-xl text-center">
            No results for {`"${searchValue}"`}
          </H4>

          <B2 className="text-gray-syn4 text-center">
            Double check the wallet address or try another search
          </B2>
        </div>
      ) : _membersDetails.length ? (
        <div className="overflow-x-auto">
          <div className="mb-2 w-full">{renderedHeader}</div>
          <div className="w-full">{renderedTable}</div>
          {canLoadMore ? <div className="w-full">{renderPagination}</div> : ''}

          <div className="w-full">{renderedFooter}</div>
        </div>
      ) : (
        <div className="flex flex-col justify-center space-y-4 my-11">
          <H4 className="text-xl text-center">
            This club does not have members.
          </H4>

          <B2 className="text-gray-syn4 text-center">
            Distributions can only be made for a club with members.
          </B2>
        </div>
      )}
    </div>
  );
};
