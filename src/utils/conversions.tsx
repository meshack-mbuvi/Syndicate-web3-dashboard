import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";
const Web3 = require("web3");
const web3 = new Web3(
  Web3.givenProvider || `${process.env.NEXT_PUBLIC_INFURA_ENDPOINT}`,
);

/**
 * Converts a number to ether
 * value can be an valid string or number.
 * @param {string} value
 * @return {bigNumber} a bigNumber representation of the passed value.
 */
export const toEther = (value) => ethers.utils.parseEther(value.toString());

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
    .dividedBy(new BigNumber(tokenFactor ? tokenFactor : "1000000000000000000"))
    .toNumber();

/**
 * To minimise error margins while passing javascript numbers to solidity, we
 * multiplying them by 1000 before converting to ether. Therefore to convert
 * any value from % to decimal, we just divide by 1000.
 * @param { number } number to be converted
 * @returns {double|float}
 */

export const fromNumberToPercent = (number) => number / 1000;

/** Every user token amount input or syndicate token value needs to be converted
 * to and from wei amounts depending on the number of
 * decimal places.
 * @param amount string amount to convert
 * @param web3 we'll use the BN instance from web3.utils
 * @param tokenDecimals number of decimal places for the current token
 * @param multiplication boolean value. can be true(get Wei amount when sending to the contract)
 * or false (convert from Wei amount when fetching from the contract)
 * @returns string amount
 */
export const getWeiAmount = (
  amount: string,
  tokenDecimals: number,
  multiplication: boolean,
) => {
  if (!amount) return;

  // get unit mappings from web3
  const unitMappings = web3.utils.unitMap;

  // get number of decimal places
  const tokenFactor = 10 ** tokenDecimals;

  // get unit
  const tokenUnit = Object.keys(unitMappings).find(
    (key) => unitMappings[key] === tokenFactor.toString(),
  );

  if (multiplication) {
    return web3.utils.toWei(amount.toString(), tokenUnit);
  } else {
    return web3.utils.fromWei(amount.toString(), tokenUnit);
  }
};

/** Function to convert basis points to percentage
 * 100 basis points = 1%
 * @param basisPoints total basis points as a string
 * @returns percentage as a float.
 */
export const basisPointsToPercentage = (basisPoints: string) => {
  return parseFloat(basisPoints) / 100;
};

/** Function to divide two numbers by first checking
 * if the denominator is zero or not a number
 * @param numerator
 * @param denominator
 * @returns division result as a float
 */
export const divideIfNotByZero = (numerator, denominator) => {
  if (denominator === 0 || numerator === 0 || isNaN(denominator)) {
    return 0;
  } else {
    return numerator / denominator;
  }
};

/** Function to filter a given array by unique values
 * use this as a callback inside an array filter method
 * @params details on the current index
 */
export const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

export const isUnlimited = (value) => {
  if (!value) return;
  var BN = web3.utils.BN;
  const BNValue = new BN(value.toString());
  const BNcompareValue = new BN(
    "115792089237316195423570985008687907853269984665640564039457",
  );

  // check whether value is greater than or equal to comparison value.
  return BNValue.gte(BNcompareValue);
};
