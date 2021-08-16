import {
  RESET_CREATE_SYNDICATE_STORE,
  SET_MODIFIABLE,
} from "@/redux/actions/types";
import { initialState } from "../../../initialState";

type STATE = typeof initialState;

export const modifiableReducer = (
  state = initialState,
  action: { type: string; data: boolean },
): STATE => {
  const { createSyndicate } = state;
  switch (action.type) {
    case SET_MODIFIABLE:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          modifiable: action.data,
        },
      };

    case RESET_CREATE_SYNDICATE_STORE:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          modifiable: initialState.createSyndicate.modifiable,
        },
      };

    default:
      return state;
  }
};
