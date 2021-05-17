import {
  ALL_SYNDICATES,
  INVALID_SYNDICATE_ADDRESS,
  NEW_SYNDICATE,
  SYNDICATE_BY_ADDRESS,
} from "src/redux/actions/types";
import { initialState } from "../initialState";

export const syndicatesReducer = (state = initialState, action) => {
  const { syndicates } = state;
  switch (action.type) {
    case ALL_SYNDICATES:
      return {
        ...state,
        syndicates: action.data,
      };

    case NEW_SYNDICATE:
      return {
        ...state,
        syndicates: [...syndicates, action.data],
      };

    case SYNDICATE_BY_ADDRESS:
      return {
        ...state,
        syndicate: action.data,
      };

    case INVALID_SYNDICATE_ADDRESS:
      return {
        ...state,
        syndicate: null,
        ...action.data,
      };

    default:
      return state;
  }
};
