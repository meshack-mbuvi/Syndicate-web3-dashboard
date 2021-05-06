import React from "react";

export const CheckBox = (props: {
  name: string;
  onChange;
  required?: boolean;
  value: string | number;
}) => {
  const { name, onChange, value } = props;
  return (
    <div className="flex flex-row justify-center">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            name={name}
            onChange={onChange}
            value={value}
            className="ml-2 mt-1 focus:outline-none cursor-pointer h-5 w-5 text-gray-light border-gray-300 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
