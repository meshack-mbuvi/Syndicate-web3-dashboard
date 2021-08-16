import { RESET_CREATE_SYNDICATE_STORE } from "src/redux/actions/types";

export const resetCreateSyndicateReduxStore = () => (
  dispatch: (arg0: {
    type: string;
  }) => React.Dispatch<{ type: string }>,
): React.Dispatch<{ type: string }> => {
  return dispatch({
    type: RESET_CREATE_SYNDICATE_STORE,
  });
};
