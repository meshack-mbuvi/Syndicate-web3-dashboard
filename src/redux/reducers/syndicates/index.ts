import {
  ALL_SYNDICATES,
  INVALID_SYNDICATE_ADDRESS,
  SET_MANAGER_FEE_ADDRESS,
  SYNDICATE_BY_ADDRESS,
} from "src/redux/actions/types";
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

    default:
      return state;
  }
};
