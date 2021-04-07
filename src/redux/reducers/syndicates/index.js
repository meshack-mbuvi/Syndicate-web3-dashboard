import { ALL_SYNDICATES } from "src/redux/actions/types";
import { initialState } from "../initialState";

export const syndicatesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ALL_SYNDICATES:
      return {
        ...state,
        syndicates: action.data,
      };

    default:
      return state;
  }
};
