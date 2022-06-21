// This returns true if the inputted string is a valid number with a period at the end
export const isStringIncompleteDecimalNumber = (strNumber) => {
  return (
    !isNaN(Number(strNumber) && strNumber.includes('.')) &&
    strNumber[strNumber.length - 1] === '.'
  );
};
