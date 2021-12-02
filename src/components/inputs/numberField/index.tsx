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
  label,
  placeholder,
  info,
  addOn,
}) => {
  const {
    field: { onChange, ...rest },
    formState: { errors },
  } = useController({
    name,
    control,
    rules: { required: true },
    defaultValue: "",
  });

  return (
    <div className={`flex  justify-center w-full flex-col`}>
      <div className="mb-2 leading-5">{label}</div>
      <div className="relative">
        <NumberFormat
          {...rest}
          thousandSeparator={true}
          allowNegative={false}
          className={`block font-whyte text-base bg-transparent p-4 rounded-md border-1 w-full ${
            errors[`${name}`]?.message
              ? "border-red-semantic"
              : "border-gray-24"
          } focus:border-blue-navy outline-none text-white hover:border-gray-syn3 ${
            addOn ? "pr-20" : "pr-4"
          }`}
          placeholder={placeholder}
          onChange={(event) => {
            const { value } = event.target;
            onChange(value.replaceAll(",", ""));
          }}
        />
        {addOn && (
          <div
            className={`absolute inset-y-0 right-0 pr-4 py-4 flex items-center `}
          >
            <span
              className={`font-whyte text-base text-gray-syn4`}
              id="price-currency"
            >
              {addOn}
            </span>
          </div>
        )}
      </div>
      {errors[`${name}`]?.message ? (
        <p className=" text-red-semantic text-sm pt-2">
          {errors[`${name}`]?.message}
        </p>
      ) : (
        info && <p className="text-sm mt-2 text-gray-syn3 font-whyte">{info}</p>
      )}
    </div>
  );
};
