import {
  LOADING_SYNDICATE_MEMBER_DETAILS,
  ONE_SYNDICATE_PER_ACCOUNT,
  SET_MEMBER_DEPOSIT_DETAILS,
  SET_MEMBER_WITHDRAWAL_DETAILS,
  SET_SYNDICATE_DISTRIBUTION_TOKENS,
} from "src/redux/actions/types";
import { initialState } from "../initialState";

export const syndicateMemberDetailsReducer = (state = initialState, action) => {
  const { memberDepositDetails, memberWithdrawalDetails } = state;
  const { data } = action;
  switch (action.type) {
    case LOADING_SYNDICATE_MEMBER_DETAILS:
      return {
        ...state,
        syndicateMemberDetailsLoading: data,
      };

    case SET_MEMBER_DEPOSIT_DETAILS:
      return {
        ...state,
        memberDepositDetails: { ...memberDepositDetails, ...data },
      };
    case SET_MEMBER_WITHDRAWAL_DETAILS:
      return {
        ...state,
        memberWithdrawalDetails: { ...memberWithdrawalDetails, ...data },
      };
    case ONE_SYNDICATE_PER_ACCOUNT:
      return {
        ...state,
        oneSyndicatePerAccount: data,
      };

    case SET_SYNDICATE_DISTRIBUTION_TOKENS:
      return {
        ...state,
        syndicateDistributionTokens: data,
      };

    default:
      return state;
  }
};
