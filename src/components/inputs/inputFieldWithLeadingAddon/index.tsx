import Image from 'next/image';
import { ChangeEvent, MouseEvent } from 'react';

export type InputWithLeadingAddonProps = {
  label: string;
  icon?: string;
  error: string;
  placeholder?: string;
  value: string;
  addon?: string;
  infoLabel?: string;
  isInErrorState: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleIconClick?: (event: MouseEvent) => void;
  onFocus?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const InputWithLeadingAddon = (
  props: InputWithLeadingAddonProps
): JSX.Element => {
  const {
    // label,
    error,
    icon,
    placeholder = '(e.g. ALDA)',
    value,
    infoLabel,
    isInErrorState,
    addon = '✺',
    handleIconClick,
    onChange,
    onFocus,
    ...rest
  } = props;
  return (
    <div>
      <div className="relative mb-2">
        <span
          className="absolute inset-y-0 left-0 text-3xl pl-4"
          style={{ marginTop: '11.5px' }}
        >
          {addon}
        </span>
        <input
          data-tip
          data-for="change-settings-tip"
          className="text-base bg-transparent leading-6 align-baseline py-4 pl-12 rounded-md border-1 w-full border-gray-24 focus:border-blue-navy outline-none text-white hover:border-gray-syn3"
          placeholder={placeholder}
          value={value}
          onFocus={onFocus}
          onChange={onChange}
          {...rest}
        />
        {icon ? (
          <button
            className="absolute inset-y-0 right-0 pr-5 flex items-center"
            onClick={handleIconClick}
          >
            <Image src={`${icon}`} height="19" width="16" alt="Selector Icon" />
          </button>
        ) : null}
      </div>
      <div className="text-sm">
        {isInErrorState ? (
          <span className="text-red-error text-sm">{error}</span>
        ) : (
          <span className="text-gray-3 text-sm">{infoLabel}</span>
        )}
      </div>
    </div>
  );
};
