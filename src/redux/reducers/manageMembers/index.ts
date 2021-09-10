import {
  SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
  SET_SYNDICATE_MANAGE_MEMBERS,
  SET_NEW_MEMBER_ADDRESSES,
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
        },
      };
    
    case SET_NEW_MEMBER_ADDRESSES:
      return {
        ...state,
        syndicateNewMembers: {
          ...syndicateNewMembers,
          newSyndicateMembers: action.data
        }
      }

    default:
      return state;
  }
};
