import { SettingsDisclaimerTooltip } from "@/containers/createInvestmentClub/shared/SettingDisclaimer";
import cn from "classnames";
import { useState } from "react";

/**
 * An input component with label, component to the right, and an icon to the furthest right.
 * @param {*} props
 */
export const AdvancedInputField = (props: {
  title?: string;
  name?: string;
  id?: string;
  onChange?;
  disabled?: boolean;
  placeholder?: string;
  error?: string | React.ReactNode;
  required?: boolean;
  value: string | number;
  type?: string;
  addOn?: any;
  extraAddon: any;
  isNumber?: boolean;
  hasError?: boolean;
  moreInfo?: string | React.ReactNode;
  addSettingDisclaimer?: boolean;
  customClass?: { addon?: string; input?: string };
  className?: string;
}): JSX.Element => {
  const {
    title,
    name,
    id,
    onChange,
    placeholder,
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
    className
  } = props;

  const [focused, setFocused] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <div className={className}>
      <div className="flex justify-between">
        <label htmlFor={title} className="h3 pb-6">
          {title}
        </label>
      </div>
      <div
        className={cn("mt-1 mb-2 flex border rounded-md overflow-hidden", {
          "border-blue-navy ring-0": focused && !error,
          "border-gray-24": !focused,
          "border-red-error": error,
          "border-gray-syn3": hover,
        })}
      >
        <div
          className="flex rounded-md shadow-sm w-full"
          data-tip
          data-for="disclaimer-tip"
        >
          <div className="relative flex flex-1 items-stretch flex-grow focus-within:z-10">
            <input
              type={type}
              name={name}
              id={id}
              placeholder={placeholder}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onChange={(e) => {
                if (
                  isNumber &&
                  isNaN(e.target.value.replace(/,/g, "") as any)
                ) {
                  return;
                }
                onChange(e);
              }}
              className={`flex w-full border-none min-w-0 align-middle text-base font-whyte focus:ring-0 ${
                hasError ? "border border-red-500 focus:border-red-500" : ""
              } flex-grow rounded-l-md dark-input-field-advanced ${
                addOn ? "pr-4" : ""
              } ${disabled ? "cursor-not-allowed" : ""}
            `}
              disabled={disabled}
              value={value}
              step="1"
              onWheel={(e) => e.currentTarget.blur()}
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
            className={cn(
              "relative border-l-1 inline-flex items-center bg-black space-x-2 pl-5 pr-7 py-2",
              {
                "border-blue-navy ring-0": focused && !error,
                "border-gray-24": !focused,
                "border-red-error": error,
                "border-gray-syn3": hover,
              },
            )}
          >
            {extraAddon}
          </div>
        </div>
        {addSettingDisclaimer && (
          <div className="hidden lg:flex pl-4 justify-center items-center w-1/3 absolute">
            <SettingsDisclaimerTooltip
              id="disclaimer-tip"
              tip={
                <span>
                  Can be modified later via an on-chain <br /> transaction with
                  gas
                </span>
              }
            />
          </div>
        )}
      </div>

      <div className="w-full">
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
