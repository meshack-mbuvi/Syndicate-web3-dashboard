import { SET_LOADING, SET_SUBMITTING } from "../types";

export const setLoading = (data: boolean) => async (dispatch) => {
  return dispatch({
    data,
    type: SET_LOADING,
  });
};

export const setSubmitting = (data: boolean) => async (dispatch) => {
  return dispatch({
    data,
    type: SET_SUBMITTING,
  });
};
