import { AppState } from '@/state';
import { floatedNumberWithCommas } from '@/utils/formattedNumbers';
import { FC, useState } from 'react';
import { Controller, useForm, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { isUnlimited } from 'src/utils/conversions';
import { formatAddress } from 'src/utils/formatAddress';

/**
 * An editable form component
 * @param {*} props
 */

interface Props {
  label: string;
  defaults: Record<string, any>;
  currency?: boolean;
  percent?: boolean;
  validations?: Record<string, any>;
  showInputIndex: number;
  handleShowInputIndex: () => void;
  index: number;
  depositERC20TokenSymbol: string;
  handler: (value: any) => void;
  address?: boolean;
  type?: string;
  step?: string;
  placeholder?: string;
  handleChange?: (value: any) => void;
  display: boolean;
}
type StringKeys<objType extends Record<string, any>> = Array<
  Extract<keyof objType, string>
>;

export const EditableInput: FC<Props> = (props: Props) => {
  const {
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);

  const {
    label,
    defaults = {},
    currency = false,
    percent = false,
    validations = {},
    showInputIndex,
    handleShowInputIndex,
    index,
    depositERC20TokenSymbol,
    handler,
    address,
    type = 'text',
    step = '',
    placeholder = '',
    handleChange = (value) => value,
    display = true
  } = props;

  const getPercentMargin = (value: string | number): number => {
    let variableWidth = 2.5;
    if (value && value.toString().length > 1) {
      variableWidth = value.toString().length + 1.4;
    }
    return variableWidth;
  };

  const formatCurrency = (value: string): string => {
    if (
      (web3 && isUnlimited(value, web3)) ||
      value.toLowerCase() === 'unlimited'
    ) {
      return 'Unlimited';
    } else {
      return floatedNumberWithCommas(value);
    }
  };

  const [fieldName] = Object.keys(defaults) as StringKeys<typeof defaults>;

  const [showEditButton, setShowEditButton] = useState<boolean>(false);

  const handleShowEditButton = (): void => {
    setShowEditButton(true);
  };

  const handleHideEditButton = (): void => {
    setShowEditButton(false);
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues: { ...defaults }
  });

  const { dirtyFields } = useFormState({
    control
  });

  const watchAllFields = watch();

  const onSubmit = (data: any) => {
    if (dirtyFields[`${fieldName}`]) {
      handler(data[`${fieldName}`]);
      // force reset to update new default value
      reset({ [`${fieldName}`]: data[`${fieldName}`] });
    }
  };

  const defaultValue = currency
    ? `${formatCurrency(defaults[`${fieldName}`])} ${depositERC20TokenSymbol}`
    : percent
    ? `${defaults[`${fieldName}`]} %`
    : address
    ? formatAddress(defaults[`${fieldName}`], 10, 14)
    : defaults[`${fieldName}`];

  const percentMargin = getPercentMargin(watchAllFields[`${fieldName}`]);

  return (
    <>
      {display && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full px-4 flex"
          noValidate
        >
          <div className="flex w-2/5 ">
            <label
              htmlFor="test"
              className="w-full text-right block pt-2 text-black text-sm font-medium mr-6"
            >
              {label}
            </label>
          </div>

          <div className="w-3/5 flex-grow flex flex-col justify-between">
            {/* input field */}
            <div
              className="flex justify-start items-center font-light"
              onMouseEnter={handleShowEditButton}
              onMouseLeave={handleHideEditButton}
            >
              {index === showInputIndex ? (
                <div className="flex flex-grow items-center">
                  <Controller
                    // @ts-expect-error TS(2783): 'name' is specified more than once, so this usage ... Remove this comment to see the full error message
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    name={fieldName}
                    control={control}
                    {...register(fieldName, validations)}
                    render={({ field }) => (
                      <input
                        type={type}
                        className="flex flex-grow text-sm focus:ring-indigo-500 focus:border-indigo-500 rounded-md font-whyte"
                        defaultValue={defaults[`${fieldName}`]}
                        step={step}
                        placeholder={placeholder}
                        {...field}
                        onChange={(event) => {
                          const res = handleChange(event.target.value);
                          field.onChange(res);
                        }}
                      />
                    )}
                  />

                  {percent ? (
                    <span
                      className="flex flex-1 absolute py-2  z-10 text-gray-500 text-sm"
                      style={{
                        marginLeft: `${percentMargin}ch`
                      }}
                    >
                      %
                    </span>
                  ) : null}
                </div>
              ) : (
                <input
                  type="text"
                  disabled
                  className="flex flex-grow border-none py-2 bg-transparent font-whyte"
                  defaultValue={defaultValue}
                />
              )}

              {showEditButton && index !== showInputIndex && (
                <button
                  className="ml-4 rounded-md bg-blue w-auto px-4 py-2 text-white"
                  onClick={handleShowInputIndex}
                >
                  Edit
                </button>
              )}

              {index === showInputIndex && (
                <button
                  type="submit"
                  className={`ml-4 rounded-md bg-blue w-auto px-4 py-2 text-white ${
                    dirtyFields[`${fieldName}`] ? '' : 'opacity-50'
                  }`}
                >
                  Save
                </button>
              )}
            </div>
            <p className="text-red-500 text-xs mt-1 mb-1">
              {index === showInputIndex
                ? errors[`${fieldName}`] && errors[`${fieldName}`]?.message
                : ''}
            </p>
          </div>
        </form>
      )}
    </>
  );
};
