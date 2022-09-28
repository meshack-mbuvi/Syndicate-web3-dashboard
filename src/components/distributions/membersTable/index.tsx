import { ActionButton } from '@/components/actionButton';
import { SearchInput } from '@/components/inputs';
import { Checkbox } from '@/components/inputs/simpleCheckbox';
import {
  AddressImageSize,
  AddressWithENS
} from '@/components/shared/ensAddress';
import { B2, H4 } from '@/components/typography';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  membersDetails: {
    ensName: string;
    address: string;
    clubTokenHolding?: number;
    distributionShare: number;
    ownershipShare: number;
    selected: boolean;
    receivingTokens: {
      amount: number;
      tokenSymbol: string;
      tokenIcon: string;
    }[];
  }[];
  tokens: { tokenAmount: string; symbol: string; icon: string }[];
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
  ethersProvider
}) => {
  const isAddressActive = (address: string) => {
    return activeAddresses.includes(address);
  };

  const dataLimit = 10;

  const [hoveredRow, setHoveredRow] = useState(null);
  const [_membersDetails, setMemberDetails] = useState<
    {
      ensName: string;
      address: string;
      clubTokenHolding?: number;
      distributionShare: number;
      ownershipShare: number;
      selected: boolean;
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

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const [loadMoreText, setLoadMoreText] = useState(dataLimit);

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
        .map(({ ownershipShare, ...rest }) => {
          return {
            ...rest,
            ownershipShare,
            distributionShare:
              (+ownershipShare * 100) / cumulativeActiveMemberOwnership,
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
        });

      setMemberDetails(memberDetails);
    } else {
      setMemberDetails([]);
    }

    return () => {
      setMemberDetails([]);
    };
  }, [activeAddresses]);

  const normalCellHeight = 'h-16';
  const memberCellStyles = (address: any) => {
    return `${
      hoveredRow === address && 'bg-gray-syn7'
    } transition-all ease-out ${normalCellHeight} border-gray-syn6 ${
      address === _membersDetails[0].address ? 'border-t-0' : 'border-t-1'
    } ${!isAddressActive(address) && 'text-gray-syn5'}`;
  };
  const footerCellStyles = `${normalCellHeight} border-gray-syn6 border-t-1`;
  const wideCellStyles = `w-60 xl:w-72`;
  const narrowCellStyles = `w-12`;
  const headerCellStyles = 'w-60 xl:w-72';
  const amountCellStyles = 'font-mono';

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
      <div className="flex">
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

        {/* Distribution share */}
        <div className={`flex items-center ${headerCellStyles}`}>
          Distribution share
        </div>
      </div>

      {/* Middle column - spacer */}
      <div className="flex-grow" />

      {/* Right columns - receiving tokens */}
      <div className="flex">
        {allUniqueReceivingTokens.tokenSymbols.map((tokenSymbol, index) => {
          return (
            <div
              key={index}
              className={`flex space-x-2 items-center text-right justify-end ${headerCellStyles}`}
            >
              <div>Receiving</div>
              <img
                className="w-6 h-6"
                src={allUniqueReceivingTokens.tokenIcons[index]}
                alt=""
              />
              <div>{tokenSymbol}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPagination = (
    <div
      className={`flex justify-center w-full border-t-1 text-blue whitespace-nowrap ${narrowCellStyles} ${footerCellStyles}`}
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
        onClick={() => {
          if (!isEditing) return;
          // The index was active so make it inactive
          if (isAddressActive(memberDetails.address)) {
            let newactiveIndices;
            const indexToRemove = activeAddresses.indexOf(
              memberDetails.address
            );
            if (indexToRemove > -1) {
              const arrayWithoutIndex = (array: any, index: any) =>
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
        } transition-all ease-out`}
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
            className={`flex items-center space-x-4 ${wideCellStyles} ${memberCellStyles(
              memberDetails.address
            )} ${!isAddressActive(memberDetails.address) && 'opacity-50'}`}
          >
            <AddressWithENS
              ethersProvider={ethersProvider}
              userPlaceholderImg={'/images/user.svg'}
              address={memberDetails.address}
              imageSize={AddressImageSize.LARGE}
            />
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
                ? parseFloat(`${memberDetails.distributionShare}`).toFixed(2)
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
          {allUniqueReceivingTokens.tokenSymbols.map((tokenSymbol, index) => {
            return (
              // Individual column
              <div
                className={`flex space-x-1 items-center justify-end pl-6 lg:pl-10 xl:pl-20 ${wideCellStyles} ${memberCellStyles(
                  memberDetails.address
                )} ${amountCellStyles}`}
                key={index}
              >
                <div className="text-right truncate w-full">
                  {memberDetails.receivingTokens.find((receivingToken) => {
                    return receivingToken.tokenSymbol === tokenSymbol;
                  }) && isAddressActive(memberDetails.address)
                    ? floatedNumberWithCommas(
                        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                        memberDetails.receivingTokens?.find(
                          (receivingToken) => {
                            return receivingToken.tokenSymbol === tokenSymbol;
                          }
                        ).amount
                      )
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
    <div className="flex">
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
                {floatedNumberWithCommas(tokenAmountTotals[index])}{' '}
                <span className={`text-gray-syn4`}>{tokenSymbol}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className={`relative overflow-x-auto w-full mb-32 sm:mb-auto ${
        extraClasses ?? ''
      }`}
    >
      {!hideSearch && _membersDetails.length !== 0 && (
        <div className="flex md:mt-10 mt-4.5 mb-8 space-y-6 sm:space-y-0 flex-col sm:flex-row col-span-12 sm:space-x-8 sm:justify-between sm:items-center">
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
        <>
          <div className="mb-2 w-full">{renderedHeader}</div>
          <div className="w-full">{renderedTable}</div>
          {canLoadMore ? <div className="w-full">{renderPagination}</div> : ''}

          <div className="w-full">{renderedFooter}</div>
        </>
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
