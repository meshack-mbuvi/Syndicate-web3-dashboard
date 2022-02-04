import React from "react";
import { useController } from "react-hook-form";

interface IProps {
  label?: string;
  name?: string;
  control: any;
}

export const Checkbox: React.FC<IProps> = ({ control, name, label }) => {
  const { field } = useController({
    name,
    control,
    defaultValue: false,
  });

  return (
    <div className={`flex justify-center w-full flex-col`}>
      <div className="relative">
        <label className="flex-row flex items-center pt-4">
          <input
            type="checkbox"
            className="bg-transparent rounded focus:ring-offset-0"
            checked={field.value}
            {...field}
          />
          <span className="pl-4">{label}</span>
        </label>
      </div>
    </div>
  );
};
