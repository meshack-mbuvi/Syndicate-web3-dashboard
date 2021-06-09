import PropTypes from "prop-types";
import React from "react";

/**
 * An textarea component with label and icon at the right end
 * If the textarea is disable, the textarea field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */
export const TextArea = (props: {
  name?: string;
  onChange?;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value: string | number;
  rows?: number;
}) => {
  const {
    name,
    onChange,
    error,
    value,
    disabled = false,
    rows = 4,
    ...rest
  } = props;

  const disabledClasses = disabled
    ? "text-sm text-gray-500 border-0"
    : "text-black text-sm border-gray-85";

  return (
    <div className="w-full">
      <textarea
        name={name}
        onChange={onChange}
        className={`border border-gray-french rounded-lg w-full bg-white p-4 focus:border-indigo-500 ${disabledClasses}`}
        {...rest}
        rows={rows}
        disabled={disabled}
        value={value}></textarea>
      {error ? (
        <p className="text-red-500 text-xs break-word">{error}</p>
      ) : null}
    </div>
  );
};

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.any,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.any,
};
