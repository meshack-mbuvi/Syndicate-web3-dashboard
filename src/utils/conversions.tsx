import { BigNumber } from "bignumber.js";
import { ethers } from "ethers";
const Web3 = require("web3");

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
 * @param {bignumber } value
 * @returns { decimal }
 */
export const etherToNumber = (value) =>
  new BigNumber(value.toString())
    .dividedBy(new BigNumber("1000000000000000000"))
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
 * @param multiplication boolean value. can be true(multiply when sending to contract)
 * or false (divide when fetching values from contract)
 * @returns string amount
 */
export const getWeiAmount = (
  amount: string,
  tokenDecimals: number,
  multiplication: boolean
) => {
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  const BN = web3.utils.BN;
  const tokenFactor = new BN(Math.pow(10, tokenDecimals).toString());
  if (multiplication) {
    return new BN(amount).mul(tokenFactor).toString();
  } else {
    return new BN(amount).div(tokenFactor).toString();
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
