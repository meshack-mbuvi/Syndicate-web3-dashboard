import {
  LOADING_SYNDICATE_DETAILS,
  SET_SYNDICATE_DETAILS,
} from "@/redux/actions/types";
import { initialState } from "../initialState";

export const syndicateDetailsReducer = (state = initialState, action) => {
  const { syndicateDetails } = state;
  const { data } = action;
  switch (action.type) {
    case LOADING_SYNDICATE_DETAILS:
      return {
        ...state,
        syndicateDetailsLoading: action.data,
      };

    case SET_SYNDICATE_DETAILS:
      return {
        ...state,
        syndicateDetails: { ...syndicateDetails, ...data },
      };

    default:
      return state;
  }
};
