import { useState } from 'react';
import { InputField } from '../inputField';

export const InputFieldWithTime = (props: {
  value?: string;
  placeholderLabel?: string;
  infoLabel?: string | React.ReactElement;
  isInErrorState?: boolean;
  extraClasses?: string;
  onChange: (e: any) => void;
  onFocus?: (e: any) => void;
}): React.ReactElement => {
  const {
    value,
    placeholderLabel = 'Unlimited',
    infoLabel,
    isInErrorState = false,
    extraClasses = '',
    onChange,
    onFocus,
    ...rest
  } = props;
  const [convertToTypeTimeAfterFocus, setConvertToTypeTimeAfterFocus] =
    useState(false);
  return (
    <>
      <div className="relative w-full">
        <InputField
          value={value}
          placeholderLabel={placeholderLabel}
          isInErrorState={isInErrorState}
          extraClasses={extraClasses}
          onChange={onChange}
          type={`${convertToTypeTimeAfterFocus ? 'time' : 'text'}`}
          onFocus={
            onFocus
              ? onFocus
              : () => {
                  setConvertToTypeTimeAfterFocus(true);
                }
          }
          {...rest}
        />
      </div>
      {infoLabel && (
        <div
          className={`text-sm mt-2 ${
            isInErrorState ? 'text-red-error' : 'text-gray-syn4'
          }`}
        >
          {infoLabel}
        </div>
      )}
    </>
  );
};
