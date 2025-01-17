import { ChangeEvent } from 'react';

export const InputField = (props: {
  value: string;
  placeholder: string;
  extraClasses?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}): React.ReactElement => {
  const { value, placeholder, extraClasses = '', onChange } = props;

  return (
    <input
      className={`block text-base bg-transparent p-4 rounded-md border-1 w-full border-gray-24 focus:border-blue-navy outline-none text-white hover:border-gray-syn3 ${extraClasses}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};
