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
  id?: string;
  onChange?;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value: string | number;
  type?: string;
  tooltip?: string;
  column?: boolean;
  full?: boolean;
  customWidth?: string;
}) => {
  const {
    label,
    name,
    id,
    onChange,
    error,
    value,
    tooltip,
    disabled = false,
    type = "text",
    column = false,
    full,
    customWidth = "",
    ...rest
  } = props;

  const disabledClasses = disabled
    ? "text-sm text-gray-500 bg-gray-99 border-0 px-0 pb-0"
    : "text-black border-gray-85";

  return (
    <div
      className={`flex ${
        column ? `flex-col mr-2 sm:mr-4` : `flex-row`
      } justify-center ${full ? `w-full` : ``}`}>
      <div
        className={`flex mr-2 ${
          column ? `w-full justify-start mb-2` : `w-1/2 justify-end`
        }`}>
        <label
          htmlFor={label}
          className="block pt-2 text-black text-sm font-medium">
          {label}
        </label>
      </div>

      <div
        className={`${
          customWidth ? customWidth : `w-5/6`
          } flex-grow flex flex-col justify-between`}>
        
        {/* input field */}
        <div className="flex justify-start">
          <input
            type={type}
            name={name}
            id={id}
            onChange={onChange}
            className={`flex flex-grow text-sm font-whyte focus:ring-blue w-full focus:border-indigo-500 rounded-md ${disabledClasses}`}
            {...rest}
            disabled={disabled}
            value={value}
            step="1"
            onWheel={(e) => e.currentTarget.blur()}
          />
          {/* icon */}
          {tooltip ? (
            <div className="w-auto flex">
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
