import { ethers } from "ethers";
/**
 * Converts a number to ether
 * value can be an valid string or number.
 * @param {string} value
 * @return {bigNumber} a bigNumber representation of the passed value.
 */
export const toEther = (value) => ethers.utils.parseEther(value.toString());
