import React from "react";
import { useController } from "react-hook-form";

/**
 * An textarea component with label and icon at the right end
 * If the textarea is disable, the textarea field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */

interface ITextAreaProps {
  label?: string;
  id?: string;
  classOverride?: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  customHoverBorder?: string;
  control: any;
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSelect?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const TextArea: React.FC<ITextAreaProps> = (props) => {
  const {
    label,
    id,
    name,
    rows = 4,
    customHoverBorder,
    control,
    disabled = false,
    classOverride = "",
    ...rest
  } = props;

  const {
    field,
    formState: { errors },
  } = useController({
    name,
    control,
    defaultValue: "",
  });

  const disabledClasses = disabled
    ? "text-gray-500 border-0"
    : "text-black border-gray-24";

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 ">
        {label ? <div className="leading-5">{label}</div> : null}
      </div>
      <textarea
        id={id}
        name={name}
        {...field}
        className={`text-input-placeholder text-white font-whyte border border-gray-french rounded-lg w-full py-3 px-4 focus:border-blue bg-transparent ${
          customHoverBorder
            ? customHoverBorder
            : "hover:border-white hover:border-opacity-70"
        } ${disabledClasses} ${classOverride}`}
        {...rest}
        rows={rows}
        cols={50}
        disabled={disabled}
      ></textarea>
      {errors?.[`${name}`]?.message ? (
        <p className="text-red-error text-sm break-all -mt-1">
          {errors?.[`${name}`]?.message}
        </p>
      ) : null}
    </div>
  );
};
