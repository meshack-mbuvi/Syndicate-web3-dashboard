import React from "react";
import { useController } from "react-hook-form";
import NumberFormat from "react-number-format";

interface IProps {
  label?: string;
  name?: string;
  placeholder?: string;
  type?: string;
  info?: string;
  control: any;
  addOn?: string;
  column?: boolean;
  borderStyles?: string;
  paddingStyles?: string;
  addOnStyles?: string;
  borderOutline?: boolean;
  textAlignment?: string;
  disabled?: boolean;
  defaultValue?: string;
}
/**
 * An input component with label and icon at the right end
 * If the input is disable, the input field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */
export const NumberField: React.FC<IProps> = ({
  control,
  name,
  placeholder,
  info,
  addOn,
  addOnStyles = "pr-20",
  borderStyles = "",
  column = false,
  label = "",
  borderOutline = true,
  textAlignment = "",
  paddingStyles = "p-4",
  disabled = false,
  defaultValue = "",
}) => {
  const {
    field: { onChange, ...rest },
    formState: { errors },
  } = useController({
    name,
    control,
    defaultValue,
  });

  return (
    <div
      className={`flex w-full ${borderStyles} ${
        column ? "flex-row justify-between" : "flex-col justify-center"
      }`}
    >
      {label ? (
        <div className={`${column ? "my-auto w-2/5" : "mb-2"} leading-5`}>
          {label}
        </div>
      ) : null}

      <div className="relative flex-grow">
        <NumberFormat
          {...rest}
          disabled={disabled}
          thousandSeparator={true}
          allowNegative={false}
          className={`block font-whyte text-base ${textAlignment} bg-transparent ${paddingStyles} rounded-md w-full autocomplete-off ${
            errors?.[`${name}`]?.message
              ? "border-red-error"
              : `${
                  borderOutline
                    ? "border-1 border-gray-24 hover:border-gray-syn3"
                    : "border-0 focus:border-0 focus:ring-0 outline-none hover:border-0 ring-0"
                }`
          }  text-white placeholder-gray-syn5 ${
            addOn ? addOnStyles : paddingStyles ? "pr-0" : "pr-4"
          }`}
          placeholder={placeholder}
          onChange={(event) => {
            const { value } = event.target;
            onChange(value.replaceAll(",", ""));
          }}
          decimalScale={2}
        />
        {addOn && (
          <div
            className={`absolute inset-y-0 right-0 ${
              addOnStyles ? "pr-0" : `pr-4`
            } py-4 flex items-center `}
          >
            <span
              className={`font-whyte text-base ${
                rest.value ? "text-white" : "text-gray-syn5"
              }`}
              id="price-currency"
            >
              {addOn}
            </span>
          </div>
        )}
      </div>
      {errors?.[`${name}`]?.message ? (
        <p className=" text-red-error text-sm pt-2">
          {errors[`${name}`]?.message}
        </p>
      ) : (
        info && <p className="text-sm mt-2 text-gray-syn3 font-whyte">{info}</p>
      )}
    </div>
  );
};
