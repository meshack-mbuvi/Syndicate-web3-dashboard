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
  handlePriceToJoinChange: (newPriceToJoin: number) => void;
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
              Number(temporaryInputFieldValues.priceToJoin.slice(0, -1))
            ) + '.'
          : priceToJoin
          ? numberWithCommas(priceToJoin)
          : ''
      }
      handleTokenClick={handleClickToChangeToken}
      onChange={(e) => {
        const amount = stringNumberRemoveCommas(e.target.value);
        if (isStringIncompleteDecimalNumber(amount)) {
          setTemporaryInputFieldValues({
            ...temporaryInputFieldValues,
            priceToJoin: amount
          });
        } else {
          if (Number(amount)) {
            handlePriceToJoinChange(Number(amount));
          } else if (amount === '') {
            handlePriceToJoinChange(null);
          }
          setTemporaryInputFieldValues({
            maxPerWallet: null,
            priceToJoin: null
          });
        }
      }}
      placeholderLabel="0.0"
      extraClasses={extraClasses}
      symbolDisplayVariant={SymbolDisplay.LOGO_AND_SYMBOL}
      depositTokenSymbol={tokenDetails.symbol}
      depositTokenLogo={tokenDetails.icon}
    />
  );
};