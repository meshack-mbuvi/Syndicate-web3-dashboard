import { InputField } from '@/components/inputs/inputField';
import { useState } from 'react';

interface Props {
  nameValue: string;
  handleNameChange: (input: string) => void;
  tokenSymbolValue: string;
  handleTokenSymbolChange: (input: string) => void;
  extraClasses?: string;
}

export const InputFieldsNameAndSymbol: React.FC<Props> = ({
  nameValue,
  handleNameChange,
  tokenSymbolValue,
  handleTokenSymbolChange,
  extraClasses
}) => {
  const isTokenSymbolAlphanumeric = (symbol: string) => {
    return symbol.match(/^[0-9a-zA-Z]+$/) || symbol === '';
  };

  const isTokenSymbol10CharsOrLess = (symbol: string) => {
    return symbol.length <= 10;
  };

  const validateSymbol = (symbol: string) => {
    return (
      (isTokenSymbolAlphanumeric(symbol) &&
        isTokenSymbol10CharsOrLess(symbol)) ||
      symbol === ''
    );
  };

  const generateSymbolError = (symbol: string) => {
    return !isTokenSymbolAlphanumeric(symbol)
      ? 'Only numbers and letters allowed'
      : !isTokenSymbol10CharsOrLess(symbol)
      ? 'Up to 10 characters allowed'
      : null;
  };

  const [symbolError, setSymbolError] = useState(null);

  return (
    <div className={`flex space-x-5 ${extraClasses}`}>
      <div className="w-2/3">
        <div className="mb-2">Name</div>
        <InputField
          value={nameValue}
          placeholderLabel="Name of collective"
          onChange={(e) => {
            const input = e.target.value;
            handleNameChange(input);
          }}
        />
      </div>
      <div className="w-1/3">
        <div className="mb-2">Token symbol</div>
        <InputField
          value={tokenSymbolValue ? `✺ ${tokenSymbolValue}` : tokenSymbolValue}
          placeholderLabel="✺ e.g. ABC"
          onChange={(e) => {
            const input: string = e.target.value;
            const value = input.length > 1 ? input.substring(2) : input; // remove the burst symbol
            if (validateSymbol(value)) {
              handleTokenSymbolChange(value.toUpperCase());
              setSymbolError(null);
            } else {
              setSymbolError(generateSymbolError(value));
            }
          }}
          isInErrorState={symbolError} // alphanumeric and <= 10 charcters
          infoLabel={symbolError}
        />
      </div>
    </div>
  );
};
