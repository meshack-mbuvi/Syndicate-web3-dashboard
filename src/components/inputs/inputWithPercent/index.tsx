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
  type = "number",
  classnames = "mb-7",
  resetToDefault,
  setResetToDefault,
  min = 0,
  max = 100,
  step = 0.1,
  storedValue,
  customError,
}) => {
  const [value, setValue] = useState<number>(
    storedValue ? storedValue : placeholder ? NaN : 0,
  );
  const [variableWidth, setVariableWidth] = useState(2.2);
  const [error, setError] = useState("");
  const ref = useRef(null);

  const { setButtonsDisabled } = useCreateSyndicateContext();

  useEffect(() => {
    // Handles % position based on inputs
    if (value.toString().length > 1) {
      setVariableWidth(value.toString().length + 0.9);
    } else if (value.toString().length === 1) {
      setVariableWidth(2.2);
    }
  }, [value, placeholder]);

  useEffect(() => {
    // Validators
    const errorMessage = ValidatePercent(value, min);
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
    if (isNaN(value) && !placeholder) {
      setValue(0);
      setInputValue(0);
    } else if (resetToDefault) {
      setValue(NaN); // Handles syndicateProfitSharePercent value
    }
  }, [value, placeholder, setInputValue, resetToDefault]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _value = parseFloat(e.target.value);
    setInputValue(_value ? _value : min ? min : 0);
    setValue(_value);

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
        <div className="flex relative">
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
            className={classNames(
              label && "mt-2",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-0"
                : "border-gray-24 focus:border-blue",
              "flex flex-grow w-full min-w-0 py-4 font-whyte text-lg rounded-md bg-black border text-white focus:outline-none hover:border-blue-50",
            )}
          />
          {!placeholder || (placeholder && !isNaN(value)) ? (
            <span
              className={classNames(
                label && "mt-2",
                "flex flex-1 absolute py-4 text-lg",
              )}
              style={{ marginLeft: `${variableWidth}ch` }}
              onClick={handlePercentSignClick}
            >
              %
            </span>
          ) : (
            ""
          )}
        </div>

        <p className="text-red-500 text-xs h-4 mt-1">{error || customError}</p>
      </div>
    </div>
  );
};

export default InputWithPercent;
