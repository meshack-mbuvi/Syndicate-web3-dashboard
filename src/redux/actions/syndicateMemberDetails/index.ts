import {
  LOADING_SYNDICATE_MEMBER_DETAILS,
  ONE_SYNDICATE_PER_ACCOUNT,
  SET_MEMBER_DEPOSIT_DETAILS,
  SET_MEMBER_WITHDRAWAL_DETAILS,
  SET_SYNDICATE_DISTRIBUTION_TOKENS,
} from "../types";

interface MemberDepositDetails {
  memberTotalDeposits: string;
  memberAddressAllowed: boolean;
  memberMaxDepositReached: boolean;
}
/** update member's deposit details in the redux store
 * @param {string} memberTotalDeposits member total deposits
 * @param {boolean} memberAddressAllowed whether member address is on the whitelist
 * for syndicates with allowlist set to true.
 * @param {boolean} memberMaxDepositReached whether member has reached their max. deposits cap.
 * */
export const setMemberDepositDetails = (data: MemberDepositDetails) => {
  return {
    type: SET_MEMBER_DEPOSIT_DETAILS,
    data,
  };
};

interface MemberWithdrawalDetails {
  memberDistributionsWithdrawalsToDate: string;
  memberDistributionsToDate: string;
  memberWithdrawalsToDepositPercentage: string;
}

/** update member's withdrawal details in the redux store
 * @param {string} memberDistributionsWithdrawalsToDate total withdrawals of a given distribution token by member
 * @param {string} memberDistributionsToDate total distributions of a given token available to the member
 * @param {string} memberWithdrawalsToDepositPercentage percentage of withdrawals to deposits
 *  */
export const setMemberWithdrawalDetails = (data: MemberWithdrawalDetails) => {
  return {
    type: SET_MEMBER_WITHDRAWAL_DETAILS,
    data,
  };
};

/** set loading state for storing member deposit or withdrawal details
 * @param {boolean} data loading state for member details
 */
export const setMemberDetailsLoading = (data: boolean) => {
  return {
    type: LOADING_SYNDICATE_MEMBER_DETAILS,
    data,
  };
};

/** set status of member with regards to whether they already manage a syndicate or not
 * A member can only manage one syndicate per wallet account.
 * @param {boolean} data true, if members already managers a syndicate.
 */
export const setOneSyndicatePerAccount = (data: boolean) => {
  return {
    type: ONE_SYNDICATE_PER_ACCOUNT,
    data,
  };
};

interface DistributionTokenDetails {
  tokenDistributions: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenDecimals: number;
  selected: boolean;
}
/** set distribution tokens for the current syndicate
 * @param {string} tokenDistributions total distributions available for a given token
 * @param {string} tokenSymbol the token symbol for the currently selected token
 * @param {string} tokenAddress the contract address of the current distribution token
 * @param {number} tokenDecimals number of decimal places of the current token
 * @param {boolean} selected whether the current token is the one selected from the drop-down on the
 * withdrawals page.
 */
export const setSyndicateDistributionTokens = (
  data: DistributionTokenDetails[]
) => {
  return {
    type: SET_SYNDICATE_DISTRIBUTION_TOKENS,
    data,
  };
};
