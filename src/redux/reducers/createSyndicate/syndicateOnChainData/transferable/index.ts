import {
  RESET_CREATE_SYNDICATE_STORE,
  SET_TRANSFERABLE,
} from "@/redux/actions/types";
import { initialState } from "../../../initialState";

type STATE = typeof initialState;

export const transferableReducer = (
  state = initialState,
  action: { type: string; data: boolean },
): STATE => {
  const { createSyndicate } = state;
  switch (action.type) {
    case SET_TRANSFERABLE:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          transferable: action.data,
        },
      };

    case RESET_CREATE_SYNDICATE_STORE:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          transferable: initialState.createSyndicate.transferable,
        },
      };

    default:
      return state;
  }
};
