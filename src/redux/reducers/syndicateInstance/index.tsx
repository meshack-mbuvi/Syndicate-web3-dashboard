import { STORE_SYNDICATE_INSTANCE } from "src/redux/actions/types";
import { initialState } from "../initialState";

export const syndicateInstanceReducer = (state = initialState, action) => {
  const { data } = action;
  switch (action.type) {
    case STORE_SYNDICATE_INSTANCE:
      return {
        ...state,
        syndicateContractInstance: data,
      };

    default:
      return state;
  }
};
