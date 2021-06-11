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
      className="ml-2 focus:ring-blue cursor-pointer h-5 w-5 text-blue border-blue rounded-full"
      checked={value ? true : false}
    />
  );
};
