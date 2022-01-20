import React from "react";
import NumberTreatment from "@/components/NumberTreatment";

const PriceContainer: React.FC<{
  numberValue: string;
  ethValue?: boolean;
  customSymbol?: any;
}> = ({ numberValue, ethValue = false, customSymbol = "USD" }) => {
  return (
    <div className="text-base flex col-span-3 items-center">
      <NumberTreatment numberValue={numberValue} />
      &nbsp;
      {ethValue ? "ETH" : `${customSymbol}`}
    </div>
  );
};

export default PriceContainer;
