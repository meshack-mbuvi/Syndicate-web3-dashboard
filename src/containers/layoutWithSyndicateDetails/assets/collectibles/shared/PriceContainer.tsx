import React from "react";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";

const PriceContainer: React.FC<{
  numberValue: string;
  children?: React.ReactNode;
}> = ({ numberValue, children }) => {
  const [wholeNumberValue, decimalValue] =
    floatedNumberWithCommas(numberValue).split(".");
  const isColourReversed =
    parseInt(wholeNumberValue) == 0 && parseInt(decimalValue) > 0;
  return (
    <div className="text-base flex col-span-3 items-center">
      <span className={isColourReversed ? "text-gray-syn4" : undefined}>
        {wholeNumberValue}
      </span>
      {decimalValue && (
        <span className={isColourReversed ? "text-white" : "text-gray-syn4"}>
          .{decimalValue}
        </span>
      )}
      {children}
    </div>
  );
};

export default PriceContainer;
