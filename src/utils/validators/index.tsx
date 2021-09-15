import { web3 } from "../web3Utils";

export const AddressValidator = (
  value: any,
  helpers: { error: (arg0: string) => any },
) => {
  if (!web3.utils.isAddress(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

/**
 * This methods checks whether the provided value is a valid number.
 * To be a valid number, the value should:
 *   - not be an empty string
 *   - be able to be converted to Number
 *   - have atmost 2 decimal places
 * @param value a string number value
 * @returns
 */
export const Validate = (value: string, canBeUnlimited = false): string => {
  const regex = canBeUnlimited
    ? new RegExp(/(^\d+(\.\d{0,2})?$)|^unlimited$/)
    : new RegExp(/^\d+(\.\d{0,2})?$/);

  const isUnlimitedValue =
    canBeUnlimited && value.toLowerCase() === "unlimited";

  // Extra error message for values which can be unlimited
  const extraErrorMessage =
    canBeUnlimited && value.toLowerCase() !== "unlimited"
      ? 'Or "unlimited" text'
      : "";

  let message = "";
  if (!value.toString().toLowerCase().trim()) {
    message = "is required";
  } else if (isNaN(+value) && !isUnlimitedValue) {
    message = `should be a valid decimal/number ${extraErrorMessage}`;
  } else if (+value < 0) {
    message = "cannot be a negative number";
  } else if (!regex.test(value) && !isUnlimitedValue) {
    message = `can only include at most two decimal places if it's a number`;
  } else {
    message = "";
  }
  return message;
};

/**
 *
 * @param num number to check
 * @returns boolean indicating whether the number is a whole number or not
 */
export const isWholeNumber = (num: number): boolean => {
  return +num === Math.round(num);
};

export const ValidatePercent = (value: number, min = 0, max = 100): string => {
  if (value > max) return `Value should not exceed ${max}%`;
  if (value < min) return `Value should not be below ${min}%`;
};

/**
 * This checks whether the address provided is a zero address.
 * eg: 0x0000000000000000000000000000000000000000
 * @param address
 * @returns boolean indicating the result of the check
 */
export const isZeroAddress = (address: string): boolean => {
  // Checking for address 0x0000000000000000000000000000000000000000;
  // the default value set by solidity
  return /^0x0+$/.test(address);
};

export const validateEmail = (email: string): boolean => {
  const regexp = /^[\w.%+-]+@[\w.-]+\.[\w]{2,}$/;
  return regexp.test(email);
};

export const isNewLineChar = (value: string): boolean => /^\n+$/.test(value);

export const removeEnter = (value: string): string =>
  value.replace(/^\s+|\s+$/g, "");

export const removeSpace = (value: string): string => value.replace(/\s/g, "");

export const removeNewLinesAndWhitespace = (value: string): string =>
  value.replace(/\r?\n|\r|\s/g, "");

export const removeSubstring = (
  originalString: string,
  subString: string,
): string => {
  const start = originalString.indexOf(subString);
  return (
    originalString.substr(0, start) +
    originalString.substr(start + subString.length)
  );
};
/**
 * removes enter character and space character
 * @param data
 * @returns
 */
export const sanitizeInputString = (data: string): string =>
  removeSpace(removeEnter(data));
