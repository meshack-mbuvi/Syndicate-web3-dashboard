/** helper function to insert commas into amounts.
 * @param num number to be formatted
 * @returns formatted number as a string
 * */
export const numberWithCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// add two decimal places
export const floatedNumberWithCommas = (num) => {
  if (!num) {
    return numberWithCommas(parseFloat("0".toString()).toFixed(2));
  }
  return numberWithCommas(parseFloat(num.toString()).toFixed(2));
};

export const formatToThousands = (num) => {
  if (!num) return;
  if (num > 1000) {
    return `${Math.round(num / 1000)}k`;
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatToMillion = (num) => {
  if (!num) return;

  if (num > 1000000) {
    return `${Math.round(num / 1000000)}M`;
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
