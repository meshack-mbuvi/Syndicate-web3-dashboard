import {
  InputFieldWithToken,
  SymbolDisplay
} from '@/components/inputs/inputFieldWithToken';
import { isStringIncompleteDecimalNumber } from '@/helpers/strings';
import {
  numberWithCommas,
  stringNumberRemoveCommas
} from '@/utils/formattedNumbers';
import { useState } from 'react';

interface Props {
  priceToJoin: number;
  handlePriceToJoinChange: (newPriceToJoin: number | string) => void;
  tokenDetails?: { symbol: string; icon: string };
  handleClickToChangeToken: () => void;
  extraClasses?: string;
}

export const InputFieldPriceToJoin: React.FC<Props> = ({
  priceToJoin,
  handlePriceToJoinChange,
  tokenDetails,
  handleClickToChangeToken,
  extraClasses
}) => {
  // Using this to temporarily store the input allows the user to input periods for decimal numbers.
  // Instead of stripping the character off onChange when converting the string to a number, e.g Number("3.") -> 3
  // which prevents the user from typing a period.
  const [temporaryInputFieldValues, setTemporaryInputFieldValues] = useState({
    maxPerWallet: null,
    priceToJoin: null
  });

  return (
    <InputFieldWithToken
      value={
        temporaryInputFieldValues.priceToJoin
          ? numberWithCommas(
              // @ts-expect-error TS(2339): Property 'slice' does not exist on type 'never'.
              Number(temporaryInputFieldValues.priceToJoin.slice(0, -1))
            ) + '.'
          : priceToJoin || priceToJoin === 0
          ? numberWithCommas(priceToJoin)
          : ''
      }
      handleTokenClick={handleClickToChangeToken}
      onChange={(e) => {
        const amount = stringNumberRemoveCommas(e.target.value);
        if (isStringIncompleteDecimalNumber(amount)) {
          setTemporaryInputFieldValues({
            ...temporaryInputFieldValues,
            // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'null'.
            priceToJoin: amount
          });
        } else {
          if (Number(amount) || Number(amount) === 0) {
            handlePriceToJoinChange(amount);
          } else if (amount === '') {
            // @ts-expect-error TS(2345): Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
            handlePriceToJoinChange(null);
          } else if (amount === '.') {
            handlePriceToJoinChange('0.');
          }
          setTemporaryInputFieldValues({
            maxPerWallet: null,
            priceToJoin: null
          });
        }
      }}
      placeholderLabel="0"
      extraClasses={extraClasses}
      symbolDisplayVariant={SymbolDisplay.LOGO_AND_SYMBOL}
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      depositTokenSymbol={tokenDetails.symbol}
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      depositTokenLogo={tokenDetails.icon}
    />
  );
};
