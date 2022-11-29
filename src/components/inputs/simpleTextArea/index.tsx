import React from 'react';

interface Props {
  forwardRef?: React.LegacyRef<HTMLTextAreaElement>;
  value: string;
  handleValueChange: (input: string) => void;
  onFocus?: () => void;
  placeholderLabel?: string;
  helperText?: string;
  widthClass?: string;
  heightRows?: number;
  isInErrorState?: boolean;
}

export const TextArea: React.FC<Props> = ({
  forwardRef,
  value,
  handleValueChange,
  onFocus,
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
        ref={forwardRef}
        className={`${
          widthClass ? widthClass : ''
        } ${inputStyles} ${errorStyles}`}
        rows={heightRows}
        value={value}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder={placeholderLabel}
        onFocus={onFocus}
      />
      {helperText && (
        <div
          className={`text-sm text-gray-syn4 ${errorStyles} ${
            isInErrorState ? 'text-red-error' : ''
          }`}
        >
          {helperText}
        </div>
      )}
    </div>
  );
};
