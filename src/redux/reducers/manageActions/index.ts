// import { SHOW_MODIFY_MEMBER_DISTRIBUTIONS } from "@/redux/actions/types";
import {
  SET_SELCETED_MEMBER_ADDRESS,
  SET_SHOW_REJECT_MEMBER_DEPOSIT_OR_ADDRESS,
  SHOW_MODIFY_CAP_TABLE,
  SHOW_MODIFY_MEMBER_DISTRIBUTIONS,
  SHOW_REJECT_MEMBER_ADDRESS_ONLY,
  SHOW_REJECT_MEMBER_DEPOSIT_ONLY,
  State,
} from "@/redux/actions/types";
import { initialState } from "../initialState";

/**
 * Reducer to handle actions for manage actions section.
 *
 * @param state
 * @param action
 * @returns
 */
export const manageActionsReducer = (
  state = initialState,
  action: { type: string; data: any },
): State => {
  const { manageActions } = state;
  switch (action.type) {
    case SHOW_MODIFY_MEMBER_DISTRIBUTIONS:
      return {
        ...state,
        manageActions: {
          ...manageActions,
          modifyMemberDistribution: action.data,
        },
      };

    case SHOW_MODIFY_CAP_TABLE:
      return {
        ...state,
        manageActions: {
          ...manageActions,
          modifyCapTable: action.data,
        },
      };

    case SET_SELCETED_MEMBER_ADDRESS:
      return {
        ...state,
        manageActions: {
          ...manageActions,
          memberAddress: action.data,
        },
      };

    case SET_SHOW_REJECT_MEMBER_DEPOSIT_OR_ADDRESS:
      return {
        ...state,
        manageActions: {
          ...manageActions,
          rejectMemberAddressOrDeposit: action.data,
        },
      };

    case SHOW_REJECT_MEMBER_ADDRESS_ONLY:
      return {
        ...state,
        manageActions: {
          ...manageActions,
          showAddressOnly: action.data,
        },
      };

    case SHOW_REJECT_MEMBER_DEPOSIT_ONLY:
      return {
        ...state,
        manageActions: {
          ...manageActions,
          showDepositOnly: action.data,
        },
      };

    default:
      return state;
  }
};
