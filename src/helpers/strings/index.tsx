// This returns true if the inputted string is a valid number with a period at the end
export const isStringIncompleteDecimalNumber = (strNumber: any) => {
  return (
    !isNaN(Number(strNumber)) &&
    strNumber.includes('.') &&
    (strNumber[strNumber.length - 1] === '.' ||
      strNumber[strNumber.length - 1] === '0') // last character
  );
};

export const isLastCharAPeriod = (strNumber: any) => {
  return strNumber[strNumber.length - 1] === '.';
};

export const isLastCharAZero = (strNumber: any) => {
  return strNumber[strNumber.length - 1] === '0';
};
