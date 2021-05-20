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
  type?: string;
  tooltip?: string;
  column?: boolean;
}) => {
  const {
    label,
    name,
    onChange,
    error,
    value,
    tooltip,
    disabled = false,
    type = "text",
    column = false,
    ...rest
  } = props;

  const disabledClasses = disabled
    ? "text-sm text-gray-500 bg-gray-99 border-0"
    : "text-black border-gray-85";

  return (
    <div
      className={`flex ${
        column ? `flex-col mr-2 sm:mr-4` : `flex-row`
      } justify-center`}
    >
      <div
        className={`flex mr-2 ${
          column ? `w-full justify-start mb-2` : `w-1/2 justify-end`
        }`}
      >
        <label
          htmlFor="syndicateAddress"
          className="block pt-2 text-black text-sm font-medium"
        >
          {label}
        </label>
      </div>
      <div className="w-full flex-grow flex flex-col justify-between">
        {/* input field */}
        <div className="flex justify-start">
          <input
            type={type}
            name={name}
            onChange={onChange}
            className={`flex flex-grow text-sm font-whyte focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${disabledClasses} ${
              column ? `w-auto sm:w-56` : ``
            }`}
            {...rest}
            disabled={disabled}
            value={value}
            step="1"
          />
          {/* icon */}
          {tooltip ? (
            <div className="w-auto mt-1 flex">
              <InfoIcon tooltip={tooltip} />
            </div>
          ) : null}
        </div>
        <p className="text-red-500 text-xs mt-1 mb-2">{error ? error : null}</p>
      </div>
    </div>
  );
};
