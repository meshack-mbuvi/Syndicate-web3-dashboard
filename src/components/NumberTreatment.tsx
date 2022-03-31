import React from "react";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";

const NumberTreatment: React.FC<{
  numberValue: string;
  noUSDValue?: boolean;
  nativeDepositToken?: boolean;
}> = ({ numberValue, noUSDValue, nativeDepositToken }) => {
  const [wholeNumberValue, decimalValue] = floatedNumberWithCommas(
    numberValue,
    nativeDepositToken ?? false
  ).split('.');

  const isColourReversed =
    parseInt(wholeNumberValue) == 0 && parseInt(decimalValue) > 0;
  return (
    <>
      <span className={isColourReversed ? 'text-gray-syn4' : undefined}>
        {noUSDValue ? '-' : wholeNumberValue}
      </span>
      {decimalValue && (
        <span className={isColourReversed ? 'text-white' : 'text-gray-syn4'}>
          .{decimalValue}
        </span>
      )}
    </>
  );
};

export default NumberTreatment;
