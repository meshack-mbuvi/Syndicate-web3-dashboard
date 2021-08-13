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
    logo,
    ...rest
  } = props;

  const focusInput = useRef(null);

  useEffect(() => {
    // change focus to input field if focus value is set
    if (focus) {
      focusInput.current.focus();
    }
  }, [focus]);

  return (
    <div className={`flex flex-col justify-center w-full`}>
      <div className="flex justify-between">
        <label
          htmlFor={label}
          className="block text-white"
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
            if (isNumber && isNaN(e.target.value.replace(/,/g, "") as any)) {
              return;
            }
            onChange(e);
          }}
          className={`flex w-full min-w-0 mt-2 font-whyte flex-grow dark-input-field ${
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
          <div className="absolute inset-y-0 right-0 pr-3 mt-1 flex items-center pointer-events-none">
            {logo ? (
              <span className="bg-black px-1">
                <img className="h-4 w-4" src={logo} alt="logo" />
              </span>
            ) : null}
            <span className="font-whyte text-white text-sm" id="price-currency">
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
