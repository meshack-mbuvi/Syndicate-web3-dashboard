import {
  STORE_DEPOSIT_TOKEN_ALLOWANCE,
  STORE_DISTRIBUTION_TOKENS_ALLOWANCES,
} from "../types";

type depositTokenData = {
  tokenAddress: string;
  tokenAllowance: string;
  tokenDeposits: string;
  tokenSymbol: string;
  tokenDecimals: number;
  sufficientAllowanceSet: boolean;
};

type depositTokenDetails = depositTokenData[];
/**
 * action to store the deposit token address along with the allowance set for it
 * on the manager account.
 * @param data an object containing the depositTokenAddress and depositTokenAllowance
 * @returns
 * */
export const storeDepositTokenAllowance = (data: depositTokenDetails) => {
  return {
    type: STORE_DEPOSIT_TOKEN_ALLOWANCE,
    data,
  };
};

type tokenData = {
  tokenAddress: string;
  tokenAllowance: string;
  tokenDistributions: string;
  sufficientAllowanceSet: boolean;
  tokenSymbol: string;
  tokenDecimals: number;
};

type tokenDetails = tokenData[];
/**
 * action to store distribution token addresses along with the allowances and distribution set for them on the
 * manager account.
 * @param data an object containing the distributionTokenAddresses along with their allowances and distributions
 * @returns
 * */
export const storeDistributionTokensDetails = (data: tokenDetails) => {
  return {
    type: STORE_DISTRIBUTION_TOKENS_ALLOWANCES,
    data,
  };
};
