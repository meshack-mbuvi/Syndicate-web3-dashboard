/** helper function to insert commas into amounts.
 * @param num number to be formatted
 * @returns formatted number as a string
 * */
export const numberWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
// add two decimal places
export const floatedNumberWithCommas = (num) => {
  return numberWithCommas(parseFloat(num.toString()).toFixed(2));
};
