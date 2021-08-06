import { SET_MODIFIABLE } from "@/redux/actions/types";
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

    default:
      return state;
  }
};
