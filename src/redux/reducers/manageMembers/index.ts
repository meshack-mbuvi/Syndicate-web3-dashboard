/* eslint-disable no-case-declarations */
import {
  CONFIRM_RETURN_DEPOSIT,
  RESET_MEMBER_DEPOSITS,
  RETURNING_DEPOSIT,
  SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
  SET_SELECTED_MEMBER_ADDRESS,
  SET_SYNDICATE_MANAGE_MEMBERS,
  SET_NEW_MEMBER_ADDRESSES,
} from "@/redux/actions/types";
import { initialState } from "../initialState";

const findMemberAddressIndex = (members, memberAddress) => {
  if (!members.length) {
    return -1;
  }
  const memberIndex = members.findIndex(
    (member) => member.memberAddress == memberAddress,
  );

  return memberIndex;
};
export const manageMembersDetailsReducer = (state = initialState, action) => {
  const { syndicateManageMembers } = state;
  const memberAddresses = action?.data?.memberAddresses;
  const returningDeposit = action?.data?.returningDeposit;
  let totalAmountToReturn = 0;
  let syndicateMembers = syndicateManageMembers.syndicateMembers;

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
          loading: action.data,
          memberAddresses: action.data,
        },
      };

    case RETURNING_DEPOSIT:
      memberAddresses.forEach((memberAddress) => {
        let memberIndex = -1;
        if (memberAddress) {
          memberIndex = findMemberAddressIndex(
            syndicateManageMembers?.syndicateMembers,
            memberAddress,
          );
          const memberCopy = syndicateManageMembers.syndicateMembers;

          memberCopy[memberIndex].returningDeposit = returningDeposit;
          totalAmountToReturn += parseInt(
            memberCopy[memberIndex].memberDeposit,
            10,
          );
          syndicateMembers = memberCopy;
        }
      });

      return {
        ...state,
        syndicateManageMembers: {
          ...syndicateManageMembers,
          syndicateMembers,
          totalAmountToReturn,
        },
      };

    case RESET_MEMBER_DEPOSITS:
      const { memberAddress, memberDeposit, memberStake } = action.data;
      let memberIndex = -1;
      if (memberAddress) {
        memberIndex = findMemberAddressIndex(
          syndicateManageMembers?.syndicateMembers,
          memberAddress,
        );
        const memberCopy = syndicateManageMembers.syndicateMembers;

        memberCopy[memberIndex].memberDeposit = memberDeposit;
        memberCopy[memberIndex].memberStake = memberStake;

        syndicateMembers = memberCopy;
      }

      return {
        ...state,
        syndicateManageMembers: {
          ...syndicateManageMembers,
          syndicateMembers,
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
          newSyndicateMembers: action.data
        }
      }

    default:
      return state;
  }
};
