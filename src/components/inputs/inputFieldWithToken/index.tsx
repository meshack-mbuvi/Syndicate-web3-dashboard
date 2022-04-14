import { InputField } from '../inputField';

export enum TokenType {
  USDC = 'USDC',
  ETH = 'ETH'
}

export const InputFieldWithToken = (props: {
  value?: string;
  placeholderLabel?: string;
  infoLabel?: string | React.ReactElement;
  isInErrorState?: boolean;
  depositTokenLogo?: string;
  depositTokenSymbol?: string;
  extraClasses?: string;
  onChange: (e) => void;
  showClubSymbol?: boolean;
  symbol?: string;
}): React.ReactElement => {
  const {
    value,
    placeholderLabel = 'Unlimited',
    infoLabel,
    isInErrorState = false,
    depositTokenLogo = '',
    depositTokenSymbol = '',
    extraClasses = '',
    onChange,
    showClubSymbol,
    symbol,
    ...rest
  } = props;

  const TokenSymbolandIcon = () => {
    return (
      <div className="flex justify-center items-center">
        <div className="mr-2 flex items-center justify-center">
          <img src={depositTokenLogo} width={20} height={20} alt="token icon" />
        </div>
        <div className="uppercase text-gray-syn3">
          <span>{depositTokenSymbol}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative">
        <InputField
          value={value}
          placeholderLabel={placeholderLabel}
          isInErrorState={isInErrorState}
          extraClasses={extraClasses}
          onChange={onChange}
          {...rest}
        />
        <div
          className="inline absolute top-1/2 right-4"
          style={{ transform: 'translateY(-50%)' }}
        >
          {showClubSymbol ? symbol : <TokenSymbolandIcon />}
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
