/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useCreateSyndicateContext } from "@/context/CreateSyndicateContext";
import { classNames } from "@/utils/classNames";
import { ValidatePercent } from "@/utils/validators";
import React, { useEffect, useRef, useState } from "react";

interface IProps {
  name: string;
  min?: number;
  max?: number;
  step?: number;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  label?: string;
  classnames?: string;
  resetToDefault?: boolean;
  setInputValue?: (value: number) => void;
  setResetToDefault?: (value: boolean) => void;
  storedValue?: number;
  customError?: string;
}

const InputWithPercent: React.FC<IProps> = ({
  name,
  label,
  placeholder,
  setInputValue,
  type = "text",
  classnames = "",
  resetToDefault,
  setResetToDefault,
  min = 0,
  max = 100,
  maxLength = 5,
  step = 0.1,
  storedValue,
  customError,
}) => {
  const [value, setValue] = useState<string>(
    storedValue ? storedValue.toString() : placeholder ? "" : "0",
  );
  const [variableWidth, setVariableWidth] = useState(24);
  const [error, setError] = useState("");
  const ref = useRef(null);

  const { setButtonsDisabled } = useCreateSyndicateContext();

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
      offset = 14;
      textWidth = getTextWidth(
        value,
        "16px 'ABC Whyte Regular', Helvetica, Arial, sans-serif",
      );
    }

    if (value.toString().length > 1) {
      setVariableWidth(textWidth + offset);
    } else if (value.toString().length == 1) {
      offset = 16;
      setVariableWidth(textWidth + offset);
    }
  }, [value, placeholder]);

  useEffect(() => {
    // Validators
    const errorMessage = ValidatePercent(parseFloat(value), min);
    if (errorMessage) {
      setError(errorMessage);
      setButtonsDisabled(true);
    } else {
      setError("");
      setButtonsDisabled(false);
    }
  }, [value, min]);

  useEffect(() => {
    // Handles setting the default value when user deletes everything in input field
    if (value === "0" && !placeholder) {
      setValue("0");
      setInputValue(0);
    } else if (resetToDefault) {
      setValue(""); // Handles syndicateProfitSharePercent value
    }
  }, [value, placeholder, setInputValue, resetToDefault]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // regex to validate float, without having to remove decimal
    const regexp = /^[0-9]*(\.[0-9]{0,2})?$/;

    let rawValue = String(e.target.value);
    let _value = parseFloat(e.target.value);
    if (_value.toString().length > 2 && _value > 100) {
      _value = max;
      rawValue = max.toString();
    } else if (_value.toString().length <= 5 && !regexp.test(rawValue)) {
      rawValue = value;
    } else if (_value.toString().length > 5) {
      _value = parseFloat(value);
      rawValue = value;
    }

    // Save to state and remove any extra preceding zeroes
    // Only allows one preceding Zero, useful for values < 1.
    setValue(rawValue.replace(/^00+/, "0"));
    setInputValue(_value ? _value : min ? min : 0);

    // Handles syndicateProfitSharePercent value
    if (setResetToDefault !== undefined) {
      setResetToDefault(false);
    }
  };

  const handlePercentSignClick = () => {
    ref.current.focus();
  };

  return (
    <div className={classnames}>
      {label && (
        <label className="text-base" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="flex flex-col w-full">
        <div className="flex relative ">
          <input
            id={name}
            name={name}
            type={type}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            ref={ref}
            onWheel={(e) => e.currentTarget.blur()}
            placeholder={placeholder}
            maxLength={maxLength}
            className={classNames(
              label && "mt-2",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-0"
                : "border-gray-24 focus:border-blue",
              `flex flex-grow text-sm w-full min-w-0 font-whyte dark-input-field`,
            )}
          />
          {!placeholder || (placeholder && value !== "") ? (
            <span
              className={classNames(
                label && "mt-1",
                "flex flex-1 absolute text-sm py-3",
              )}
              style={{
                marginLeft: `${variableWidth}px`,
                marginTop: `${label ? "0.33em" : "0.063rem"}`,
              }}
              onClick={handlePercentSignClick}
            >
              %
            </span>
          ) : (
            ""
          )}
        </div>
        
        {error || customError &&
          <p className="text-red-500 text-xs h-8 mt-1 ">{error || customError}</p>
        }
      </div>
    </div>
  );
};

export default InputWithPercent;
