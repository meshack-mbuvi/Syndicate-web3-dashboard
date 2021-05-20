import {
  STORE_DEPOSIT_TOKEN_ALLOWANCE,
  STORE_DISTRIBUTION_TOKENS_ALLOWANCES,
} from "src/redux/actions/types";
import { initialState } from "../initialState";

// reducer to store allowance and distribution details for the distribution token
// and the allowance set for the deposit token on the manager's account.
export const tokenDetailsReducer = (state = initialState, action) => {
  const { data } = action;
  switch (action.type) {
    case STORE_DEPOSIT_TOKEN_ALLOWANCE:
      return {
        ...state,
        depositTokenAllowanceDetails: data,
      };

    case STORE_DISTRIBUTION_TOKENS_ALLOWANCES:
      return {
        ...state,
        distributionTokensAllowanceDetails: data,
      };
    default:
      return state;
  }
};
