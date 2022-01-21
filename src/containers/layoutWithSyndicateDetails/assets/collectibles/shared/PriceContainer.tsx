import React from "react";

const PriceContainer: React.FC<{
  wholeNumberValue: string;
  decimalValue: string;
  ethValue?: boolean;
  customSymbol?: any;
}> = ({
  wholeNumberValue,
  decimalValue,
  ethValue = false,
  customSymbol = "USD",
}) => {
  return (
    <div className="text-base flex col-span-3 items-center">
      {wholeNumberValue}
      {decimalValue && (
        <span className="text-gray-lightManatee">.{decimalValue}</span>
      )}
      &nbsp;
      {ethValue ? "ETH" : `${customSymbol}`}
    </div>
  );
};

export default PriceContainer;
