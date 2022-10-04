import { isEmpty } from 'lodash';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import ClearIcon from '/public/images/close-circle.svg';

interface IProps {
  label?: string;
  name?: string;
  placeholder?: string;
  info?: any;
  control: any;
  addOn?: string;
  column?: boolean;
  borderStyles?: string;
  paddingStyles?: string;
  borderOutline?: boolean;
  textAlignment?: string;
  cornerHint?: {
    text: string | any;
    textColor?: string;
  };
  disabled?: boolean;
  style?: any;
  required?: boolean;
  autoFocus?: boolean;
  showWarning?: boolean;
  warningText?: string;
  showClearIcon?: boolean;
  defaultValue?: string;
}
/**
 * An input component with label and icon at the right end
 * If the input is disable, the input field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */
export const TextField: React.FC<IProps> = ({
  control,
  name,
  placeholder,
  info,
  addOn,
  cornerHint,
  borderStyles = '',
  column = false,
  label = '',
  borderOutline = true,
  textAlignment = '',
  paddingStyles = 'p-4',
  disabled = false,
  required = true,
  autoFocus = false,
  showWarning = false,
  warningText = '',
  showClearIcon = false,
  defaultValue = ''
}) => {
  const {
    field: { value, ...fieldAttributes },
    formState: { errors }
  } = useController({
    // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to typ... Remove this comment to see the full error message
    name,
    control,
    rules: { required },
    defaultValue
  });

  const [showValidation, setShowValidation] = useState(false);

  const handleOnFocus = () => {
    setShowValidation(false);
  };

  const handleOnBlur = () => {
    setShowValidation(true);
  };

  const handleClear = () => {
    fieldAttributes.onChange('');
  };

  useEffect(() => {
    return () => {
      fieldAttributes.onChange(defaultValue);
    };
  }, []);

  return (
    <div
      className={`flex ${borderStyles} ${
        column ? 'flex-row justify-between' : 'flex-col justify-center'
      } w-full`}
    >
      <div
        className={`flex justify-between ${column ? 'w-2/5 my-auto' : 'mb-2'}`}
      >
        {label ? <div className="leading-5">{label}</div> : null}
        {!isEmpty(cornerHint) ? (
          <div
            className={`${cornerHint?.textColor || 'text-gray-syn10'} text-sm`}
          >
            {cornerHint?.text}
          </div>
        ) : null}
      </div>
      <div className="relative flex-grow">
        <input
          className={`block font-whyte text-base ${textAlignment} bg-transparent ${paddingStyles} rounded-md w-full ${
            errors?.[`${name}`]?.message
              ? 'border-red-error'
              : `${
                  borderOutline
                    ? 'border-1 border-gray-24 hover:border-gray-syn3'
                    : 'border-0 focus:outline-none focus:ring-0 outline-none hover:border-0 ring-0'
                }`
          }  text-white placeholder-gray-syn5`}
          // @ts-expect-error TS(2783): 'name' is specified more than once, so this usage ... Remove this comment to see the full error message
          name={name}
          {...fieldAttributes}
          value={value}
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus}
        />
        {addOn && (
          <div
            className={`absolute inset-y-0 right-0 pr-4 py-4 flex items-center `}
          >
            <span
              className={`font-whyte text-base ${
                value ? 'text-white' : 'text-gray-syn5'
              }`}
              id="price-currency"
            >
              {addOn}
            </span>
          </div>
        )}

        {showClearIcon && value ? (
          <div
            className={`absolute inset-y-0 right-0 pr-4 py-4 flex items-center `}
          >
            <button onClick={handleClear}>
              <Image src={ClearIcon} height={16} width={16} />
            </button>
          </div>
        ) : undefined}
      </div>

      {showValidation &&
      (errors[`${name}`]?.message || (showWarning && warningText)) ? (
        errors[`${name}`]?.message ? (
          <p className="text-red-error font-whyte text-sm mt-2">
            {errors?.[`${name}`]?.message}
          </p>
        ) : showWarning && warningText ? (
          <p className="text-sm text-yellow-semantic mt-2">{warningText}</p>
        ) : undefined
      ) : (
        info && <p className="text-sm mt-2 text-gray-syn3 font-whyte">{info}</p>
      )}
    </div>
  );
};
