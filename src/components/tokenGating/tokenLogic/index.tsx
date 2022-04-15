import { InputField } from '@/components/inputs/inputField';
import {
  floatedNumberWithCommas,
  numberInputRemoveCommas
} from '@/utils/formattedNumbers';
import React from 'react';

export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR'
}

interface Props {
  tokenRules: {
    name: string;
    symbol?: string;
    quantity: number;
    icon: string;
  }[];
  logicalOperator?: LogicalOperator;
  isInErrorState?: boolean;
  helperText?: string;
  handleTokenSelection: () => void;
  handleLogicalOperatorChange: (operator: LogicalOperator) => void;
  handleRulesChange: (rules) => void;
  customClasses?: string;
}

export const TokenLogicList: React.FC<Props> = ({
  tokenRules,
  logicalOperator = LogicalOperator.OR,
  isInErrorState,
  helperText,
  handleTokenSelection,
  handleLogicalOperatorChange,
  handleRulesChange,
  customClasses
}) => {
  function removeArrayElement(array: Array<any>, indexToRemove: number) {
    const newArray = array.filter(function (value, currentIndex) {
      return indexToRemove !== currentIndex;
    });
    return newArray;
  }

  const renderedTokenOptions = tokenRules.map((rule, index) => (
    <>
      {/* And / Or switch */}
      {index === 1 && (
        <div className="border-none relative">
          <div className="flex items-center inline w-32 border border-gray-syn6 bg-black absolute left-6 text-sm rounded-full transform -translate-y-1/2">
            <button
              className={`${
                logicalOperator === LogicalOperator.AND
                  ? 'text-black'
                  : 'text-gray-syn3'
              } transition-all relative z-10 w-1/2 text-center py-2.5`}
              onClick={() => {
                handleLogicalOperatorChange(LogicalOperator.AND);
              }}
            >
              and
            </button>
            <button
              className={`${
                logicalOperator === LogicalOperator.OR
                  ? 'text-black'
                  : 'text-gray-syn3'
              } transition-all relative z-10 w-1/2 text-center py-2.5`}
              onClick={() => {
                handleLogicalOperatorChange(LogicalOperator.OR);
              }}
            >
              or
            </button>
            <div
              className={`${
                logicalOperator === LogicalOperator.AND ? 'left-0' : 'left-1/2'
              } absolute z-0 top-0 h-full w-1/2 border-2 border-black bg-white rounded-full transition-all ease-out transition-500`}
            ></div>
          </div>
        </div>
      )}

      {/* Or */}
      {index > 1 && (
        <div className="border-none">
          <div className="flex space-x-3 inline py-2.5 px-5 border border-gray-syn6 bg-black absolute left-6 text-sm text-gray-syn3 rounded-full transform -translate-y-1/2">
            <div>or</div>
          </div>
        </div>
      )}

      <div className="p-6 border-gray-syn6 flex items-center h-25">
        {/* Quantity */}
        <div className="w-4/12">
          <div>
            <InputField
              value={String(floatedNumberWithCommas(rule.quantity))}
              onChange={(e) => {
                // Prevent numbers with more than 10 digits
                // e.g max 1,000,000,000
                let input = numberInputRemoveCommas(e);
                if (input.length > 10) {
                  input = input.substring(0, 10);
                }
                const quantity = Number(input);

                // Modify the current token rule with user input
                handleRulesChange([
                  ...tokenRules.slice(0, index),
                  {
                    name: rule.name,
                    symbol: rule.symbol,
                    quantity: quantity,
                    icon: rule.icon
                  },
                  ...tokenRules.slice(index + 1)
                ]);
              }}
              stylingOverride="pl-0 p-4 rounded-md focus:ring-0 text-white"
              extraClasses={`border-none p-0 text-${
                String(rule.quantity).length > 7 &&
                String(rule.quantity).length < 12
                  ? ['1.75xl', '1.5xl', '1.25xl', 'xl'][
                      String(rule.quantity).length - 7
                    ]
                  : String(rule.quantity).length >= 12
                  ? 'xl'
                  : '2xl'
              }`}
            />
          </div>
        </div>

        {/* Token name / button */}
        <button
          className="w-8/12 relative flex-grow flex space-x-3 items-center"
          onClick={handleTokenSelection}
        >
          {/* Icon */}
          {!rule.name ? (
            // Plus icon
            <div
              className={`flex-shrink-0 rounded-full h-10 w-10 ${
                isInErrorState ? 'border-red-error' : 'border-gray-syn4'
              } transition-all border border-dashed`}
            >
              <img
                src={`/images/plus-${isInErrorState ? 'red' : 'gray'}.svg`}
                alt="Add"
                className="w-4 h-4 mx-auto vertically-center transition-all"
              />
            </div>
          ) : (
            // Token icon
            <div className="flex-shrink-0 rounded-full h-10 w-10 bg-gray-syn7 overflow-hidden">
              {rule.icon && (
                <img
                  src={rule.icon}
                  alt="Token Icon"
                  className="w-full h-full mx-auto vertically-center"
                />
              )}
            </div>
          )}

          {/* Name */}
          <div
            className={`${
              rule.name
                ? 'text-white'
                : isInErrorState
                ? 'text-red-error'
                : 'text-gray-syn4'
            } text-left line-clamp-3 transition-all`}
          >
            {rule.name ? rule.name : 'Select NFT or token'}
            <span className="text-gray-syn4 ml-2">{rule.symbol}</span>
          </div>
        </button>

        {/* Remove button */}
        <div className="w-4 ml-4 flex-shrink-0 flex items-center">
          <button
            className={`${
              tokenRules.length <= 1 && 'hidden'
            } hover:bg-gray-syn8 transition-all ease-out p-3 -m-3 rounded-full`}
            onClick={() => {
              // Remove current rule
              handleRulesChange(removeArrayElement(tokenRules, index));
            }}
          >
            <img
              src={`/images/xmark-${
                isInErrorState && !rule.name ? 'red' : 'gray'
              }.svg`}
              alt="Close"
              className="w-4 h-4"
            />
          </button>
        </div>
      </div>
    </>
  ));

  return (
    <div className="space-y-2">
      <div
        className={`relative border border-gray-syn6 divide-y rounded-custom overflow-hidden ${customClasses}`}
      >
        {renderedTokenOptions}
      </div>
      {helperText && (
        <div
          className={`text-sm ${
            isInErrorState ? 'text-red-error' : 'text-gray-syn4'
          } transition-all`}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};