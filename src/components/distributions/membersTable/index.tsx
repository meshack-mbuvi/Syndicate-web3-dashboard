import { Checkbox } from '@/components/inputs/simpleCheckbox';
import { useEffect, useState } from 'react';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';

interface Props {
  clubName?: string;
  membersDetails: {
    memberName: string;
    clubTokenHolding?: number;
    recievingTokens: {
      amount: number;
      tokenSymbol: string;
      tokenIcon: string;
    }[];
  }[];
  activeIndicies: Array<number>;
  handleActiveIndiciesChange: (indecies: number[]) => void;
}

export const DistributionMembersTable: React.FC<Props> = ({
  clubName,
  membersDetails,
  activeIndicies,
  handleActiveIndiciesChange
}) => {
  const isIndexActive = (index: number) => {
    return activeIndicies.includes(index);
  };

  const [hoveredRow, setHoveredRow] = useState(null);

  const normalCellHeight = 'h-16';
  const memberCellStyles = (index) => {
    return `${
      hoveredRow === index && 'bg-gray-syn7'
    } transition-all ease-out ${normalCellHeight} border-gray-syn6 ${
      index === 0 ? 'border-t-0' : 'border-t-1'
    } ${!isIndexActive(index) && 'text-gray-syn5'}`;
  };
  const footerCellStyles = `${normalCellHeight} border-gray-syn6 border-t-1`;
  const wideCellStyles = `w-52 lg:w-60`;
  const narrowCellStyles = `w-12`;
  const headerCellStyles = 'w-52 lg:w-60 pr-1';
  const amountCellStyles = 'font-mono';

  // This iterates through the rows finding all unique
  // tokens to determine the table columns (e.g "Recieving {tokenSymbol}")
  const allUniqueRecievingTokens: {
    tokenSymbols: string[];
    tokenIcons: string[];
  } = membersDetails.reduce(
    (
      columns: { tokenSymbols: [string]; tokenIcons: [string] },
      memberDetails
    ) => {
      const newTokenSymbols = [];
      const newTokenIcons = [];
      memberDetails.recievingTokens.forEach((recievingToken) => {
        const tokenSymbol = recievingToken.tokenSymbol;
        const tokenIcon = recievingToken.tokenIcon;
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
    setTokenAmountTotals(
      allUniqueRecievingTokens.tokenSymbols.map((tokenSymbol) => {
        return membersDetails.reduce((total: number, memberDetails, index) => {
          let memberTotal = 0;
          memberDetails.recievingTokens.forEach((recievingToken) => {
            if (
              recievingToken.tokenSymbol === tokenSymbol &&
              isIndexActive(index)
            ) {
              memberTotal += recievingToken.amount;
            }
          });
          return total + memberTotal;
        }, 0);
      })
    );
  }, [activeIndicies]);

  // The top row with column titles
  const renderedHeader = (
    <div className="flex text-sm text-gray-syn4">
      {/* Left columns - member, share */}
      <div className="flex">
        {/* Checkbox */}
        <div className={`flex items-center ${narrowCellStyles}`}>
          <Checkbox
            isActive={
              activeIndicies.length <= membersDetails.length &&
              activeIndicies.length > 0
            }
            usePartialCheck={activeIndicies.length < membersDetails.length}
            onChange={() => {
              if (
                activeIndicies.length <= membersDetails.length &&
                activeIndicies.length > 0
              ) {
                handleActiveIndiciesChange([]);
              } else {
                handleActiveIndiciesChange([
                  ...Array(membersDetails.length).keys()
                ]);
              }
            }}
            extraClasses="mx-auto"
          />
        </div>

        {/* Members */}
        <div className={`flex items-center ${headerCellStyles}`}>
          Members ({membersDetails.length})
        </div>

        {/* Distribution share */}
        <div className={`flex items-center ${headerCellStyles}`}>
          Distribution share
        </div>
      </div>

      {/* Middle column - spacer */}
      <div className="flex-grow" />

      {/* Right columns - recieving tokens */}
      <div className="flex">
        {allUniqueRecievingTokens.tokenSymbols.map((tokenSymbol, index) => {
          return (
            <>
              <div
                className={`flex space-x-2 items-center text-right justify-end ${headerCellStyles}`}
              >
                <div>Recieving</div>
                <img
                  className="w-6 h-6"
                  src={allUniqueRecievingTokens.tokenIcons[index]}
                  alt=""
                />
                <div>{tokenSymbol}</div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );

  // The rows with individiaul member distribution data
  const renderedTable = membersDetails.map((memberDetails, rowIndex) => {
    return (
      <button
        onClick={() => {
          // The index was active so make it inactive
          if (isIndexActive(rowIndex)) {
            let newactiveIndices;
            const indexToRemove = activeIndicies.indexOf(rowIndex);
            if (indexToRemove > -1) {
              const arrayWithoutIndex = (array, index) =>
                array.filter((_, i) => i !== index);
              newactiveIndices = arrayWithoutIndex(
                activeIndicies,
                indexToRemove
              );
              handleActiveIndiciesChange(newactiveIndices);
            }
          }

          // The index was inactive so make it active
          else {
            handleActiveIndiciesChange([...activeIndicies, rowIndex]);
          }
        }}
        onMouseOver={() => {
          setHoveredRow(rowIndex);
        }}
        onFocus={() => {
          setHoveredRow(rowIndex);
        }}
        onMouseLeave={() => {
          setHoveredRow(null);
        }}
        className={`w-full block flex justify-between cursor-pointer transition-all ease-out`}
        key={rowIndex}
      >
        {/* Left columns - member, share */}
        <div className="flex">
          {/* Checkbox */}
          <div
            className={`flex items-center ${narrowCellStyles} ${memberCellStyles(
              rowIndex
            )} {cellBorderStyles(rowIndex)}`}
          >
            <Checkbox
              isActive={isIndexActive(rowIndex)}
              extraClasses="mx-auto"
            />
          </div>

          {/* Member name */}
          <div
            className={`flex items-center space-x-4 ${wideCellStyles} ${memberCellStyles(
              rowIndex
            )}`}
          >
            <svg
              className={`${!isIndexActive(rowIndex) && 'opacity-50'}`}
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z"
                fill="#3F4147"
              />
              <path
                d="M16.0048 15.7597C18.0392 15.7597 19.8075 14.0512 19.8075 11.8265C19.8075 9.62848 18.0392 8 16.0048 8C13.9703 8 12.202 9.66407 12.202 11.8443C12.202 14.0512 13.9608 15.7597 16.0048 15.7597ZM10.025 24H21.9655C23.4676 24 24 23.5996 24 22.8165C24 20.5206 20.9293 17.3526 15.9952 17.3526C11.0707 17.3526 8 20.5206 8 22.8165C8 23.5996 8.53238 24 10.025 24Z"
                fill="#90949E"
              />
            </svg>
            <div>{memberDetails.memberName}</div>
          </div>

          {/* Share of holdings */}
          <div
            className={`flex space-x-3 items-center font-mono ${wideCellStyles} ${memberCellStyles(
              rowIndex
            )}`}
          >
            {/* Percentage */}
            <div>
              {isIndexActive(rowIndex)
                ? `${Math.trunc((1 / activeIndicies.length) * 100)}%`
                : '0%'}
            </div>

            {/* Token holding */}
            <div
              className={`${
                isIndexActive(rowIndex) ? 'text-gray-syn4' : 'text-gray-syn5'
              } ${
                !clubName || !memberDetails.clubTokenHolding
                  ? 'hidden'
                  : 'visible'
              }`}
            >
              {floatedNumberWithCommas(memberDetails.clubTokenHolding)}
              {' ✺'}
              {clubName}
            </div>
          </div>
        </div>

        {/* Middle column - spacer */}
        {/* This is needed to continue the borders and hover effect */}
        <div className={`flex-grow h-16 ${memberCellStyles(rowIndex)}`} />

        {/* Right columns - recieving tokens */}
        <div className={`flex`}>
          {/* Each column represents a different token a member is recieving */}
          {allUniqueRecievingTokens.tokenSymbols.map((tokenSymbol, index) => {
            return (
              // Individual column
              <div
                className={`flex space-x-1 items-center justify-end ${wideCellStyles} ${memberCellStyles(
                  rowIndex
                )} ${amountCellStyles}`}
                key={index}
              >
                <div>
                  {memberDetails.recievingTokens.find((recievingToken) => {
                    return recievingToken.tokenSymbol === tokenSymbol;
                  }) && isIndexActive(rowIndex)
                    ? memberDetails.recievingTokens.find((recievingToken) => {
                        return recievingToken.tokenSymbol === tokenSymbol;
                      }).amount
                    : 0}
                </div>
                <div
                  className={`${
                    !isIndexActive(rowIndex)
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
          className={`flex items-center whitespace-nowrap ${narrowCellStyles} ${footerCellStyles}`}
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

      {/* Right columns - recieving tokens */}
      <div className="flex">
        {allUniqueRecievingTokens.tokenSymbols.map((tokenSymbol, index) => {
          return (
            <>
              <div
                className={`flex space-x-2 items-center justify-end ${wideCellStyles} ${footerCellStyles} ${amountCellStyles}`}
              >
                <div>
                  {tokenAmountTotals[index]}{' '}
                  <span className={`text-gray-syn4`}>{tokenSymbol}</span>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative overflow-scroll no-scroll-bar w-full">
      <div className="mb-2 w-full">{renderedHeader}</div>
      <div className="w-full">{renderedTable}</div>
      <div className="w-full">{renderedFooter}</div>
    </div>
  );
};
