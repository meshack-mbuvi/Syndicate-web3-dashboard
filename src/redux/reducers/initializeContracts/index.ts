import { INITIALIZE_CONTRACTS } from "@/redux/actions/types";
import { initialState } from "../initialState";

export const initializeContractsReducer = (state = initialState, action) => {
  const { syndicateContracts } = initialState;

  switch (action.type) {
    case INITIALIZE_CONTRACTS:
      return {
        ...state,
        syndicateContracts: {
          ...syndicateContracts,
          ...action.data,
        },
      };

    default:
      return state;
  }
};
