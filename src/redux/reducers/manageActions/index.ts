// import { SHOW_MODIFY_MEMBER_DISTRIBUTIONS } from "@/redux/actions/types";
import {
  ADD_NEW_MEMBER_TO_SELECTED_MEMBERS,
  BLOCKING_MEMBER_ADDRESS,
  CONFIRM_BLOCK_MEMBER_ADDRESS,
  CONFIRM_MODIFY_MEMBER_DEPOSIT,
  MODIFYING_MEMBER_DEPOSIT,
  SET_SELECTED_MEMBERS,
  SHOW_MODIFY_CAP_TABLE,
  SHOW_MODIFY_MEMBER_DISTRIBUTIONS,
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

    case SHOW_REJECT_MEMBER_DEPOSIT_ONLY:
      return {
        ...state,
        manageActions: {
          ...manageActions,
          showDepositOnly: action.data,
        },
      };

    case CONFIRM_BLOCK_MEMBER_ADDRESS:
      return {
        ...state,
        manageActions: {
          ...manageActions,
          confirmBlockAddress: action.data,
        },
      };

    case BLOCKING_MEMBER_ADDRESS:
      return {
        ...state,
        manageActions: {
          ...manageActions,
          syndicateMembers: action.data,
        },
      };

    case CONFIRM_MODIFY_MEMBER_DEPOSIT:
      return {
        ...state,
        manageActions: {
          ...manageActions,
          modifyOnChainDeposits: action.data,
        },
      };

    case MODIFYING_MEMBER_DEPOSIT:
      return {
        ...state,
        manageActions: {
          ...manageActions,
          syndicateMembers: action.data,
        },
      };

    case SET_SELECTED_MEMBERS:
      return {
        ...state,
        manageActions: {
          ...manageActions,
          selectedMembers: action.data.selectedMembers,
        },
      };

    case ADD_NEW_MEMBER_TO_SELECTED_MEMBERS:
      return {
        ...state,
        manageActions: {
          ...manageActions,
          selectedMembers: [...manageActions.selectedMembers, action.data],
        },
      };

    default:
      return state;
  }
};
