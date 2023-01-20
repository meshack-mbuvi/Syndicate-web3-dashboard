import Image from 'next/image';
import { InputField } from '../inputField';

export enum TokenType {
  USDC = 'USDC',
  ETH = 'ETH'
}

export enum SymbolDisplay {
  ONLY_SYMBOL = 'ONLY_SYMBOL',
  LOGO_AND_SYMBOL = 'LOGO_AND_SYMBOL',
  ONLY_LOGO = 'ONLY_LOGO'
}

export const InputFieldWithToken = (props: {
  forwardRef?: React.ForwardedRef<HTMLInputElement>;
  value?: string;
  placeholderLabel?: string;
  infoLabel?: string | React.ReactElement | null | undefined;
  isInErrorState?: boolean;
  depositTokenLogo?: string;
  depositTokenSymbol?: string;
  extraClasses?: string;
  onChange: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  handleTokenClick?: () => void;
  symbolDisplayVariant?: SymbolDisplay;
  symbolColor?: string;
}): React.ReactElement => {
  const {
    forwardRef,
    value,
    placeholderLabel = 'Unlimited',
    infoLabel,
    isInErrorState = false,
    depositTokenLogo = '/images/token-gray-4.svg',
    depositTokenSymbol = '',
    extraClasses = '',
    onChange,
    onFocus,
    handleTokenClick,
    symbolDisplayVariant,
    symbolColor,
    ...rest
  } = props;

  return (
    <>
      <div className="relative w-full">
        <InputField
          ref={forwardRef}
          value={value}
          placeholderLabel={placeholderLabel}
          isInErrorState={isInErrorState}
          extraClasses={extraClasses}
          onChange={onChange}
          onFocus={onFocus}
          {...rest}
        />
        <div
          className="inline absolute top-1/2 right-4"
          style={{ transform: 'translateY(-50%)' }}
        >
          {symbolDisplayVariant === SymbolDisplay.ONLY_SYMBOL ? (
            <span className={`${symbolColor || ''}`}>{depositTokenSymbol}</span>
          ) : symbolDisplayVariant === SymbolDisplay.ONLY_LOGO ? (
            <div className="relative h-5 w-5">
              {depositTokenLogo && (
                <button onClick={handleTokenClick}>
                  <Image
                    layout="fill"
                    src={depositTokenLogo ?? '/images/token-gray-4.svg'}
                    alt="token icon"
                  />
                </button>
              )}
            </div>
          ) : symbolDisplayVariant === SymbolDisplay.LOGO_AND_SYMBOL ? (
            <button
              onClick={handleTokenClick}
              className={`flex items-center ${
                !handleTokenClick && 'cursor-text'
              }`}
            >
              <div className="mr-2 flex items-center justify-center relative w-5 h-5">
                {depositTokenLogo && (
                  <Image
                    layout="fill"
                    src={depositTokenLogo ?? '/images/token-gray-4.svg'}
                    alt="token icon"
                  />
                )}
              </div>
              <div className="uppercase text-gray-syn3">
                <span>{depositTokenSymbol}</span>
              </div>
            </button>
          ) : null}
        </div>
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
