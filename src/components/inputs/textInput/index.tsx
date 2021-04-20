import PropTypes from "prop-types";
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
}) => {
  const {
    label,
    name,
    onChange,
    error,
    value,
    disabled = false,
    ...rest
  } = props;

  const disabledClasses = disabled
    ? "text-sm text-gray-500 border-0"
    : "text-black border-gray-85";

  return (
    <div className="flex flex-row justify-center">
      <div className="mr-2 w-5/12 flex justify-end">
        <label
          htmlFor="syndicateAddress"
          className="block pt-2 text-black text-lg font-medium">
          {label}
        </label>
      </div>
      <div className="w-7/12 flex flex-col justify-between">
        {/* input field */}
        <div className="flex">
          <input
            type="text"
            name={name}
            onChange={onChange}
            className={`flex flex-grow focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${disabledClasses}`}
            {...rest}
            disabled={disabled}
            value={value}
          />
          {/* icon */}
          <div className="w-6 ml-4 mt-1">
            <InfoIcon />
          </div>
        </div>
        {error ? <p className="text-red-500 text-sm">{error}</p> : null}
      </div>
    </div>
  );
};

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.any,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.any,
};
