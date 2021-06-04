import React from "react";

export const CheckBox = (props: {
  name: string;
  onChange;
  required?: boolean;
  value: boolean;
}) => {
  const { name, onChange, value } = props;
  return (
    <input
      type="checkbox"
      name={name}
      onChange={onChange}
      className="ml-2 focus:ring-indigo-500 cursor-pointer h-5 w-5 text-indigo-500 border-indigo-500 rounded-full"
      checked={value ? true : false}
    />
  );
};
