import React from "react";
import { InfoIcon } from "src/components/iconWrappers";

/**
 * An input component with label and icon at the right end
 * If the input is disable, the input field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */
export const InputWithAddon = (props: {
  label: string;
  name?: string;
  onChange?;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value: string | number;
  toolTip: string;
  addOn: string;
}) => {
  const {
    label,
    name,
    onChange,
    error,
    value,
    addOn,
    toolTip,
    disabled,
    ...rest
  } = props;
  let variableWidth = 6;
  if (value.toString().length >= 6) {
    variableWidth = value.toString().length + 1;
  }

  const disabledClasses = disabled
    ? "text-gray-500 border-0"
    : "text-black border border-gray-85";

  return (
    <div className="flex flex-row justify-center">
      <div className="mr-2 w-2/5 flex justify-end">
        <label
          htmlFor="syndicateAddress"
          className="block pt-2 text-black text-sm font-medium">
          {label}
        </label>
      </div>
      <div className="w-3/5 flex flex-col justify-between">
        {/* input field */}
        <div className="flex">
          <div className={`flex rounded-md flex-grow ${disabledClasses}`}>
            <input
              type="number"
              name={name}
              onChange={onChange}
              className={`flex px-1 ml-1 py-2 text-sm rounded-md focus:outline-none outline-none focus:ring-0 focus:border-none border-0`}
              style={{ width: `${variableWidth}ch` }}
              {...rest}
              value={value}
              disabled={disabled}
            />
            <span className="flex flex-1 py-2 text-gray-500">{addOn}</span>
          </div>
          {/* icon */}
          <div className="w-6 ml-4 mt-1">
            <InfoIcon toolTip={toolTip} />
          </div>
        </div>
        {error ? <p className="text-red-500 text-sm">{error}</p> : null}
      </div>
    </div>
  );
};
