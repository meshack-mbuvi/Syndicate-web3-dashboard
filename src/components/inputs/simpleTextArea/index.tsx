import React from 'react';

interface Props {
  value: string;
  handleValueChange: (input: string) => void;
  placeholderLabel?: string;
  helperText?: string;
  widthClass: string;
  heightRows?: number;
  isInErrorState?: boolean;
}

export const TextArea: React.FC<Props> = ({
  value,
  handleValueChange,
  placeholderLabel,
  helperText,
  widthClass,
  heightRows = 5,
  isInErrorState = false
}) => {
  const errorStyles = `${
    isInErrorState ? 'border-red-error' : 'border-gray-24'
  }`;
  const inputStyles = `bg-transparent p-4 rounded-md border-1 focus:border-blue-navy outline-none text-white hover:border-gray-syn3 transition-all ease-out`;

  return (
    <div>
      <textarea
        className={`${widthClass} ${inputStyles} ${errorStyles}`}
        rows={heightRows}
        value={value}
        onChange={(e) => {
          console.log(e.target.value);
          handleValueChange(e.target.value);
        }}
        placeholder={placeholderLabel}
      />
      {helperText && (
        <div className={`text-sm text-gray-syn4 ${errorStyles}`}>
          {helperText}
        </div>
      )}
    </div>
  );
};
