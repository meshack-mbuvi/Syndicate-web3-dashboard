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
  } else if (!regex.test(value)) {
    message = "can only include at most two decimal places.";
  } else {
    message = "";
  }
  return message;
};