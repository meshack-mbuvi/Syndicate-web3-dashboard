import React from "react";
import NumberTreatment from "@/components/NumberTreatment";

const PriceContainer: React.FC<{
  numberValue: string;
  ethValue?: boolean;
  customSymbol?: any;
  noUSDValue?: boolean;
}> = ({ numberValue, noUSDValue, ethValue = false, customSymbol = "USD" }) => {
  return (
    <div className="text-base md:items-center flex flex-col md:flex-row">
      <div>
        <NumberTreatment numberValue={numberValue} noUSDValue={noUSDValue} />
      </div>
      &nbsp;
      {ethValue ? "ETH" : `${noUSDValue ? "" : customSymbol}`}
    </div>
  );
};

export default PriceContainer;
