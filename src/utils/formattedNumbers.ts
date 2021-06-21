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
 * million(M), billion(B) and trillion(T).
 * @param number
 * @returns
 */
export const formatNumbers = (number) => {
  if (!number) return;

  let formattedNumber = "";
  if (number > quadrillion) {
    formattedNumber = `${Math.round(number / quadrillion)} P`;
  } else if (number > trillion) {
    formattedNumber = `${Math.round(number / trillion)} T`;
  } else if (number > billion) {
    formattedNumber = `${Math.round(number / billion)} B`;
  } else if (number > million) {
    formattedNumber = `${Math.round(number / million)} M`;
  } else if (number > thousand) {
    formattedNumber = `${Math.round(number / thousand)} K`;
  } else {
    formattedNumber = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return formattedNumber;
};
