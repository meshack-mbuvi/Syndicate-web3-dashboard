import React, { useEffect, useRef } from "react";
import SettingDisclaimer from "@/containers/createInvestmentClub/shared/SettingDisclaimer";

/**
 * An input component with label, component to the right, and an icon to the furthest right.
 * @param {*} props
 */
export const AdvancedInputField = (props: {
  label?: string;
  name?: string;
  id?: string;
  onChange?;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value: string | number;
  type?: string;
  addOn?: any;
  extraAddon: any;
  isNumber?: boolean;
  hasError?: boolean;
  moreInfo?: string;
  addSettingDisclaimer?: boolean;
  customClass?: { addon?: string; input?: string };
}): JSX.Element => {
  const {
    label,
    name,
    id,
    onChange,
    error,
    value,
    disabled = false,
    type = "text",
    addOn,
    isNumber,
    customClass,
    hasError = false,
    extraAddon,
    moreInfo,
    addSettingDisclaimer,
  } = props;
  const focusInput = useRef(null);

  useEffect(() => {
    // change focus to input field if focus value is set
    if (focus) {
      focusInput.current.focus();
    }
  }, [focus]);

  return (
    <div className="px-1 w-full">
      <div className="flex justify-between">
        <label
          htmlFor={label}
          className="block text-white text-lg md:text-xl pb-6"
        >
          {label}
        </label>
      </div>
      <div className="flex">
        <div className="mt-1 mb-2 flex rounded-md shadow-sm w-2/3">
          <div className="relative flex items-stretch flex-grow focus-within:z-10">
            <input
              type={type}
              name={name}
              id={id}
              onChange={(e) => {
                if (
                  isNumber &&
                  isNaN(e.target.value.replace(/,/g, "") as any)
                ) {
                  return;
                }
                onChange(e);
              }}
              className={`flex w-full min-w-0 align-middle text-base font-whyte ${
                hasError
                  ? "border border-red-500 focus:border-red-500 focus:ring-0"
                  : ""
              } flex-grow rounded-l-md dark-input-field-advanced ${
                addOn ? "pr-4" : ""
              } ${disabled ? "cursor-not-allowed" : ""}
            `}
              disabled={disabled}
              value={value}
              step="1"
              onWheel={(e) => e.currentTarget.blur()}
              ref={focusInput}
            />
            {addOn && (
              <div
                className={`absolute inset-y-0 right-0 pr-4 flex items-center `}
              >
                <span
                  className={`font-whyte text-white text-sm ${customClass?.addon}`}
                  id="price-currency"
                >
                  {addOn}
                </span>
              </div>
            )}
          </div>
          <div
            className={`-ml-px relative inline-flex items-center bg-black space-x-2 pl-5 pr-7 py-2 border ${
              error ? "border-red-500" : "border-gray-24"
            } rounded-r-md text-white focus:outline-none focus:ring-0`}
          >
            {extraAddon}
          </div>
        </div>
        {addSettingDisclaimer && (
          <div className="pl-4 flex justify-center items-center w-1/3">
            <SettingDisclaimer />
          </div>
        )}
      </div>

      <div className="w-2/3">
        {error && (
          <p className="text-red-500 text-sm mb-1">
            {error && !disabled ? error : ""}
          </p>
        )}
        {moreInfo && !error && (
          <span className="text-sm text-gray-3 pt-2">{moreInfo}</span>
        )}
      </div>
    </div>
  );
};
