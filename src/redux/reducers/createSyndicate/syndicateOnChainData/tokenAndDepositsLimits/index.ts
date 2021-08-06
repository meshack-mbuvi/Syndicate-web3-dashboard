import { STATE, TOKEN_AND_DEPOSITS_TYPES } from "src/redux/actions/types";
import { initialState } from "../../../initialState";

/**
 * This reducer handles the token and deposit limit section in the create
 * syndicate flow.
 *
 * @param state
 * @param action
 * @returns
 */
export const tokenAndDepositLimitReducer = (
  state = initialState,
  action: any,
): STATE => {
  const { createSyndicate } = state;

  const {
    SET_NUM_MEMBERS_MAX,
    SET_DEPOSIT_MEMBER_MIN,
    SET_DEPOSIT_MEMBER_MAX,
    SET_DEPOSIT_TOTAL_MAX,
    SET_DEPOSIT_TOKEN_DETAILS,
  } = TOKEN_AND_DEPOSITS_TYPES;

  switch (action.type) {
    case SET_DEPOSIT_MEMBER_MAX:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          tokenAndDepositsLimits: {
            ...createSyndicate.tokenAndDepositsLimits,
            depositMemberMax: action.data,
          },
        },
      };

    case SET_NUM_MEMBERS_MAX:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          tokenAndDepositsLimits: {
            ...createSyndicate.tokenAndDepositsLimits,
            numMembersMax: action.data,
          },
        },
      };

    case SET_DEPOSIT_MEMBER_MIN:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          tokenAndDepositsLimits: {
            ...createSyndicate.tokenAndDepositsLimits,
            depositMemberMin: action.data,
          },
        },
      };

    case SET_DEPOSIT_TOTAL_MAX:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          tokenAndDepositsLimits: {
            ...createSyndicate.tokenAndDepositsLimits,
            depositTotalMax: action.data,
          },
        },
      };

    case SET_DEPOSIT_TOKEN_DETAILS:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          tokenAndDepositsLimits: {
            ...createSyndicate.tokenAndDepositsLimits,
            depositTokenDetails: action.data,
          },
        },
      };

    default:
      return state;
  }
};
