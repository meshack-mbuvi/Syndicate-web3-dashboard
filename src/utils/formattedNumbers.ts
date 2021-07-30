/** helper function to insert commas into amounts.
 * @param number number to be formatted
 * @returns formatted number as a string
 * */
export const numberWithCommas = (number: string): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// add two decimal places
export const floatedNumberWithCommas = (number): string => {
  if (!number || number === "NaN") {
    return numberWithCommas(parseFloat("0".toString()).toFixed(2));
  }

  try {
    // avoid rounding up the number when converting to 2 decimal places
    const numberTo2decimalsWithoutRoundingUp = number
      .toString()
      .match(/^-?\d+(?:\.\d{0,2})?/)[0];
    return numberWithCommas(numberTo2decimalsWithoutRoundingUp);
  } catch (error) {
    return numberWithCommas(parseFloat("0".toString()).toFixed(2));
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
