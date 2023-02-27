import React, { ChangeEvent, ReactNode } from 'react';
import { useController } from 'react-hook-form';
import NumberFormat from 'react-number-format';

interface IProps {
  label?: string;
  name?: string;
  placeholder?: string;
  type?: string;
  info?: string | ReactNode;
  control: any;
  addOn?: string | JSX.Element;
  column?: boolean;
  borderStyles?: string;
  paddingStyles?: string;
  addOnStyles?: string;
  borderOutline?: boolean;
  textAlignment?: string;
  disabled?: boolean;
  defaultValue?: string;
  maximumValue?: number;
  maxButtonEnabled?: boolean;
  thousandSeparator?: boolean;
}
/**
 * An input component with label and icon at the right end
 * If the input is disable, the input field without border, and with grayish
 *  small text is rendered.
 * @param {*} props
 */
export const NumberField: React.FC<IProps> = ({
  control,
  name = '',
  placeholder,
  info,
  addOn,
  addOnStyles = 'pr-20',
  borderStyles = '',
  column = false,
  label = '',
  borderOutline = true,
  textAlignment = '',
  paddingStyles = 'p-4',
  disabled = false,
  defaultValue = '0',
  maximumValue = 0,
  maxButtonEnabled = false,
  thousandSeparator = true
}) => {
  const {
    field: { onChange, ...rest },
    formState: { errors }
  } = useController({
    name,
    control,
    defaultValue
  });

  const handleSetMax = (): void => {
    onChange(maximumValue);
  };

  const disableMax = maximumValue === rest.value;

  return (
    <div
      className={`flex w-full ${borderStyles} ${
        column ? 'flex-row justify-between' : 'flex-col justify-center'
      }`}
    >
      {label ? (
        <div className={`${column ? 'my-auto w-3/5' : 'mb-2'} leading-5`}>
          {label}
        </div>
      ) : null}

      <div className="relative flex-grow">
        <NumberFormat
          {...rest}
          disabled={disabled}
          thousandSeparator={thousandSeparator}
          allowNegative={false}
          className={`block font-whyte text-base ${textAlignment} bg-transparent ${paddingStyles} rounded-md w-full autocomplete-off ${
            errors?.[`${name}`]?.message
              ? 'border-red-error'
              : `${
                  borderOutline
                    ? 'border-1 border-gray-24 hover:border-gray-syn3'
                    : 'border-0 focus:border-0 focus:ring-0 outline-none hover:border-0 ring-0'
                }`
          }  text-white placeholder-gray-syn5 ${
            addOn && maxButtonEnabled
              ? 'pr-40'
              : addOn
              ? addOnStyles
              : paddingStyles
              ? 'pr-0'
              : 'pr-4'
          }`}
          placeholder={placeholder}
          onChange={(event: ChangeEvent<HTMLInputElement>): void => {
            const { value } = event.target;

            onChange(value.replaceAll(',', ''));
          }}
          decimalScale={2}
        />

        <div className={`absolute inset-y-0 right-0 py-4 flex items-center`}>
          <div className="flex space-x-4">
            {maxButtonEnabled === true && (
              <button
                className={`px-4 py-1.5 my-3 text-gray-syn4 bg-gray-syn7 rounded-2xl ${
                  disableMax ? 'cursor-not-allowed' : ''
                }`}
                onClick={handleSetMax}
                disabled={maximumValue === rest.value ? true : false}
              >
                Max
              </button>
            )}

            {addOn && (
              <div
                className={`${
                  addOnStyles ? 'pr-0' : `pr-4`
                } py-4 flex items-center `}
              >
                <span
                  className={`font-whyte text-base ${
                    rest.value ? 'text-white' : 'text-gray-syn5'
                  }`}
                  id="price-currency"
                >
                  {addOn}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {errors?.[`${name}`]?.message ? (
        <p className=" text-red-error text-sm pt-2">
          {errors[`${name}`]?.message}
        </p>
      ) : (
        info && <p className="text-sm mt-2 text-gray-syn3 font-whyte">{info}</p>
      )}
    </div>
  );
};
