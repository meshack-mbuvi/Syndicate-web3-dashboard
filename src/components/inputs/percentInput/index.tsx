import React from "react";
import { InfoIcon } from "src/components/iconWrappers";

/**
 * An input component with label and icon at the right end
 * If the input is disable, the input field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */
export const PercentInput = (props: {
  label: string;
  name?: string;
  onChange?;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value: string | number;
  tooltip: string;
}) => {
  const { label, name, onChange, error, value, tooltip, ...rest } = props;
  let variableWidth = 2;
  if (value.toString().length > 1) {
    variableWidth = value.toString().length + 1;
  }

  return (
    <div className="flex flex-row justify-end">
      <div className="mr-2 w-1/2 flex justify-end">
        <label
          htmlFor={label}
          className="block pt-2 text-black text-sm font-medium"
        >
          {label}
        </label>
      </div>

      <div className="w-5/6 flex flex-col">
        <div className="flex-grow flex flex-row justify-between">
          {/* input field */}
          <div className="flex percentage-input rounded-md flex-grow border border-gray-85">
            <input
              type="number"
              name={name}
              onChange={onChange}
              className={`flex px-1 ml-1 py-2 text-sm rounded-md focus:outline-none outline-none focus:ring-0 focus:border-none border-0 font-whyte w-full`}
              style={{ width: `${variableWidth}ch` }}
              {...rest}
              max="100"
              value={value}
            />
            <span className="flex flex-1 py-2 text-sm text-gray-500">%</span>
          </div>
          {/* icon */}
          <div className="w-auto mt-1 flex">
            <InfoIcon tooltip={tooltip} />
          </div>
        </div>
        <p className="text-red-500 text-xs my-1">{error ? error : null}</p>
      </div>
    </div>
  );
};
