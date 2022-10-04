import { SettingsDisclaimerTooltip } from '@/containers/createInvestmentClub/shared/SettingDisclaimer';

/**
 * An input component with label, component to the right, and an icon to the furthest right.
 * @param {*} props
 */
export const InputFieldWithMax = (props: {
  label?: string;
  name?: string;
  id?: string;
  onChange?: any;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  warning?: string;
  required?: boolean;
  value: string | number;
  type?: string;
  addOn?: any;
  extraAddon?: any;
  isNumber?: boolean;
  hasError?: boolean;
  moreInfo?: string | React.ReactNode;
  addSettingDisclaimer?: boolean;
  customClass?: { addon?: string; input?: string };
  className?: string;
}): JSX.Element => {
  const {
    label,
    name,
    id,
    onChange,
    error,
    warning,
    value,
    disabled = false,
    type = 'number',
    addOn,
    customClass,
    moreInfo,
    addSettingDisclaimer,
    className
  } = props;

  return (
    <div className={className}>
      <div className="flex justify-between">
        <label htmlFor={label} className="h3 pb-1">
          {label}
        </label>
      </div>
      <span className="text-sm text-gray-syn4">{moreInfo}</span>
      <div className="flex">
        <div
          className="mt-4 mb-2 flex rounded-md shadow-sm w-full lg:w-full"
          data-tip
          data-for="disclaimer-tip"
        >
          <div className="relative flex items-stretch flex-grow focus-within:z-10">
            <input
              className={`block font-whyte text-base bg-transparent p-4 rounded-md border w-full outline-none text-white ${
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-0'
                  : warning
                  ? 'border-yellow-saffron focus:border-yellow-saffron focus:ring-0'
                  : 'border-gray-24 focus:border-blue-navy hover:border-gray-syn3'
              }`}
              type={type}
              name={name}
              id={id}
              onChange={(event) => {
                onChange(event);
              }}
              value={value}
              min="1"
            />
            {addOn && (
              <div
                className={`absolute inset-y-0 right-0 pr-4 flex items-center `}
              >
                <span
                  className={`font-whyte text-white text-sm ${customClass?.addon}`}
                >
                  {addOn}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {addSettingDisclaimer && (
        <div className="hidden lg:flex pl-4 justify-center items-center w-1/3">
          <SettingsDisclaimerTooltip
            id="disclaimer-tip"
            tip={
              <span>
                Can be modified later via an on-chain <br /> transaction with
                gas
              </span>
            }
          />
        </div>
      )}
      <div className="w-full lg:w-full">
        {(error || warning) && (
          <p
            className={`text-sm ${warning && 'text-yellow-saffron'} ${
              error && 'text-red-500'
            } pt-2`}
          >
            {(error || warning) && !disabled ? error || warning : ''}
          </p>
        )}
      </div>
    </div>
  );
};
