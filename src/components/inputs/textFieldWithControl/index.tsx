import { classNames } from "@/utils/classNames";
import { numberWithCommas } from "@/utils/formattedNumbers";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ReactTooltip from "react-tooltip";
interface IProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  onChangeHandler;
  errorMessage: string;
  memberDeposits: string;
  tokenSymbol: string;
  maxAvailable: number;
  tooltip?: string;
  storedValue?: string;
  inputBackground?: string;
  handleSetMaxValue: (event) => void;
  handleSetAllMemberDeposit: (event) => void;
}

export const TextInputWithControl: React.FC<IProps> = ({
  label,
  name,
  type = "text",
  placeholder = "",
  onChangeHandler,
  memberDeposits,
  errorMessage,
  tokenSymbol,
  maxAvailable,
  handleSetMaxValue,
  handleSetAllMemberDeposit,
  tooltip,
  inputBackground = "bg-transparent",
  storedValue = "0", //input value/saved
}) => {
  // condition to check whether value is equal to the totalMemberDeposits.
  const allAmountSelected =
    parseInt(storedValue, 10) === parseInt(memberDeposits, 10);
  const [value, setValue] = useState<string>(
    storedValue ? storedValue.toString() : placeholder ? "" : "0",
  );
  const [variableWidth, setVariableWidth] = useState(50);
  const ref = useRef(null);

  // Use canvas to determine text width
  const getTextWidth = (text, font) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font || getComputedStyle(document.body).font;
    return context.measureText(text).width;
  };

  useEffect(() => {
    let offset;
    let textWidth;

    // Handles % position based on inputs
    if (value.toString().length >= 1) {
      offset = 24;
      textWidth = getTextWidth(
        value,
        "16px 'Whyte Regular', Helvetica, Arial, sans-serif",
      );
    }

    if (value.toString().length > 1) {
      setVariableWidth(textWidth + offset);
    } else if (value.toString().length == 1) {
      offset = 24;
      setVariableWidth(textWidth + offset);
    }
  }, [value, placeholder]);

  useEffect(() => {
    // Handles setting the default value when user deletes everything in input field
    if (value === "0" && !placeholder) {
      setValue("0");
      onChangeHandler(0);
    }
  }, [value, placeholder, onChangeHandler]);

  const handleSettingValues = (rawValue: string) => {
    // regex to validate float, without having to remove decimal
    const regexp = /^[0-9]*(\.[0-9]{0,2})?$/;
    let _value = parseInt(rawValue);

    if (rawValue.toString().length <= 15 && !regexp.test(rawValue)) {
      rawValue = value;
    } else if (rawValue.toString().length > 15) {
      _value = parseFloat(value);
      rawValue = value;
    }
    // Save to state and remove any extra preceding zeroes
    // Only allows one preceding Zero, useful for values < 1.
    setValue(numberWithCommas(rawValue.replace(/^[0|\D]*/, "")));
    onChangeHandler(_value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    handleSettingValues(rawValue.split(",").join(""));
  };

  const handleSettingMaxValue = (event) => {
    event.target.value = maxAvailable;
    handleSetMaxValue(event);
    handleSettingValues(maxAvailable.toString());
  };

  const handleSettingAllValue = (event) => {
    event.target.value = memberDeposits;

    handleSetAllMemberDeposit(event);
    handleSettingValues(memberDeposits.toString());
  };

  const [inputFocused, setInputFocused] = useState(false);

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
  };

  const handlePercentSignClick = () => {
    ref.current.focus();
  };

  return (
    <div>
      <div className="flex justify-between text-base align-middle leading-5 mb-2">
        <label htmlFor={name}>{label}</label>
        <div className="flex text-gray-lightManatee">
          Available: {numberWithCommas(maxAvailable.toString())} {tokenSymbol}
          {tooltip ? (
            <span
              className="w-auto flex ml-2"
              data-tip
              data-for="available-deposit"
            >
              <Image width={16} height={16} src="/images/exclamation.svg" />
              <ReactTooltip id="available-deposit" place="top" effect="solid">
                {tooltip}
              </ReactTooltip>
            </span>
          ) : null}
        </div>
      </div>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`flex relative w-full py-3 px-5 lg:py-4 h-14 font-whyte text-base 
          rounded-md  border ${inputBackground} border-gray-24 
          focus:border-blue  text-gray-lightManatee focus:outline-none
          focus:ring-gray-24 flex-grow focus:text-white`}
        />

        {!placeholder || (placeholder && value !== "") ? (
          <button
            className={classNames(
              `absolute text-base inset-y-0 py-4 flex  ${
                inputFocused ? "text-white" : "text-gray-lightManatee"
              }`,
            )}
            style={{
              marginLeft: `${variableWidth}px`,
              marginTop: "1px",
            }}
            onClick={handlePercentSignClick}
          >
            {tokenSymbol}
          </button>
        ) : (
          ""
        )}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center justify-between">
          {parseInt(value, 10) !== maxAvailable && (
            <button
              className="text-gray-lightManatee text-base px-4 py-1.5 rounded-full bg-blue-darkGunMetal hover:bg-gray-steelGrey"
              onClick={handleSettingMaxValue}
            >
              Max
            </button>
          )}

          {!allAmountSelected && (
            <button
              className={`text-gray-lightManatee text-base px-4 py-1.5 rounded-full ml-3 bg-blue-darkGunMetal hover:bg-gray-steelGrey`}
              onClick={handleSettingAllValue}
            >
              All
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="mt-2">
          <span className={`text-sm leading-5 text-red-semantic`}>
            {errorMessage}
          </span>
        </div>
      )}
    </div>
  );
};
