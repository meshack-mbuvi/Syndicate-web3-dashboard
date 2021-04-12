import { SET_LOADING, SET_SUBMITTING } from "src/redux/actions/types";
import { initialState } from "../initialState";

export const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.data };
    case SET_SUBMITTING:
      return {
        ...state,
        submitting: action.data,
      };
    default:
      return state;
  }
};
