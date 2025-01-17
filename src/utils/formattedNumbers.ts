import {
  isLastCharAPeriod,
  isLastCharAZero,
  isStringIncompleteDecimalNumber
} from '@/helpers/strings';

/** helper function to insert commas into amounts.
 * @param number number to be formatted
 * @returns formatted number as a string
 * */
export const numberWithCommas = (number: string | number): string => {
  if (!number) return '0';

  // Don't group decimal part
  const [wholePart, decimalPart] = parseFloat(number.toString())
    .toString()
    .split('.');

  return (
    wholePart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
    `${
      decimalPart
        ? `.${decimalPart}`
        : number.toString().indexOf('.') > -1
        ? '.'
        : ''
    }`
  );
};

// add two decimal places
export const floatedNumberWithCommas = (
  number: any,
  nativeValue = false
): string => {
  if (!number || number === 'NaN') {
    return '0';
  }

  // return this for values smaller than 0.01 since we use 2dp
  // 0.01 is significant for Native deposits. Adding an extra check here.
  if (number < 0.01 && number > 0) {
    if (!nativeValue) {
      return '< 0.01';
    } else {
      return number.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];
    }
  }

  // do not show decimal points if there are only zeros after the decimal point.
  // applying this across the app following this ticket: https://linear.app/syndicate/issue/ENG-2288/implement-header-section-updates
  if (number.toString().indexOf('.') < 0) {
    return numberWithCommas(number.toString());
  }

  try {
    // avoid rounding up the number when converting to 3 decimal places
    // show 4 decimal places for Native values only.
    let numberTo2decimalsWithoutRoundingUp;
    if (nativeValue) {
      numberTo2decimalsWithoutRoundingUp = number
        .toString()
        .match(/^-?\d+(?:\.\d{0,4})?/)[0];
    } else {
      numberTo2decimalsWithoutRoundingUp = number
        .toString()
        .match(/^-?\d+(?:\.\d{0,3})?/)[0];
    }

    // performs a negative look ahead. Finds .00 which does not have a digit (0-9) after it
    return numberWithCommas(numberTo2decimalsWithoutRoundingUp).replace(
      /\.00(?!\d)/g,
      ''
    );
  } catch (error) {
    return '0';
  }
};

export const numberInputRemoveCommas = (
  event: React.ChangeEvent<HTMLInputElement>
): string => {
  let newVal;
  const { value } = event.target;
  newVal = value;

  const [beforeDecimal, afterDecimal] = value.split('.');
  if (afterDecimal && afterDecimal.length > 5) {
    newVal = beforeDecimal + '.' + afterDecimal.slice(0, 5);
  }

  // check and remove leading zeroes if not followed by a decimal point
  if (
    newVal.length > 1 &&
    newVal.charAt(0) === '0' &&
    newVal.charAt(1) !== '.'
  ) {
    newVal = newVal.slice(1);
  }

  // remove commas from big numbers before we set state
  return newVal.replace(/,/g, '');
};

export const stringNumberRemoveCommas = (value: string) => {
  let newVal;
  newVal = value;

  // check and remove leading zeroes if not followed by a decimal point
  if (
    newVal.length > 1 &&
    newVal.charAt(0) === '0' &&
    newVal.charAt(1) !== '.'
  ) {
    newVal = newVal.slice(1);
  }

  // remove commas from big numbers before we set state
  return newVal.replace(/,/g, '');
};

export const numberStringInputRemoveCommas = (input: string) => {
  let newVal;
  newVal = input;
  const [beforeDecimal, afterDecimal] = input.split('.');
  if (afterDecimal && afterDecimal.length > 2) {
    newVal = beforeDecimal + '.' + afterDecimal.slice(0, 2);
  }
  // remove commas from big numbers before we set state
  return newVal.replace(/,/g, '');
};

export const truncateDecimals = (
  inputNumber: number,
  digits: number
): number => {
  const fact = 10 ** digits;
  return Math.floor(inputNumber * fact) / fact;
};

export const removeTrailingDecimalPoint = (value: string): string =>
  value.replace(/\.(?!\d)/g, '');

export const formatCoinDecimals = (
  strAmount: string,
  tokenDecimal = 18
): string => {
  let _sanitizedAmount = strAmount;
  // check whether coin decimals are exceeded.
  const [wholePart, decimalPart] = strAmount.split('.');
  if (decimalPart?.length > +tokenDecimal) {
    _sanitizedAmount =
      wholePart +
      '.' +
      decimalPart.substring(0, +tokenDecimal - 1) +
      Math.floor(+decimalPart[+tokenDecimal - 1]);
  }

  return _sanitizedAmount;
};

export const formatInputValueWithCommas = (inputStringNumber: string) => {
  if (inputStringNumber) {
    // If the input is an incomplete number (e.g 32.0...), manually add
    // the last char so it doesn't get stripped off
    if (isStringIncompleteDecimalNumber(inputStringNumber)) {
      if (isLastCharAPeriod(inputStringNumber)) {
        return numberWithCommas(inputStringNumber);
      } else if (isLastCharAZero(inputStringNumber)) {
        return numberWithCommas(inputStringNumber) + '0';
      }
      return '';
    }
    // It's a normal number, just add commas
    else {
      return numberWithCommas(inputStringNumber);
    }
  } else {
    return '';
  }
};
