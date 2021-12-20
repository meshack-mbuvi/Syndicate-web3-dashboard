import { isEmpty } from "lodash";
import React from "react";
import { useController } from "react-hook-form";

interface IProps {
  label?: string;
  name?: string;
  placeholder?: string;
  info?: any;
  control: any;
  addOn?: string;
  cornerHint?: {
    text: string | any;
    textColor?: string;
  };
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
  label,
  placeholder,
  info,
  addOn,
  cornerHint,
}) => {
  const {
    field,
    formState: { errors },
  } = useController({
    name,
    control,
    defaultValue: "",
  });

  return (
    <div className={`flex  justify-center w-full flex-col`}>
      <div className="flex justify-between mb-2">
        {label ? <div className="leading-5">{label}</div> : null}
        {!isEmpty(cornerHint) ? (
          <div
            className={`${cornerHint?.textColor || "text-gray-syn10"} text-sm`}
          >
            {cornerHint.text}
          </div>
        ) : null}
      </div>
      <div className="relative">
        <input
          className={`block font-whyte text-base bg-transparent p-4 rounded-md border-1 w-full ${
            errors?.[`${name}`]?.message ? "border-red-error" : "border-gray-24"
          } focus:border-blue-navy outline-none text-white hover:border-gray-syn3`}
          name={name}
          {...field}
          type="text"
          placeholder={placeholder}
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
        <p className="text-red-error font-whyte text-sm pt-2">
          {errors?.[`${name}`]?.message}
        </p>
      ) : (
        info && <p className="text-sm mt-2 text-gray-syn3 font-whyte">{info}</p>
      )}{" "}
    </div>
  );
};
