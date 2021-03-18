import React from "react";
import PropTypes from "prop-types";

/**
 * An input component with label and icon at the right end
 * If the input is disable, the input field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */
export const TextInput = (props) => {
  const { label, name, register, disabled = false, ...rest } = props;

  const disabledClasses = disabled
    ? "text-sm text-gray-500 border-0"
    : "text-black border-gray-85";

  return (
    <div className="flex flex-row justify-center">
      <div className="mr-2 w-5/12 flex justify-end">
        <label
          htmlFor="syndicateAddress"
          className="block pt-2 text-black text-sm font-medium"
        >
          {label}
        </label>
      </div>

      <div className="w-7/12 flex justify-between">
        {/* input field */}
        <input
          type="text"
          name={name}
          ref={register}
          className={`flex flex-grow focus:ring-indigo-500 focus:border-indigo-500 rounded-md ${disabledClasses}`}
          {...rest}
          disabled={disabled}
        />
        {/* icon */}
        <div className="w-6 ml-4 mt-1">
          <span className="w-8 h-5 mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="gray"
              className="rotate-180"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.any,
};
