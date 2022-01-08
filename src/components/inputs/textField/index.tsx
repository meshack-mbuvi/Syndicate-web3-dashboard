import { isEmpty } from "lodash";
import React, { useState } from "react";
import { useController } from "react-hook-form";

interface IProps {
  label?: string;
  name?: string;
  placeholder?: string;
  info?: any;
  control: any;
  addOn?: string;
  column?: boolean;
  borderStyles?: string;
  paddingStyles?: string;
  borderOutline?: boolean;
  textAlignment?: string;
  cornerHint?: {
    text: string | any;
    textColor?: string;
  };
  disabled?: boolean;
  style?: any;
  required?: boolean;
  autoFocus?: boolean;
  showWarning?: boolean;
  warningText?: string;
  checkType?: string;
}
/**
 * An input component with label and icon at the right end
 * If the input is disable, the input field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */
export const TextField: React.FC<IProps> = ({
  control,
  name,
  placeholder,
  info,
  addOn,
  cornerHint,
  borderStyles = "",
  column = false,
  label = "",
  borderOutline = true,
  textAlignment = "",
  paddingStyles = "p-4",
  disabled = false,
  required = true,
  autoFocus = false,
  showWarning = false,
  warningText = "",
  checkType = " ",
}) => {
  const {
    field,
    formState: { errors },
  } = useController({
    name,
    control,
    rules: { required },
    defaultValue: "",
  });
  const [warning, setWarning] = useState("");

  const handleBlur = () => {
    const { value } = field;

    if (
      (checkType == "," && !value.includes(",")) ||
      value.trim().split(checkType).length < 2
    ) {
      setWarning(warningText);
    } else {
      setWarning("");
    }

    // clear warning when there is an error in the input field
    if (errors[`${name}`]) {
      setWarning("");
    }
  };

  const handleFocus = () => {
    setWarning("");
  };

  return (
    <div
      className={`flex ${borderStyles} ${
        column ? "flex-row justify-between" : "flex-col justify-center"
      } w-full`}
    >
      <div
        className={`flex justify-between ${column ? "w-2/5 my-auto" : "mb-2"}`}
      >
        {label ? <div className="leading-5">{label}</div> : null}
        {!isEmpty(cornerHint) ? (
          <div
            className={`${cornerHint?.textColor || "text-gray-syn10"} text-sm`}
          >
            {cornerHint.text}
          </div>
        ) : null}
      </div>
      <div className="relative flex-grow">
        <input
          className={`block font-whyte text-base ${textAlignment} bg-transparent ${paddingStyles} rounded-md w-full ${
            errors?.[`${name}`]?.message
              ? "border-red-error"
              : `${
                  borderOutline
                    ? "border-1 border-gray-24 hover:border-gray-syn3"
                    : "border-0 focus:outline-none focus:ring-0 outline-none hover:border-0 ring-0"
                }`
          }  text-white placeholder-gray-syn5`}
          name={name}
          {...field}
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
          onBlur={handleBlur}
          onFocus={handleFocus}
        />
        {addOn && (
          <div
            className={`absolute inset-y-0 right-0 pr-4 py-4 flex items-center `}
          >
            <span
              className={`font-whyte text-base ${field.value? "text-white": "text-gray-syn5"}`}
              id="price-currency"
            >
              {addOn}
            </span>
          </div>
        )}
      </div>

      {errors[`${name}`]?.message ? (
        <p className="text-red-error font-whyte text-sm pt-2">
          {errors?.[`${name}`]?.message}
        </p>
      ) : showWarning && warning ? (
        // show warning
        <p className="text-yellow-semantic">{warning}</p>
      ) : (
        info && <p className="text-sm mt-2 text-gray-syn3 font-whyte">{info}</p>
      )}
    </div>
  );
};