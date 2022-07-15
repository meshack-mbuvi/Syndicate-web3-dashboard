import { InputField } from '@/components/inputs/inputField';
import { Checkbox } from '@/components/inputs/simpleCheckbox';
import { PillButton } from '@/components/pillButtons';
import { SkeletonLoader } from '@/components/skeletonLoader';
import { useTailwindScreenWidth } from '@/helpers/layout';
import useWindowSize from '@/hooks/useWindowSize';
import {
  floatedNumberWithCommas,
  numberWithCommas,
  stringNumberRemoveCommas
} from '@/utils/formattedNumbers';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  options: {
    icon: string;
    name?: string;
    symbol?: string;
    price?: number;
    tokenAmount?: number;
    fiatAmount?: number;
    maximumTokenAmount?: number;
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
      maximumTokenAmount?: number;
      price?: number;
    }[]
  ) => void;
  handleActiveIndicesChange: (indices: number[]) => void;
}

export const AssetList: React.FC<Props> = ({
  options,
  activeIndices,
  handleOptionsChange,
  handleActiveIndicesChange
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

  const dynamicInputFieldStyles = (index, amount) => {
    const minimumDesktopSize = 'md';

    // Calculates both mobile and desktop font sizes
    const calculatedDesktopFontSize = `${minimumDesktopSize}:text-${
      String(amount).length > 7 && String(amount).length < 15
        ? ['1.75xl', '1.5xl', '1.25xl', 'xl', 'lg', 'base', 'base'][
            String(amount).length - 8
          ]
        : String(amount).length >= 15
        ? 'base'
        : '2xl'
    }`;
    const calculatedMobileFontSize = `text-${
      String(amount).length > 7 && String(amount).length < 15
        ? ['lg', 'base', 'sm', 'sm', 'sm', 'sm', 'sm'][
            String(amount).length - 8
          ]
        : String(amount).length >= 15
        ? 'sm'
        : 'sm'
    }`;

    return `transition-font-size duration-300 ${
      isIndexActive(index)
        ? `${calculatedDesktopFontSize} ${calculatedMobileFontSize}`
        : `text-sm sm:text-base`
    }`;
  };

  const windowWidth = useWindowSize().width;
  const tailwindScreenWidthMd = useTailwindScreenWidth('xl').width;

  /**
   * Sets the input field value to the maximum value.
   *
   * @param index The index of the option that is being edited
   */
  const handleMaxOnClick = (index: number) => {
    const { price, maximumTokenAmount } = options[index];

    const tokenAmount = maximumTokenAmount;
    const _fiatAmount =
      parseFloat(`${maximumTokenAmount}`) * parseFloat(`${price}`);

    handleOptionsChange([
      ...options.slice(0, index),
      {
        ...options[index],
        tokenAmount,
        fiatAmount: _fiatAmount
      },
      ...options.slice(index + 1)
    ]);
  };

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, options.length);
  }, [options]);

  const handleOnClick = (index: number) => {
    // The index was active so make it inactive
    if (isIndexActive(index)) {
      let newActiveIndices;
      const indexToRemove = activeIndices.indexOf(index);
      if (indexToRemove > -1) {
        const arrayWithoutIndex = (array, index) =>
          array.filter((_, i) => i !== index);
        newActiveIndices = arrayWithoutIndex(activeIndices, indexToRemove);

        handleActiveIndicesChange(newActiveIndices);
      }
    }

    // The index was inactive so make it active
    else {
      handleActiveIndicesChange([...activeIndices, index]);
      setTimeout(() => {
        inputRefs.current[index].focus();
      }, 300);
    }
  };

  const renderedOptions = options.map((option, index) => (
    <button
      className={`w-full md:min-w-112 text-sm sm:text-base flex items-center justify-between md:space-x-3 ${
        activeIndices.includes(index)
          ? 'py-5 bg-gray-syn8 hover:bg-gray-syn8 my-2 cursor-text'
          : 'py-3 hover:bg-gray-syn9 cursor-pointer'
      } transition-all px-3 sm:px-4 md:px-6 rounded-custom`}
      key={index}
      onClick={() => {
        // click target is the button when checkbox is unchecked
        if (!isIndexActive(index)) {
          handleOnClick(index);
        }
      }}
    >
      {/* Left column */}
      <div
        className="flex space-x-4 md:space-x-4 items items-center w-full max-w-6/12"
        onClick={() => {
          if (isIndexActive(index)) {
            handleOnClick(index);
          }
        }}
        onKeyPress={() => {
          // This div becomes click target when checkbox is checked
          if (isIndexActive(index)) {
            handleOnClick(index);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <Checkbox
          isActive={isIndexActive(index)}
          extraClasses="flex-shrink-0"
        />
        <img
          src={option.icon ? option.icon : '/images/token-gray.svg'}
          alt="Token icon"
          className="w-7 h-7 md:w-8 md:h-8 transition-all flex-shrink-0"
        />
        {/* Name */}
        <div className="text-left flex-grow overflow-hidden md:overflow-visible">
          <div className="block whitespace-nowrap md:whitespace-normal md:inline truncate">
            {option.name}
          </div>
          <div className="block whitespace-nowrap md:whitespace-normal md:inline truncate md:ml-2 text-gray-syn4 md:font-light">
            {option.symbol}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="text-right flex ml-7 md:ml-0 border-gray-syn7">
        <div className="flex items-center md:space-x-2">
          {/* Max button */}
          {!option.isLoading && (
            <div
              className={`${
                isIndexActive(index) ? 'scale-100 max-w-20' : 'scale-0 max-w-0'
              } hidden xl:block transition-all transform duration-300`}
            >
              <PillButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleMaxOnClick(index);
                }}
                extraClasses={`${
                  isIndexActive(index)
                    ? 'ml-2 transition-all duration-300 opacity-0 md:opacity-100'
                    : 'opacity-0'
                }`}
              >
                Max
              </PillButton>
            </div>
          )}

          <div className="relative md:-top-1">
            {/* Primary amount row */}
            {option.isLoading ? (
              <>
                <SkeletonLoader
                  height={isIndexActive(index) ? '8' : '6'}
                  width="40"
                  borderRadius="rounded-md"
                  customClass="transition-all hidden sm:block"
                />
                <SkeletonLoader
                  height={isIndexActive(index) ? '8' : '6'}
                  width="16"
                  borderRadius="rounded-md"
                  customClass="transition-all sm:hidden"
                />
              </>
            ) : (
              <div className="flex items-center justify-end space-x-1.5">
                {/* Amount */}
                <div
                  className={`${dynamicInputFieldStyles(
                    index,
                    String(
                      option.isEditingInFiat
                        ? option.fiatAmount
                        : option.tokenAmount
                    )
                  )}`}
                  style={{
                    width: `${
                      windowWidth > tailwindScreenWidthMd
                        ? `${
                            option.isEditingInFiat
                              ? String(option.fiatAmount).length
                              : String(option.tokenAmount).length
                          }ch`
                        : `auto`
                    }`,
                    maxWidth: '25ch'
                  }}
                >
                  <InputField
                    ref={(el) => (inputRefs.current[index] = el)}
                    disabled={!isIndexActive(index)}
                    value={
                      // Check if we have a temporary input field value to use (for incomplete decimals), otherwise use
                      // the appropriate amount
                      numberWithCommas(
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
                      )
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

                        let fiatAmount = option.fiatAmount;
                        let tokenAmount = option.tokenAmount;

                        /**
                         * Whether editing in fiat or not, both amounts
                         * needs to be updated since they refer to the same.
                         */
                        if (option.isEditingInFiat) {
                          fiatAmount = strAmount ? strAmount : 0;
                          tokenAmount =
                            parseFloat(strAmount) /
                            parseFloat(`${option.price}`);
                        } else {
                          tokenAmount = strAmount ? strAmount : 0;
                          fiatAmount =
                            parseFloat(strAmount) *
                            parseFloat(`${option.price}`);
                        }

                        let error = option.error;
                        // Check if the user is trying to send more than the maximum amount
                        if (
                          parseFloat(`${tokenAmount}`) >
                          parseFloat(`${option.maximumTokenAmount}`)
                        ) {
                          error = 'Exceeds amount available for distribution';
                        } else {
                          error = '';
                        }

                        handleOptionsChange([
                          ...options.slice(0, index),
                          {
                            ...option,
                            fiatAmount,
                            tokenAmount,
                            error:
                              tokenAmount === 0
                                ? 'Enter valid amount or remove selection'
                                : error
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
                      index,
                      String(
                        option.isEditingInFiat
                          ? option.fiatAmount
                          : option.tokenAmount
                      )
                    )} ${
                      option.error && isIndexActive(index)
                        ? 'text-red-error'
                        : 'text-white'
                    } `}
                    extraClasses={`border-none bg-transparent p-0 text-right focus:cursor-text`}
                  />
                </div>

                {/* Symbol */}
                <div
                  className={`${
                    isIndexActive(index) ? 'text-gray-syn4 h2' : 'text-white'
                  } ${dynamicInputFieldStyles(
                    index,
                    String(
                      option.isEditingInFiat
                        ? option.fiatAmount
                        : option.tokenAmount
                    )
                  )}`}
                  // clicking symbol should focus the input field
                  onClick={() => inputRefs.current[index].focus()}
                  tabIndex={0}
                  role="button"
                  onKeyPress={() => inputRefs.current[index].focus()}
                >
                  {!option.isEditingInFiat ? option.symbol : `USD`}
                </div>
              </div>
            )}

            {/* Secondary amount row (i.e default row for fiat amount) */}
            {option.isLoading ? (
              <SkeletonLoader
                height="4"
                width="40"
                borderRadius="rounded-md"
                customClass="hidden md:block"
              />
            ) : (
              <div
                className={`flex text-sm text-gray-syn4 justify-end transition-all text-right w-full ${
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
                    <div className="truncate max-w-26 md:max-w-full">
                      {/* If top row is in FiatAmount, then bottom row should be in tokenAmount */}
                      {option.isEditingInFiat
                        ? `${floatedNumberWithCommas(
                            String(option.tokenAmount)
                          )}`
                        : `${floatedNumberWithCommas(
                            String(option.fiatAmount)
                          )}`}
                    </div>
                    <div className="ml-1">
                      {option.isEditingInFiat ? option.symbol : 'USD'}
                    </div>
                    <button
                      onClick={(e) => {
                        // This stops the row from toggling active/inactive
                        e.stopPropagation();

                        handleOptionsChange([
                          ...options.slice(0, index),
                          {
                            ...option,
                            isEditingInFiat: !option.isEditingInFiat
                          },
                          ...options.slice(index + 1)
                        ]);
                      }}
                      className="hidden md:block"
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
  ));

  return <div className="">{renderedOptions}</div>;
};
