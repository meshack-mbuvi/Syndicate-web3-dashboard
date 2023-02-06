import clsx from 'clsx';
import React from 'react';
import { useController } from 'react-hook-form';

interface IProps {
  label?: string;
  name?: string;
  control: any;
  className?: string;
}

export const Checkbox: React.FC<IProps> = ({
  control,
  name,
  label,
  className
}) => {
  const { field } = useController({
    // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
    name,
    control,
    defaultValue: false
  });

  return (
    <div className={`flex justify-center w-full flex-col`}>
      <div className="relative">
        <label className={clsx('flex-row flex items-center', className)}>
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
