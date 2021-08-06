import { SET_CLOSE_DATE_AND_TIME } from "src/redux/actions/types";

export const setCloseDateAndTime = (closeDate: Record<string, any>) => (
  dispatch: (arg0: {
    type: string;
    data: Record<string, any>;
  }) => React.Dispatch<{ type: string; data: Record<string, any> }>,
): React.Dispatch<{ type: string; data: Record<string, any> }> => {
  return dispatch({
    type: SET_CLOSE_DATE_AND_TIME,
    data: closeDate,
  });
};
