import { initialState } from "../initialState";
import { ADD_NEW_INVESTMENT } from "src/redux/actions/types";

export const syndicateInvestmentsReducer = (
  state = initialState.syndicateInvestments,
  action
) => {
  switch (action.type) {
    case ADD_NEW_INVESTMENT:
      return [...state, action.data];

    default:
      return state;
  }
};
