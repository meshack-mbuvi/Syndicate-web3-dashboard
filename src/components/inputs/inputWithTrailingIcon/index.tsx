import Image from "next/image";

export const InputWithTrailingIcon = (props: {
  label: string;
  icon: string;
  error: string;
  placeholder: string;
  value: string;
  name: string;
  onChangeHandler: (event) => void;
  handleIconClick: (event) => void;
}): JSX.Element => {
  const {
    label,
    error,
    icon,
    placeholder,
    value,
    name,
    handleIconClick,
    onChangeHandler,
  } = props;
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-base text-white font-whyte leading-5 mb-2"
      >
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          type="text"
          name={name}
          className="flex leading-6 w-full px-5 py-4 font-whyte text-base h-14 bg-transparent rounded-md border border-gray-24 focus:border-blue text-white focus:outline-none focus:ring-gray-24 flex-grow justify-between"
          placeholder={placeholder}
          onChange={onChangeHandler}
          value={value}
        />
        <button
          className="absolute inset-y-0 right-0 pr-5 flex items-center"
          onClick={handleIconClick}
        >
          <Image src={`${icon}`} height="19" width="16" alt="Selector Icon" />
        </button>
      </div>
      <p className="text-red-500 text-xs mt-1 mb-1">{error ? error : ""}</p>
    </div>
  );
};
