/** helper function to insert commas into amounts.
 * @param number number to be formatted
 * @returns formatted number as a string
 * */
export const numberWithCommas = (number: string | number): string => {
  if (!number) return "0";

  // Don't group decimal part
  const [wholePart, decimalPart] = number.toString().split(".");

  return (
    wholePart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    `${decimalPart ? `.${decimalPart}` : ""}`
  );
};

// add two decimal places
export const floatedNumberWithCommas = (number): string => {
  if (!number || number === "NaN") {
    return "0";
  }

  // return this for values smaller than 0.01 since we use 2dp
  if (number < 0.01 && number > 0) {
    return "< 0.01";
  }

  // do not show decimal points if there are only zeros after the decimal point.
  // applying this across the app following this ticket: https://linear.app/syndicate/issue/ENG-2288/implement-header-section-updates
  if (number.toString().indexOf(".") < 0) {
    return numberWithCommas(number.toString());
  }

  try {
    // avoid rounding up the number when converting to 2 decimal places
    const numberTo2decimalsWithoutRoundingUp = number
      .toString()
      .match(/^-?\d+(?:\.\d{0,4})?/)[0];
    return numberWithCommas(numberTo2decimalsWithoutRoundingUp).replace(
      ".00",
      "",
    );
  } catch (error) {
    return "0";
  }
};

export const numberInputRemoveCommas = (
  event: React.ChangeEvent<HTMLInputElement>,
) => {
  let newVal;
  const { value } = event.target;
  newVal = value;
  const [beforeDecimal, afterDecimal] = value.split(".");
  if (afterDecimal && afterDecimal.length > 2) {
    newVal = beforeDecimal + "." + afterDecimal.slice(0, 2);
  }

  // check and remove leading zeroes if not followed by a decimal point
  if ( newVal.length > 1 && newVal.charAt(0) === "0" && newVal.charAt(1) !== "."){
    newVal = newVal.slice(1)
  }
  // remove commas from big numbers before we set state
  return newVal.replace(/,/g, "");
};

export const truncateDecimals = (
  inputNumber: number,
  digits: number,
): number => {
  const fact = 10 ** digits;
  return Math.floor(inputNumber * fact) / fact;
};
