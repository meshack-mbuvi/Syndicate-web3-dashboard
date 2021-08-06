import { SET_TRANSFERABLE } from "src/redux/actions/types";

export const setTransferable = (isTransferable: boolean) => (
  dispatch: (arg0: {
    type: string;
    data: boolean;
  }) => React.Dispatch<{ type: string; data: boolean }>,
): React.Dispatch<{ type: string; data: boolean }> => {
  return dispatch({
    type: SET_TRANSFERABLE,
    data: isTransferable,
  });
};
