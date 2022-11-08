/** Validate ABI inputs
 * @param input
 * @param scale multiply the image size
 * */

import { isBoolean } from 'lodash';
import { AbiInput, isAddress } from 'web3-utils';
import { BigNumber } from 'ethers';

/**
 * Partially handles validating inputs
 * TODO [REMIX]: [PRO2-78] confirm if it encompasses all potential input types for abis
 * @param inputValue
 * @param inputType
 * @returns
 */
export const validateInput = (
  inputValue: string,
  inputType: string
): boolean => {
  switch (inputType) {
    case 'address':
      return isAddress(inputValue);
    case inputType.startsWith('uint') ? inputType : '':
      try {
        return BigNumber.isBigNumber(BigNumber.from(inputValue));
      } catch {
        return false;
      }
    case 'bool':
      return isBoolean(inputValue);
    case 'string':
      return true;
    default:
      return false;
  }
};

export const validateInputs = (
  inputValues: string[],
  inputs?: AbiInput[]
): boolean => {
  if (inputs?.length !== inputValues?.length) {
    return false;
  }

  for (let i = 0; i < inputs.length; i++) {
    const type = inputs[i].type;
    if (type.endsWith('[]')) {
      const inpArr = inputValues[i].split(',');
      const arrInvalid = inpArr.some(
        (i) => validateInput(i, type.slice(0, -2)) === false
      );
      if (arrInvalid) {
        return arrInvalid;
      }
    } else {
      const isValid = validateInput(inputValues[i], type);
      if (!isValid) {
        return isValid;
      }
    }
  }
  return true;
};
