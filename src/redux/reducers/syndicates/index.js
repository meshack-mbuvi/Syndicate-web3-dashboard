import { ALL_SYNDICATES, NEW_SYNDICATE } from "src/redux/actions/types";
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

    default:
      return state;
  }
};
