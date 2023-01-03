import { BigNumber } from 'bignumber.js';
import { fromWei, toWei, Unit, unitMap, Units } from 'web3-utils';

/**
 * Takes an ether and converts it to a javascript number.
 * The basic conversion using bigNumber.toNumber() before division fails because
 * of precision issues with Javscript.(The library can handle upto 53 bits when
 * converting).
 * @param {string} value amount to convert
 * @param {string} tokenFactor result of 10 raised to the power of token decimals
 * @returns { decimal }
 */
export const etherToNumber = (value: string, tokenFactor?: string) =>
  new BigNumber(value)
    .dividedBy(new BigNumber(tokenFactor ? tokenFactor : '1000000000000000000'))
    .toNumber();

/**
 * Takes a javascript number and converts it to a bigNumber.
 *
 * @param {string} value amount to convert
 * @param {string} tokenFactor result of 10 raised to the power of token decimals
 * @returns
 */
export const numberToEther = (value: string, tokenFactor?: string): number =>
  new BigNumber(value)
    .multipliedBy(
      new BigNumber(tokenFactor ? tokenFactor : '1000000000000000000')
    )
    .toNumber();

/**
 * To minimise error margins while passing javascript numbers to solidity, we
 * multiplying them by 1000 before converting to ether. Therefore to convert
 * any value from % to decimal, we just divide by 1000.
 * @param { number } number to be converted
 * @returns {double|float}
 */

/** Every user token amount input or syndicate token value needs to be converted
 * to and from wei amounts depending on the number of
 * decimal places.
 * @param amount string amount to convert
 * @param tokenDecimals number of decimal places for the current token
 * @param multiplication boolean value. can be true(get Wei amount when sending to the contract)
 * or false (convert from Wei amount when fetching from the contract)
 * @returns string amount
 */
export const getWeiAmount = (
  amount: string,
  tokenDecimals: number,
  multiplication: boolean
): any => {
  if (!amount || isNaN(+amount)) return 0;

  // get unit mappings from web3
  const unitMappings = unitMap as unknown as Units;

  // get number of decimal places
  const tokenFactor = 10 ** tokenDecimals;

  // get unit
  const tokenUnit = Object.keys(unitMappings).find(
    (key) => unitMappings[key as keyof Units] === tokenFactor.toString()
  ) as Unit;

  if (!tokenUnit) {
    // We are doing manual conversion for the following reasons:
    // Example: For a token with 8 decimals, eg GALA, tokenUnit is undefined
    // and thus fromWei defaults to 18 decimals.
    // web3.utils.unitMap does not have any unit supporting 8 decimals
    if (multiplication) {
      return numberToEther(amount, tokenFactor.toString());
    }
    return etherToNumber(amount, tokenFactor.toString());
  }

  if (multiplication) {
    return toWei(amount.toString(), tokenUnit).toString();
  } else {
    return fromWei(amount.toString(), tokenUnit);
  }
};

/** Function to divide two numbers by first checking
 * if the denominator is zero or not a number
 * @param numerator
 * @param denominator
 * @returns division result as a float
 */
export const divideIfNotByZero = (numerator: any, denominator: any) => {
  if (denominator === 0 || numerator === 0 || isNaN(denominator)) {
    return 0;
  } else {
    return numerator / denominator;
  }
};

export const isUnlimited = (value: any, web3: any) => {
  if (!value) return;
  const BN = web3.utils.BN;
  const BNValue = new BN(value.toString());
  const BNcompareValue = new BN(
    '115792089237316195423570985008687907853269984665640564039457'
  );

  // check whether value is greater than or equal to comparison value.
  return BNValue.gte(BNcompareValue);
};
