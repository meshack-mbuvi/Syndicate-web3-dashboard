import React from "react";
import { InfoIcon } from "src/components/iconWrappers";

/**
 * An input component with label and icon at the right end
 * If the input is disable, the input field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */
export const TextInput = (props: {
  label: string;
  name?: string;
  onChange?;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value: string | number;
  toolTip: string;
  type?: string;
}) => {
  const {
    label,
    name,
    onChange,
    error,
    value,
    toolTip,
    disabled = false,
    type = "text",
    ...rest
  } = props;

  const disabledClasses = disabled
    ? "text-sm text-gray-500 border-0"
    : "text-black border-gray-85";

  return (
    <div className="flex flex-row justify-center">
      <div className="mr-2 w-2/5 flex justify-end">
        <label
          htmlFor="syndicateAddress"
          className="block pt-2 text-black text-sm font-medium">
          {label}
        </label>
      </div>
      <div className="w-3/5 flex-grow flex flex-col justify-between">
        {/* input field */}
        <div className="flex flex-grow">
          <input
            type={type}
            name={name}
            onChange={onChange}
            className={`flex flex-grow text-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${disabledClasses}`}
            {...rest}
            disabled={disabled}
            value={value}
            step="1"
          />
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
