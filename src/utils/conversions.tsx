import { ethers } from "ethers";
const BN = require("bn.js");
import { BigNumber } from "bignumber.js";

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
