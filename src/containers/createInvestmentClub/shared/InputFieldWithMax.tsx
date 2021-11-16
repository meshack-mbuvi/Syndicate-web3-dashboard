import { SettingsDisclaimerTooltip } from "@/containers/createInvestmentClub/shared/SettingDisclaimer";

/**
 * An input component with label, component to the right, and an icon to the furthest right.
 * @param {*} props
 */
export const InputFieldWithMax = (props: {
  label?: string;
  name?: string;
  id?: string;
  onChange?;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  required?: boolean;
  value: string | number;
  type?: string;
  addOn?: any;
  extraAddon?: any;
  isNumber?: boolean;
  hasError?: boolean;
  moreInfo?: string;
  addSettingDisclaimer?: boolean;
  customClass?: { addon?: string; input?: string };
}): JSX.Element => {
  const {
    label,
    name,
    id,
    onChange,
    error,
    value,
    disabled = false,
    type = "number",
    addOn,
    customClass,
    moreInfo,
    addSettingDisclaimer,
  } = props;

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <label htmlFor={label} className="h3 pb-6">
          {label}
        </label>
      </div>
      <div className="flex">
        <div
          className="mt-1 mb-2 flex rounded-md shadow-sm w-full lg:w-2/3"
          data-tip
          data-for="disclaimer-tip"
        >
          <div className="relative flex items-stretch flex-grow focus-within:z-10">
            <input
              className={`block font-whyte text-base bg-transparent p-4 rounded-md border w-full outline-none text-white ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-0"
                  : "border-gray-24 focus:border-blue-navy hover:border-gray-syn3"
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
      </div>
      <div className="w-full lg:w-2/3">
        {error && (
          <span className="text-sm text-red-500 pt-2">
            {error && !disabled ? error : ""}
          </span>
        )}
        {moreInfo && !error && (
          <span className="text-sm text-gray-3 pt-2">{moreInfo}</span>
        )}
      </div>
    </div>
  );
};
