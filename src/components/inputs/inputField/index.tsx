import React, { useEffect, useRef } from "react";

/**
 * An input component with label and icon at the right end
 * If the input is disable, the input field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */
export const InputField = (props: {
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
  logo?: string;
  focus?: boolean;
  addOn?: string;
  subTitle?: string;
  isNumber?: boolean;
}): JSX.Element => {
  const {
    label,
    name,
    id,
    onChange,
    error,
    value,
    disabled = false,
    type = "text",
    focus,
    addOn,
    subTitle,
    isNumber,
    ...rest
  } = props;

  const focusInput = useRef(null);

  useEffect(() => {
    // change focus to input field if focus value is set
    if (focus) {
      focusInput.current.focus();
    }
  }, [focus]);

  const disabledClasses = disabled
    ? "text-sm text-gray-500 bg-gray-99 border-0 px-0 pb-0"
    : "text-black border-gray-85";

  return (
    <div className={`flex flex-col justify-center w-full`}>
      <div className="flex justify-between">
        <label
          htmlFor={label}
          className="block py-2 text-white text-sm font-medium"
        >
          {label}
        </label>
        <span className="block py-2 text-gray-3 text-sm font-normal">
          {subTitle}
        </span>
      </div>
      <div className="relative rounded-md shadow-sm">
        <input
          type={type}
          name={name}
          id={id}
          onChange={(e) => {
            if (isNumber && isNaN(e.target.value.replace(/,/g,"") as any)) {
              return
            }
            onChange(e);
          }}
          className={`flex w-full min-w-0 py-3 mt-1 font-whyte text-sm rounded-md bg-black border focus:border-blue text-white focus:outline-none focus:ring-gray-24 flex-grow border hover:border-blue-50 ${
            addOn ? "pr-14" : ""
          }`}
          {...rest}
          disabled={disabled}
          value={value}
          step="1"
          onWheel={(e) => e.currentTarget.blur()}
          ref={focusInput}
        />
        {addOn && (
          <div className="absolute inset-y-0 right-0 pr-3 mt-2 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm" id="price-currency">
              {addOn}
            </span>
          </div>
        )}
      </div>
      <p className="text-red-500 text-xs h-1 mt-1 mb-1">
        {error && !disabled ? error : ""}
      </p>
    </div>
  );
};
