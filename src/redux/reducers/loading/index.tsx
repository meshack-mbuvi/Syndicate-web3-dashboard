import { initialState } from "../initialState";
import { SET_LOADING } from "src/redux/actions/types";

export const lodingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, laoding: action.data };
    default:
      return state;
  }
};
