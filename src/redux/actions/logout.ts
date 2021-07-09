import { USER_LOGOUT } from "./types/index";

export const logout = () => (dispatch) => {
  return dispatch({
    type: USER_LOGOUT,
  });
};
