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
    return /^[0-9a-zA-Z]+$/.exec(symbol) || symbol === '';
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
    <div
      className={`md:flex space-y-8 md:space-y-0 md:space-x-5 ${extraClasses}`}
    >
      <div className="md:w-2/3">
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
      <div className="md:w-1/3">
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
              // @ts-expect-error TS(2345): Argument of type '"Only numbers and letters allowe... Remove this comment to see the full error message
              setSymbolError(generateSymbolError(value));
            }
          }}
          // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'boolean | u... Remove this comment to see the full error message
          isInErrorState={symbolError} // alphanumeric and <= 10 charcters
          // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | un... Remove this comment to see the full error message
          infoLabel={symbolError}
        />
      </div>
    </div>
  );
};
