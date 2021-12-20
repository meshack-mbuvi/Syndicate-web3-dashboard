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
  tooltip: string;
  addOn: string;
  column?: boolean;
  full?: boolean;
  customWidth?: string;
}): JSX.Element => {
  const {
    label,
    name,
    onChange,
    error,
    value,
    addOn,
    tooltip,
    disabled,
    column = false,
    full,
    customWidth = "",
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
    <div
      className={`flex ${
        column ? `flex-col mr-2 sm:mr-4` : `flex-row`
      } justify-center ${full ? `w-full` : ``}`}
    >
      <div
        className={`flex mr-2 ${
          column ? `w-full justify-start mb-2` : `flex row w-1/2 justify-end`
        }`}
      >
        <label
          htmlFor={label}
          className="block pt-2 text-black text-base font-whyte"
        >
          {label}
        </label>
      </div>

      <div
        className={`${
          customWidth ? customWidth : `w-5/6`
        } flex-grow flex flex-col justify-between`}
      >
        {/* input field */}
        <div className="flex justify-between">
          <div
            className={`flex rounded-md flex-grow border ${disabledClasses}`}
          >
            <input
              type="number"
              name={name}
              onChange={onChange}
              className={`flex px-1 ml-1 py-2 text-base rounded-md focus:outline-none outline-none focus:ring-0 focus:border-none border-0 font-whyte`}
              style={{ width: `${variableWidth}ch` }}
              {...rest}
              value={value}
              disabled={disabled}
            />
            <span className="flex flex-1 py-2 text-gray-500 font-whyte">
              {addOn}
            </span>
          </div>
          {/* icon */}
          {tooltip ? (
            <div className="w-12 mt-1 flex">
              <InfoIcon tooltip={tooltip} />
            </div>
          ) : null}
        </div>
        <p className="text-red-500 text-xs mt-1 mb-1">
          {error && !disabled ? error : null}
        </p>
      </div>
    </div>
  );
};
