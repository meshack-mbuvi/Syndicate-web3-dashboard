import React from "react";
import { TOKEN_AND_DEPOSITS_TYPES } from "../../../types";

const {
  SET_NUM_MEMBERS_MAX,
  SET_DEPOSIT_MEMBER_MIN,
  SET_DEPOSIT_MEMBER_MAX,
  SET_DEPOSIT_TOTAL_MAX,
  SET_DEPOSIT_TOKEN_DETAILS,
} = TOKEN_AND_DEPOSITS_TYPES;

export const setDepositMembersMax = (value: string) => (
  dispatch: (arg0: {
    type: string;
    data: string;
  }) => React.Dispatch<{ type: string; data: string }>,
): React.Dispatch<{ type: string; data: string }> =>
  dispatch({ type: SET_NUM_MEMBERS_MAX, data: value });

export const setDepositMemberMin = (value: string) => (
  dispatch: (arg0: {
    type: string;
    data: string;
  }) => React.Dispatch<{ type: string; data: string }>,
): React.Dispatch<{ type: string; data: string }> =>
  dispatch({ type: SET_DEPOSIT_MEMBER_MIN, data: value });

export const setDepositMemberMax = (value: string) => (
  dispatch: (arg0: {
    type: string;
    data: string;
  }) => React.Dispatch<{ type: string; data: string }>,
): React.Dispatch<{ type: string; data: string }> =>
  dispatch({ type: SET_DEPOSIT_MEMBER_MAX, data: value });

export const setDepositTotalMax = (value: string) => (
  dispatch: (arg0: {
    type: string;
    data: string;
  }) => React.Dispatch<{ type: string; data: string }>,
): React.Dispatch<{ type: string; data: string }> =>
  dispatch({ type: SET_DEPOSIT_TOTAL_MAX, data: value });

interface IDepositTokenDetails {
  depositTokenAddress: string;
  depositTokenSymbol: string;
  depositTokenLogo: string;
  depositTokenName: string;
  depositTokenDecimals: number
}
/** store deposit token details from the create syndicate flow
 * @param depositTokenAddress the contract address of the token.
 * @param depositTokenSymbol the symbol of the token.
 * @param depositTokenLogo url pointing to the logo of the icon.
 * @param depositTokenName name of the deposit token.
 * @param depositTokenDecimals number of decimal places the deposit token has
 */
export const setDepositTokenDetails = (value: IDepositTokenDetails) => (
  dispatch: (arg0: {
    type: string;
    data: IDepositTokenDetails;
  }) => React.Dispatch<{ type: string; data: IDepositTokenDetails }>,
): React.Dispatch<{ type: string; data: IDepositTokenDetails }> =>
  dispatch({ type: SET_DEPOSIT_TOKEN_DETAILS, data: value });
