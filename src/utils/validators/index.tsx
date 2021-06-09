import { web3 } from "../web3Utils";

export const AddressValidator = (value, helpers) => {
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
export const Validate = (value) => {
  const regex = new RegExp(/^\d+(\.\d{0,2})?$/);

  let message = "";
  if (!value.trim()) {
    message = "is required";
  } else if (isNaN(value)) {
    message = "should be a valid decimal/number";
  } else if (value < 0) {
    message = "cannot be a negative number";
  } else if (!regex.test(value)) {
    message = "can only include at most two decimal places.";
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
export const isWholeNumber = (num) => {
  return +num === Math.round(num);
};

export const ValidatePercent = (value) => {
  if (value > 100) return "The percentage value should not exceed 100%";
  if (value < 0) return "The percentage value should not be below than 0%";
};

/**
 * This checks whether the address provided is a zero address.
 * eg: 0x0000000000000000000000000000000000000000
 * @param address
 * @returns boolean indicating the result of the check
 */
export const isZeroAddress = (address: string) => {
  // Checking for address 0x0000000000000000000000000000000000000000;
  // the default value set by solidity
  return /^0x0+$/.test(address);
};

export const validateEmail = (email: string) => {
  const regexp = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
  return regexp.test(email);
};

export const isNewLineChar = (value: string) => /^\n+$/.test(value);

export const removeEnter = (value) => value.replace(/^\s+|\s+$/g, "");

export const removeSpace = (value) => value.replace(/\s/g, "");

/**
 * removes enter character and space character
 * @param data
 * @returns
 */
export const sanitizeInputString = (data) => removeSpace(removeEnter(data));
