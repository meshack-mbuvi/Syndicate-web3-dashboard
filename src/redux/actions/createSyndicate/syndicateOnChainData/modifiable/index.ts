import { SET_MODIFIABLE } from "src/redux/actions/types";

export const setModifiable = (isModifiable: boolean) => (
  dispatch: (arg0: {
    type: string;
    data: boolean;
  }) => React.Dispatch<{ type: string; data: boolean }>,
): React.Dispatch<{ type: string; data: boolean }> => {
  return dispatch({
    type: SET_MODIFIABLE,
    data: isModifiable,
  });
};
