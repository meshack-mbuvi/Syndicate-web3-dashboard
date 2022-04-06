export const InputField = (props: {
  value?: string;
  placeholderLabel?: string;
  infoLabel?: string;
  isInErrorState?: boolean;
  type?: string;
  extraClasses?: string;
  stylingOverride?: string;
  onChange?: (e) => void;
}): React.ReactElement => {
  const {
    value,
    placeholderLabel,
    infoLabel,
    isInErrorState = false,
    type = 'text',
    extraClasses = '',
    stylingOverride,
    onChange,
    ...rest
  } = props;

  return (
    <>
      <input
        className={`block font-whyte text-base bg-transparent w-full ${
          isInErrorState ? 'border-red-error' : 'border-gray-24'
        } ${
          stylingOverride
            ? stylingOverride
            : 'p-4 focus:border-blue-navy rounded-md border-1 outline-none text-white hover:border-gray-syn3'
        } ${extraClasses}`}
        placeholder={placeholderLabel}
        value={value}
        type={type}
        onChange={onChange}
        {...rest}
      />
      {infoLabel && (
        <div
          className={`text-sm mt-2 ${
            isInErrorState ? 'text-red-error' : 'text-gray-syn2'
          }`}
        >
          {infoLabel}
        </div>
      )}
    </>
  );
};
