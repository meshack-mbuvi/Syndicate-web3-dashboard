import { ALLOWLIST_TYPES  } from "@/redux/actions/types";
import { initialState } from "@/redux/reducers/initialState";

type STATE = typeof initialState;

const {
  SET_IS_ALLOWLIST_ENABLED,
  SET_MEMBER_ADDRESSES,
  SET_ALLOW_REQUEST_TO_ALLOWLIST,
} = ALLOWLIST_TYPES;

export const allowlistReducer = (
  state = initialState,
  action: { type: string, data: boolean | string[] },
): STATE => {
  const { createSyndicate } = state;
  switch (action.type) {
    case SET_IS_ALLOWLIST_ENABLED:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          allowlist: {
            ...createSyndicate.allowlist,
            isAllowlistEnabled: action.data as boolean,
          },
        },
      };

    case SET_MEMBER_ADDRESSES:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          allowlist: {
            ...createSyndicate.allowlist,
            memberAddresses: action.data as string[],
          },
        },
      };

    case SET_ALLOW_REQUEST_TO_ALLOWLIST:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          allowlist: {
            ...createSyndicate.allowlist,
            allowRequestToAllowlist: action.data as boolean,
          },
        },
      };

    default:
      return state;
  }
};
