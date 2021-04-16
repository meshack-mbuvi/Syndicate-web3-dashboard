import { web3 } from "../web3Utils";

export const AddressValidator = (value, helpers) => {
  console.log({ add: web3.utils.isAddress(value) });
  if (!web3.utils.isAddress(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};
