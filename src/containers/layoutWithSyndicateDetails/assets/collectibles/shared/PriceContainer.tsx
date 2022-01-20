import React from "react";

const PriceContainer: React.FC<{
  wholeNumberValue: string;
  decimalValue: string;
  children?: React.ReactNode;
}> = ({ wholeNumberValue, decimalValue, children }) => {
  return (
    <div className="text-base flex col-span-3 items-center">
      <span
        className={parseInt(wholeNumberValue) <= 0 && `text-gray-lightManatee`}
      >
        {wholeNumberValue}
      </span>
      {decimalValue && (
        <span
          className={parseInt(decimalValue) <= 0 && `text-gray-lightManatee`}
        >
          .{decimalValue}
        </span>
      )}
      {children}
    </div>
  );
};

export default PriceContainer;
