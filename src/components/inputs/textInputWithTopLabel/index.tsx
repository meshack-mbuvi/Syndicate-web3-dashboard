import React, { useState } from "react";

interface IProps {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}

export const TextInputWithTopLabel: React.FC<IProps> = ({
  label,
  name,
  type="text",
  placeholder
}) => {
  const [value, setValue] = useState("");

  return (
    <div className="my-2.5">
      <label className="text-base" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        className={`flex w-full min-w-0 py-4 mt-2 font-whyte text-lg rounded-md bg-gray-9 border border-gray-24 focus:border-blue text-white focus:outline-none focus:ring-gray-24 flex-grow`}
      />
    </div>
  )
};
