import { ALLOWLIST_TYPES } from "src/redux/actions/types";

const {
  SET_IS_ALLOWLIST_ENABLED,
  SET_MEMBER_ADDRESSES,
  SET_ALLOW_REQUEST_TO_ALLOWLIST,
} = ALLOWLIST_TYPES;

export const setIsAllowlistEnabled = (isAllowlistEnabled: boolean) => (
  dispatch: (arg0: {
    type: string;
    data: boolean;
  }) => React.Dispatch<{ type: string; data: boolean }>,
): React.Dispatch<{ type: string; data: boolean }> => {
  return dispatch({
    type: SET_IS_ALLOWLIST_ENABLED,
    data: isAllowlistEnabled,
  });
};

export const setMemberAddresses = (memberAddresses: string[]) => (
  dispatch: (arg0: {
    type: string;
    data: string[];
  }) => React.Dispatch<{ type: string; data: string[] }>,
): React.Dispatch<{ type: string; data: string[] }> => {
  return dispatch({
    type: SET_MEMBER_ADDRESSES,
    data: memberAddresses,
  });
};

export const setAllowRequestToAllowlist = (allowRequestToAllowlist: boolean) => (
  dispatch: (arg0: {
    type: string;
    data: boolean;
  }) => React.Dispatch<{ type: string; data: boolean }>,
): React.Dispatch<{ type: string; data: boolean }> => {
  return dispatch({
    type: SET_ALLOW_REQUEST_TO_ALLOWLIST,
    data: allowRequestToAllowlist,
  });
};
