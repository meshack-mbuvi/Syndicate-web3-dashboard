/* eslint-disable no-case-declarations */
import {
  CONFIRM_RETURN_DEPOSIT,
  RETURNING_DEPOSIT,
  SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
  SET_NEW_MEMBER_ADDRESSES,
  SET_SELECTED_MEMBER_ADDRESS,
  SET_SYNDICATE_MANAGE_MEMBERS,
} from "@/redux/actions/types";
import { initialState } from "../initialState";

export const manageMembersDetailsReducer = (state = initialState, action) => {
  const { syndicateManageMembers, syndicateNewMembers } = state;

  switch (action.type) {
    case SET_SYNDICATE_MANAGE_MEMBERS:
      return {
        ...state,
        syndicateManageMembers: {
          ...syndicateManageMembers,
          syndicateMembers: action.data,
        },
      };

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

    case SET_NEW_MEMBER_ADDRESSES:
      return {
        ...state,
        syndicateNewMembers: {
          ...syndicateNewMembers,
          newSyndicateMembers: action.data,
        },
      };

    default:
      return state;
  }
};
