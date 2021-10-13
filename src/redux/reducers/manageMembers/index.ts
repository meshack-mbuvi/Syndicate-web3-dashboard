/* eslint-disable no-case-declarations */
import {
  ADD_TO_SYNDICATE_MEMBERS,
  CONFIRM_RETURN_DEPOSIT,
  RETURNING_DEPOSIT,
  SELECTED_MEMBER,
  SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
  SET_SELECTED_MEMBER_ADDRESS,
  SET_SYNDICATE_MANAGE_MEMBERS,
  SHOW_TRANSFER_DEPOSIT_MODAL,
  TRANSFERRING_DEPOSIT,
} from "@/redux/actions/types";
import { initialState } from "../initialState";

export const manageMembersDetailsReducer = (state = initialState, action) => {
  const { syndicateManageMembers } = state;

  switch (action.type) {
    case SET_SYNDICATE_MANAGE_MEMBERS:
      return {
        ...state,
        syndicateManageMembers: {
          ...syndicateManageMembers,
          syndicateMembers: action.data,
        },
      };

    case ADD_TO_SYNDICATE_MEMBERS: {
      return {
        ...state,
        syndicateManageMembers: {
          ...syndicateManageMembers,
          syndicateMembers: [
            ...syndicateManageMembers.syndicateMembers,
            ...action.data,
          ],
        },
      };
    }

    case SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS:
      return {
        ...state,
        syndicateManageMembers: {
          ...syndicateManageMembers,
          loading: action.data,
          memberAddresses: action.data,
        },
      };

    case SET_SELECTED_MEMBER_ADDRESS:
      return {
        ...state,
        syndicateManageMembers: {
          ...syndicateManageMembers,
          totalAmountToReturn: action.data.totalAmountToReturn,
          memberAddresses: action.data.selectedMemberAddress,
        },
      };

    case RETURNING_DEPOSIT:
      return {
        ...state,
        syndicateManageMembers: {
          ...syndicateManageMembers,
          syndicateMembers: action.data,
        },
      };

    case CONFIRM_RETURN_DEPOSIT:
      return {
        ...state,
        syndicateManageMembers: {
          ...syndicateManageMembers,
          confirmReturnDeposit: action.data,
        },
      };

    case SELECTED_MEMBER:
      return {
        ...state,
        syndicateManageMembers: {
          ...syndicateManageMembers,
          selectedMember: action.data,
        },
      };

    case SHOW_TRANSFER_DEPOSIT_MODAL:
      return {
        ...state,
        syndicateManageMembers: {
          ...syndicateManageMembers,
          showTransferDepositModal: action.data,
        },
      };

    case TRANSFERRING_DEPOSIT:
      return {
        ...state,
        syndicateManageMembers: {
          ...syndicateManageMembers,
          syndicateMembers: action.data,
        },
      };
    default:
      return state;
  }
};
