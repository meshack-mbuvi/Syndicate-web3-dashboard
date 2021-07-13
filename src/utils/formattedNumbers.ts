const thousand = 1000;
const million = 1000000;
const billion = 1000000000;
const trillion = 1000000000000;
const quadrillion = trillion * 1000;

/** helper function to insert commas into amounts.
 * @param number number to be formatted
 * @returns formatted number as a string
 * */
export const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// add two decimal places
export const floatedNumberWithCommas = (number) => {
  if (!number) {
    return numberWithCommas(parseFloat("0".toString()).toFixed(2));
  }
  return numberWithCommas(parseFloat(number.toString()).toFixed(2));
};

/**
 * This method formats a given value to add symbols for thousand(K),
 * million(M), billion(B) and trillion(T) etc.
 * @param number
 * @returns
 */
var SI_SYMBOL = ["", "k", "M", "B", "T", "P", "E"];

export const formatNumbers = (number) => {
  // what tier? (determines SI symbol)
  var tier = (Math.log10(Math.abs(number)) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier == 0) return number;

  // get suffix and determine scale
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);

  // scale the number
  var scaled = number / scale;

  // format number and add suffix
  return scaled.toFixed(1) + suffix;
};

