import { PillButton } from '@/components/pillButtons';
import { MouseEvent, MutableRefObject } from 'react';
import { InputField } from '../inputField';

export const InputFieldWithAddOn = (props: {
  forwardRef?: MutableRefObject<HTMLInputElement> | null;
  value?: string;
  placeholderLabel?: string;
  infoLabel?: string | React.ReactElement;
  isInErrorState?: boolean;
  extraClasses?: string;
  addOn: string | JSX.Element;
  isButtonActive?: boolean;
  hideButton?: boolean;
  disabled?: boolean;
  addOnOnClick?: (e: MouseEvent<HTMLElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  symbol?: string;
}): React.ReactElement => {
  const {
    forwardRef,
    value,
    placeholderLabel,
    infoLabel,
    isInErrorState = false,
    extraClasses = '',
    addOn,
    isButtonActive = false,
    hideButton = false,
    addOnOnClick,
    onChange,
    onFocus,
    symbol,
    disabled,
    ...rest
  } = props;

  return (
    <>
      <div className="relative">
        <InputField
          ref={forwardRef}
          value={value}
          placeholderLabel={placeholderLabel}
          isInErrorState={isInErrorState}
          extraClasses={extraClasses}
          onChange={onChange}
          disabled={disabled}
          onFocus={onFocus}
          {...rest}
        />
        {!hideButton && (
          <div
            className="inline-flex items-center space-x-4 absolute top-1/2 right-4"
            style={{ transform: 'translateY(-50%)' }}
          >
            {typeof addOn === 'string' ? (
              <PillButton
                isActive={isButtonActive}
                onClick={(e: React.MouseEvent<HTMLElement>): void => {
                  if (addOnOnClick) addOnOnClick(e);
                }}
              >
                {addOn}
              </PillButton>
            ) : (
              <button onClick={addOnOnClick}>{addOn}</button>
            )}
            {symbol && <div className="text-white">{symbol}</div>}
          </div>
        )}
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
