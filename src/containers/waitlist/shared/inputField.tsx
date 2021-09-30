import { CancelIcon } from "@/components/shared/Icons";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface InputFieldProps {
  index?: number;
  handleChange: (e: any) => void;
  placeholder: string;
  icon?: string;
  asAdditionalInput?: boolean;
  removeInputField?: (index: number) => void;
  value?: string;
  error?: boolean;
  symbol?: string;
  placeHolderPadding?: string;
  autoComplete?: string;
  activeIndex?: number;
}

const InputField = (props: InputFieldProps) => {
  const {
    index,
    placeholder,
    icon,
    asAdditionalInput,
    handleChange,
    removeInputField,
    value,
    error,
    symbol,
    placeHolderPadding,
    autoComplete,
    activeIndex,
  } = props;
  const [showRemoveIcon, setShowRemoveIcon] = useState<boolean>(false);
  const inputPadding = placeHolderPadding ? "6" : "4";

  const errorStyles = error && activeIndex === index
    ? "border focus: none focus:outline-none rounded-lg border-red-500"
    : "";

  return (
    <div>
      <div
        className="relative shadow-sm items-center"
        onMouseOver={() => setShowRemoveIcon(true)}
        onMouseLeave={() => setShowRemoveIcon(false)}
      >
        <input
          type="text"
          name="selected-option"
          id="selected-option"
          className={`${errorStyles} ${placeHolderPadding} block w-full pr-10 pl-${inputPadding} py-3 font-whyte bg-gray-darkInput text-white border-gray-darkInput ${
            asAdditionalInput ? "rounded-b-custom mt-0.5" : "rounded-custom"
          }`}
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
          autoComplete={autoComplete}
        />

        {symbol && (
          <span className="absolute inset-y-0 left-2 pr-3 pt-1 flex items-center text-base">
            {" "}
            {symbol}
          </span>
        )}

        {error && activeIndex === index && (
          <div className="relative">
            <p className="text-red-500 text-xs h-1 mb-6 ml-2 text-left">
              You have already added this username
            </p>
          </div>
        )}

        {icon && (
          <div
            className={`absolute inset-y-0 right-0 pr-3 pt-1 flex items-center ${
              index === 0 ? "pointer-events-none" : ""
            }`}
          >
            {showRemoveIcon && index > 0 ? (
              <div
                className="cursor-pointer"
                onClick={() => removeInputField(index)}
              >
                <CancelIcon width="w-5" height="h-5" color="text-gray-3" />
              </div>
            ) : (
              <img src={icon} width="w-5" height="h-5" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
