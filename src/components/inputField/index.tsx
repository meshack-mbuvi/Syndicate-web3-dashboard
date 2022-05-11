export const InputField = (props: {
  value: string;
  placeholder: string;
  extraClasses: string;
  onChange: (e) => void;
}): React.ReactElement => {
  const { value, placeholder, extraClasses = '', onChange } = props;

  return (
    <input
      className={`block font-whyte text-base bg-transparent p-4 rounded-md border-1 w-full border-gray-24 focus:border-blue-navy outline-none text-white hover:border-gray-syn3 ${extraClasses}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};
