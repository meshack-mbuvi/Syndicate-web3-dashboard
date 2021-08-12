import React from "react";

/**
 * An textarea component with label and icon at the right end
 * If the textarea is disable, the textarea field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */

interface ITextAreaProps {
  id?: string;
  classoverride?: string;
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

export const TextArea: React.FC<ITextAreaProps> = (props) => {
  const {
    id,
    name,
    onChange,
    error,
    value,
    disabled = false,
    rows = 4,
    onPaste,
    onKeyUp,
    onSelect,
    classoverride="bg-white",
    ...rest
  } = props;

  const disabledClasses = disabled
    ? "text-gray-500 border-0"
    : "text-black border-gray-85";

  return (
    <div className="w-full">
      <textarea
        id={id}
        name={name}
        onChange={onChange}
        onPaste={onPaste}
        onKeyUp={onKeyUp}
        onSelect={onSelect}
        value={value}
        className={`border border-gray-french rounded-lg w-full p-3 focus:border-blue hover:border-blue-50 ${disabledClasses} ${classoverride}`}
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
