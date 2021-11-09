// Format numbers with a white decimal part (or any other preferred styling) and a grayed out decimal part.
import { useEffect, useState } from "react";

export const useGrayDecimalNumber = (
  formattedNumber: string,
  wholeNumberPartStyles?: string,
  decimalPartStyles?: string,
): React.ReactNode => {
  const [grayedNumber, setGrayedNumber] = useState<React.ReactNode>("");

  useEffect(() => {
    if (formattedNumber) {
      const [wholeNumberPart, decimalPart] = formattedNumber
        .toString()
        .split(".");
      setGrayedNumber(
        <>
          <span className={`${wholeNumberPartStyles && wholeNumberPartStyles}`}>
            {wholeNumberPart}
          </span>
          {decimalPart && (
            <span
              className={`${
                decimalPartStyles ? decimalPartStyles : "text-gray-syn4"
              }`}
            >
              {"."}{decimalPart}
            </span>
          )}
        </>,
      );
    }
  }, [formattedNumber]);
  return grayedNumber;
};
