import {
  LOADING_SYNDICATE_LP_DETAILS,
  SET_SYNDICATE_LP_DETAILS,
  ONE_SYNDICATE_PER_ACCOUNT,
} from "src/redux/actions/types";
import { initialState } from "../initialState";

export const syndicateLPDetailsReducer = (state = initialState, action) => {
  const { syndicateLPDetails } = state;
  const { data } = action;
  switch (action.type) {
    case LOADING_SYNDICATE_LP_DETAILS:
      return {
        ...state,
        syndicateLPDetailsLoading: data,
      };

    case SET_SYNDICATE_LP_DETAILS:
      return {
        ...state,
        syndicateLPDetails: { ...syndicateLPDetails, ...data },
      };
    case ONE_SYNDICATE_PER_ACCOUNT:
      return {
        ...state,
        oneSyndicatePerAccount: data,
      };

    default:
      return state;
  }
};
