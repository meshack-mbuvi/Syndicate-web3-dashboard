/** helper function to insert commas into amounts.
 * @param number number to be formatted
 * @returns formatted number as a string
 * */
export const numberWithCommas = (number: string | Number): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// add two decimal places
export const floatedNumberWithCommas = (number): string => {
  if (!number || number === "NaN") {
    return "0";
  }

  // return this for values smaller than 0.01 since we use 2dp
  if (number < 0.01) {
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
      .match(/^-?\d+(?:\.\d{0,2})?/)[0];
    return numberWithCommas(numberTo2decimalsWithoutRoundingUp).replace('.00', '');
  } catch (error) {
    return "0";
  }
};

/**
 * This method formats a given value to add symbols for thousand(K),
 * million(M), billion(B) and trillion(T) etc.
 * @param number
 * @returns
 */
const SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"];

export const formatNumbers = (number) => {
  // what tier? (determines SI symbol)
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier == 0) return number.toString();

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);

  // scale the number
  const scaled = number / scale;

  // format number and add suffix
  return scaled.toFixed(1) + suffix;
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
