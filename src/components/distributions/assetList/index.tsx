import React, { useState } from 'react';
import { PillButton } from '@/components/pillButtons';
import { InputField } from '@/components/inputs/inputField';
import { Checkbox } from '@/components/inputs/simpleCheckbox';
import {
  floatedNumberWithCommas,
  stringNumberRemoveCommas
} from '@/utils/formattedNumbers';
import { SkeletonLoader } from '@/components/skeletonLoader';

interface Props {
  options: {
    icon: string;
    name?: string;
    symbol?: string;
    tokenAmount?: number;
    fiatAmount?: number;
    isEditingInFiat?: boolean;
    error?: string;
    warning?: string;
    isLoading?: boolean;
  }[];
  activeIndices: number[];
  handleOptionsChange: (
    options: {
      icon: string;
      name?: string;
      symbol?: string;
      tokenAmount?: number;
      fiatAmount?: number;
      isEditingInFiat?: boolean;
      error?: string;
      warning?: string;
      isLoading?: boolean;
    }[]
  ) => void;
  handleactiveIndicesChange: (indecies: number[]) => void;
  handleMaxOnClick: (index: number) => void;
}

export const AssetList: React.FC<Props> = ({
  options,
  activeIndices,
  handleOptionsChange,
  handleactiveIndicesChange,
  handleMaxOnClick
}) => {
  // Using this to temporarily store the input allows the user to input periods for decimal numbers.
  // Instead of stripping the character off onChange when converting the string to a number, e.g Number("3.") -> 3
  // which prevents the user from typing a period.
  const [temporaryInputFieldValues, setTemporaryInputFieldValues] = useState(
    Array(options.length).fill({
      tokenAmount: null,
      fiatAmount: null
    })
  );

  // This returns true if the inputted string is a valid number with a period at the end
  const isStringIncompleteDecimalNumber = (strNumber) => {
    return (
      !isNaN(Number(strNumber) && strNumber.includes('.')) &&
      strNumber[strNumber.length - 1] === '.'
    );
  };

  const isIndexActive = (index: number) => {
    return activeIndices.includes(index);
  };

  const dynamicInputFieldStyles = (index) => {
    return `${
      isIndexActive(index) ? 'text-5.75xl sm:text-2xl leading-6' : 'text-base'
    } transition-transform duration-300`;
  };

  const renderedOptions = options.map((option, index) => (
    <>
      <button
        onClick={() => {
          // The index was active so make it inactive
          if (isIndexActive(index)) {
            let newactiveIndices;
            const indexToRemove = activeIndices.indexOf(index);
            if (indexToRemove > -1) {
              const arrayWithoutIndex = (array, index) =>
                array.filter((_, i) => i !== index);
              newactiveIndices = arrayWithoutIndex(
                activeIndices,
                indexToRemove
              );
              handleactiveIndicesChange(newactiveIndices);
            }
          }

          // The index was inactive so make it active
          else {
            handleactiveIndicesChange([...activeIndices, index]);
          }
        }}
        className={`w-full min-w-112 flex justify-between items-center space-x-3 ${
          activeIndices.includes(index)
            ? 'py-5 bg-gray-syn8 hover:bg-gray-syn8 my-2'
            : 'py-3 hover:bg-gray-syn9'
        } transition-all px-6 cursor-pointer rounded-custom`}
      >
        {/* Name + info */}
        <div className="flex-shrink-0 flex space-x-6 items items-center">
          <Checkbox isActive={isIndexActive(index)} />
          <div className="flex items-center">
            <div className="mr-4 flex-shrink-0">
              <img
                src={option.icon ? option.icon : '/images/token-gray.svg'}
                alt="Token icon"
                className="w-8 h-8"
              />
            </div>
            {option.isLoading ? (
              <SkeletonLoader height="6" width="40" borderRadius="rounded-md" />
            ) : (
              <>
                <div className="mr-2">{option.name}</div>
                <div className="text-gray-syn4 flex-shrink-0">
                  {option.symbol}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="text-rigåht">
          <div className="flex items-center space-x-2">
            {/* Max button */}
            {!option.isLoading && (
              <PillButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleMaxOnClick(index);
                }}
                extraClasses={`${
                  isIndexActive(index) ? 'ml-2 hidden sm:block' : 'hidden'
                }`}
              >
                Max
              </PillButton>
            )}

            <div>
              {/* Top row */}
              {option.isLoading ? (
                <SkeletonLoader
                  height={isIndexActive(index) ? '8' : '6'}
                  width="40"
                  borderRadius="rounded-md"
                  customClass="transition-all"
                />
              ) : (
                <div className="flex items-center justify-end space-x-1.5">
                  {/* Amount */}
                  <div
                    className={`${dynamicInputFieldStyles(index)}`}
                    style={{
                      width: `${
                        option.isEditingInFiat
                          ? String(option.fiatAmount).length
                          : String(option.tokenAmount).length * 1
                      }ch`
                    }}
                  >
                    <InputField
                      value={
                        // Check if we have a temporary input field value to use (for incomplete decimals), otherwise use
                        // the appropriate amount
                        !option.isEditingInFiat
                          ? temporaryInputFieldValues[index].tokenAmount
                            ? temporaryInputFieldValues[index].tokenAmount
                            : option.tokenAmount.toLocaleString(undefined, {
                                maximumFractionDigits: 10
                              })
                          : temporaryInputFieldValues[index].fiatAmount
                          ? temporaryInputFieldValues[index].fiatAmount
                          : option.fiatAmount.toLocaleString(undefined, {
                              maximumFractionDigits: 10
                            })
                      }
                      onClick={(e) => {
                        // This stops the row from toggling active/unactive
                        e.stopPropagation();
                      }}
                      onChange={(e) => {
                        const input = e.target.value;
                        const strNumber = stringNumberRemoveCommas(input);

                        // Check if the user is typing a "." for a decimal
                        if (isStringIncompleteDecimalNumber(strNumber)) {
                          // Use temporary input field values to wait for the user to type a complete decimal number.
                          // Before returning new options to handleOptionsChange.
                          setTemporaryInputFieldValues([
                            ...temporaryInputFieldValues.slice(0, index),
                            {
                              tokenAmount: !option.isEditingInFiat
                                ? input
                                : temporaryInputFieldValues[index].tokenAmount,
                              fiatAmount: option.isEditingInFiat
                                ? input
                                : temporaryInputFieldValues[index].fiatAmount
                            },
                            ...temporaryInputFieldValues.slice(index + 1)
                          ]);
                        }

                        // Update the options
                        else {
                          const strAmount = stringNumberRemoveCommas(
                            e.target.value
                          );

                          handleOptionsChange([
                            ...options.slice(0, index),
                            {
                              icon: option.icon,
                              name: option.name,
                              symbol: option.symbol,
                              tokenAmount: !option.isEditingInFiat
                                ? Number(strAmount)
                                  ? Number(strAmount)
                                  : 0
                                : option.tokenAmount,
                              fiatAmount: option.isEditingInFiat
                                ? Number(strAmount)
                                  ? Number(strAmount)
                                  : 0
                                : option.fiatAmount,
                              isEditingInFiat: option.isEditingInFiat,
                              error: option.error,
                              warning: option.warning,
                              isLoading: option.isLoading
                            },
                            ...options.slice(index + 1)
                          ]);

                          // Clear temporary input field values
                          setTemporaryInputFieldValues([
                            ...temporaryInputFieldValues.slice(0, index),
                            {
                              tokenAmount: null,
                              fiatAmount: null
                            },
                            ...temporaryInputFieldValues.slice(index + 1)
                          ]);
                        }
                      }}
                      classesOverride={`py-1 px-0 rounded-md focus:ring-0 ${dynamicInputFieldStyles(
                        index
                      )} ${
                        option.error && isIndexActive(index)
                          ? 'text-red-error'
                          : 'text-white'
                      } transition-all`}
                      extraClasses={`border-none bg-transparent p-0 text-right`}
                    />
                  </div>

                  {/* Symbol */}
                  <div
                    className={`${
                      isIndexActive(index) ? 'text-gray-syn4 h2' : 'text-white'
                    } transition-all duration-300`}
                  >
                    {!option.isEditingInFiat ? option.symbol : 'USD'}
                  </div>
                </div>
              )}

              {/* Bottom row */}
              {option.isLoading ? (
                <SkeletonLoader
                  height="4"
                  width="40"
                  borderRadius="rounded-md"
                />
              ) : (
                <div
                  className={`flex text-sm text-gray-syn4 justify-end transition-all text-right ${
                    option.error && isIndexActive(index)
                      ? 'text-red-error'
                      : option.warning &&
                        isIndexActive(index) &&
                        'text-yellow-warning'
                  }`}
                >
                  {(option.error || option.warning) && isIndexActive(index) ? (
                    <div>
                      {option.error
                        ? option.error
                        : option.warning && option.warning}
                    </div>
                  ) : (
                    <>
                      <div>
                        {option.isEditingInFiat
                          ? `${floatedNumberWithCommas(
                              String(option.tokenAmount)
                            )} ${option.symbol}`
                          : `${floatedNumberWithCommas(
                              String(option.fiatAmount)
                            )} USD`}
                      </div>
                      <button
                        onClick={(e) => {
                          // This stops the row from toggling active/unactive
                          e.stopPropagation();

                          handleOptionsChange([
                            ...options.slice(0, index),
                            {
                              icon: option.icon,
                              name: option.name,
                              symbol: option.symbol,
                              tokenAmount: option.tokenAmount,
                              fiatAmount: option.fiatAmount,
                              isEditingInFiat: !option.isEditingInFiat,
                              error: option.error,
                              warning: option.warning,
                              isLoading: option.isLoading
                            },
                            ...options.slice(index + 1)
                          ]);
                        }}
                      >
                        <svg
                          className={`${
                            isIndexActive(index) ? 'visible' : 'hidden'
                          } ml-2 fill-current hover:text-white transition-all`}
                          width="16"
                          height="14"
                          viewBox="0 0 16 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M3.60373 13.2667C3.86791 13.5445 4.2608 13.5309 4.51143 13.2667L7.92549 9.77815C8.04742 9.65622 8.12193 9.4801 8.12193 9.33107C8.12193 8.97206 7.8713 8.72819 7.51905 8.72819C7.3497 8.72819 7.21423 8.78916 7.09907 8.90432L5.69009 10.3607L4.59949 11.6207L4.66723 10.0559L4.66723 1.00593C4.66723 0.653681 4.4166 0.403047 4.05758 0.403047C3.70533 0.403047 3.4547 0.653681 3.4547 1.00593L3.4547 10.0559L3.51566 11.6207L2.43184 10.3607L1.01609 8.90432C0.900931 8.78916 0.772227 8.72819 0.596105 8.72819C0.243861 8.72819 0 8.97206 0 9.33107C0 9.4801 0.0677392 9.65622 0.18967 9.77815L3.60373 13.2667ZM12.3963 0.59949C12.1321 0.328533 11.7392 0.335307 11.4818 0.59949L8.06774 4.08806C7.95258 4.20999 7.87807 4.38611 7.87807 4.54191C7.87807 4.90093 8.12193 5.13802 8.47417 5.13802C8.6503 5.13802 8.78577 5.08383 8.89416 4.96867L10.3099 3.5055L11.4005 2.24555L11.3328 3.81033V12.8603C11.3328 13.2125 11.5834 13.4699 11.9356 13.4699C12.2947 13.4699 12.5453 13.2125 12.5453 12.8603V3.81033L12.4776 2.24555L13.5682 3.5055L14.9771 4.96867C15.0923 5.08383 15.2278 5.13802 15.4039 5.13802C15.7561 5.13802 16 4.90093 16 4.54191C16 4.38611 15.9255 4.20999 15.8103 4.08806L12.3963 0.59949Z" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </button>
    </>
  ));

  return <div className="">{renderedOptions}</div>;
};
