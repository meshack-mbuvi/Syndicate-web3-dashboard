import {
  RESET_CREATE_SYNDICATE_STORE,
  SET_CLOSE_DATE_AND_TIME,
} from "@/redux/actions/types";
import { initialState } from "../../../initialState";

type STATE = typeof initialState;

export const closeDateAndTimeReducer = (
  state = initialState,
  action: { type: string; data: any },
): STATE => {
  const { createSyndicate } = state;
  switch (action.type) {
    case SET_CLOSE_DATE_AND_TIME:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          closeDateAndTime: action.data,
        },
      };

    case RESET_CREATE_SYNDICATE_STORE:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          closeDateAndTime: initialState.createSyndicate.closeDateAndTime,
        },
      };

    default:
      return state;
  }
};
