export enum InputFieldStyle {
  REGULAR = "REGULAR",
  MODAL = "MODAL",
}

export const InputField = (props: {
  value?: string;
  placeholderLabel?: string;
  infoLabel?: string;
  isInErrorState?: boolean;
  icon?: string;
  style?: InputFieldStyle;
  extraClasses?: string;
  onChange?: (e) => void;
  onKeyDown?: (e) => void;
}): React.ReactElement => {
  const {
    value,
    placeholderLabel,
    infoLabel,
    isInErrorState = false,
    icon,
    style = InputFieldStyle.REGULAR,
    extraClasses = "",
    onChange,
    ...rest
  } = props;

  let errorStyles;
  let inputStyles;

  switch (style) {
    case InputFieldStyle.REGULAR:
      errorStyles = `${isInErrorState ? "border-red-error" : "border-gray-24"}`;
      inputStyles = `bg-transparent p-4 rounded-md border-1 focus:border-blue-navy outline-none text-white hover:border-gray-syn3`;
      break;
    case InputFieldStyle.MODAL:
      errorStyles = `${isInErrorState ? "border-red-error" : "border-gray-24"}`;
      inputStyles = `p-4 bg-gray-syn7 rounded-md`;
      break;
  }

  return (
    <>
      <div className="relative">
        {icon && (
          <div
            className="absolute border-blue-500 border-opacity-50 w-6 ml-3 top-1/2"
            style={{ transform: "translateY(-50%)" }}
          >
            <img src={icon} alt="icon" className="mx-auto" />
          </div>
        )}
        <input
          className={`block font-whyte text-base focus:outline-none text-white ${inputStyles} ${errorStyles} ${
            icon && "pl-11"
          } w-full ${extraClasses}`}
          placeholder={placeholderLabel}
          value={value}
          onChange={onChange}
          {...rest}
        />
      </div>
      {infoLabel && (
        <div
          className={`text-sm mt-2 ${
            isInErrorState ? "text-red-error" : "text-gray-syn2"
          }`}
        >
          {infoLabel}
        </div>
      )}
    </>
  );
};
