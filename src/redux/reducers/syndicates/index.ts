import {
  ALL_SYNDICATES,
  INVALID_SYNDICATE_ADDRESS,
  SET_MANAGER_FEE_ADDRESS,
  SYNDICATE_BY_ADDRESS,
  FOUND_SYNDICATE_ADDRESS,
  UPDATE_SYNDICATE_DETAILS,
  SYNDICATE_NOT_FOUND,
  USER_LOGOUT,
} from "@/redux/actions/types";
import { initialState } from "../initialState";

export const syndicatesReducer = (state = initialState, action) => {
  const { syndicate } = state;
  switch (action.type) {
    case ALL_SYNDICATES:
      return {
        ...state,
        syndicates: action.data,
      };

    case SYNDICATE_BY_ADDRESS:
      return {
        ...state,
        syndicate: action.data,
      };

    case SET_MANAGER_FEE_ADDRESS:
      return {
        ...state,
        syndicate: { ...syndicate, managerFeeAddress: action.data },
      };

    case INVALID_SYNDICATE_ADDRESS:
      return {
        ...state,
        syndicate: null,
        ...action.data,
      };

    case SYNDICATE_NOT_FOUND:
      return {
        ...state,
        syndicate: null,
        ...action.data,
      };

    case FOUND_SYNDICATE_ADDRESS:
      return {
        ...state,
        ...action.data,
      };
    case USER_LOGOUT:
      return {
        ...state,
        syndicates: initialState.syndicates,
      };

    case UPDATE_SYNDICATE_DETAILS:
      return {
        ...state,
        syndicate: { ...syndicate, ...action.data },
      };
    default:
      return state;
  }
};
