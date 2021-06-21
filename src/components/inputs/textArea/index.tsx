import PropTypes from "prop-types";
import React from "react";

/**
 * An textarea component with label and icon at the right end
 * If the textarea is disable, the textarea field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */

interface ITextAreaProps {
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value?: string | number;
  rows?: number;
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSelect?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextArea = (props: ITextAreaProps) => {
  const {
    name,
    onChange,
    error,
    value,
    disabled = false,
    rows = 4,
    onPaste,
    onKeyUp,
    onSelect,
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
        onPaste={onPaste}
        onKeyUp={onKeyUp}
        onSelect={onSelect}
        value={value}
        className={`border border-gray-french rounded-lg w-full bg-white p-4 focus:border-blue ${disabledClasses}`}
        {...rest}
        rows={rows}
        cols={50}
        disabled={disabled}
      ></textarea>
      {error ? (
        <p className="text-red-500 text-xs break-word">{error}</p>
      ) : null}
    </div>
  );
};
