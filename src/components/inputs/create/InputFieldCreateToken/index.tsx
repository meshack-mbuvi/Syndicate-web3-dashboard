import { InputField } from '@/components/inputs/inputField';
import { useState } from 'react';

const isTokenSymbolAlphanumeric = (symbol: string) => {
  return /^[0-9a-zA-Z]+$/.exec(symbol) || symbol === '';
};

const isTokenSymbol10CharsOrLess = (symbol: string) => {
  return symbol.length <= 10;
};

const validateSymbol = (symbol: string) => {
  return (
    (isTokenSymbolAlphanumeric(symbol) && isTokenSymbol10CharsOrLess(symbol)) ||
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

interface Props {
  tokenSymbolValue: string;
  handleTokenSymbolChange?: (input: string) => void;
}

export const InputFieldCreateToken: React.FC<Props> = ({
  tokenSymbolValue,
  handleTokenSymbolChange
}) => {
  const [symbolError, setSymbolError] = useState(null);

  return (
    <InputField
      value={tokenSymbolValue ? `✺ ${tokenSymbolValue}` : tokenSymbolValue}
      placeholderLabel="✺ e.g. ABC"
      onChange={(e) => {
        const input: string = e.target.value;
        const value = input.length > 1 ? input.substring(2) : input; // remove the burst symbol
        if (validateSymbol(value)) {
          handleTokenSymbolChange
            ? handleTokenSymbolChange(value.toUpperCase())
            : null;
          setSymbolError(null);
        } else {
          // @ts-expect-error TS(2345): Argument of type '"Only numbers and letters allowe... Remove this comment to see the full error message
          setSymbolError(generateSymbolError(value));
        }
      }}
      isInErrorState={symbolError ? true : false} // alphanumeric and <= 10 charcters
      // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | un... Remove this comment to see the full error message
      infoLabel={symbolError}
    />
  );
};
