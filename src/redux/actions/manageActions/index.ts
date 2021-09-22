import React from "react";
import {
  CONFIRM_BLOCK_MEMBER_ADDRESS,
  BLOCKING_MEMBER_ADDRESS,
  SET_SHOW_REJECT_MEMBER_DEPOSIT_OR_ADDRESS,
  SHOW_MODIFY_CAP_TABLE,
  SHOW_MODIFY_MEMBER_DISTRIBUTIONS,
} from "../types";

/**
 * Action to trigger show/hide modify member distributions modal
 * @param show
 * @returns
 */
export const setShowModifyMemberDistributions =
  (show: boolean) =>
  (
    dispatch: (arg0: { type: string; data: boolean }) => React.Dispatch<{
      type: "SHOW_MODIFY_MEMBER_DISTRIBUTIONS";
      data: boolean;
    }>,
  ): React.Dispatch<{
    type: typeof SHOW_MODIFY_MEMBER_DISTRIBUTIONS;
    data: boolean;
  }> => {
    return dispatch({
      type: SHOW_MODIFY_MEMBER_DISTRIBUTIONS,
      data: show,
    });
  };

/**
 * Action to trigger show/hide modify cap table modal.
 *
 * @param show
 * @returns
 */
export const setShowModifyCapTable =
  (show: boolean) =>
  (
    dispatch: (arg0: {
      type: string;
      data: boolean;
    }) => React.Dispatch<{ type: string; data: boolean }>,
  ): React.Dispatch<{ type: string; data: boolean }> => {
    return dispatch({
      type: SHOW_MODIFY_CAP_TABLE,
      data: show,
    });
  };

/**
 * Action to trigger show/hide nodal to reject member address or deposits.
 *
 * @param { boolean } show
 * @returns
 */

export const setShowRejectDepositOrMemberAddress =
  (show: boolean) =>
  (
    dispatch: (arg0: {
      type: string;
      data: boolean;
    }) => React.Dispatch<{ type: string; data: boolean }>,
  ): React.Dispatch<{ type: string; data: boolean }> => {
    return dispatch({
      type: SET_SHOW_REJECT_MEMBER_DEPOSIT_OR_ADDRESS,
      data: show,
    });
  };

export const showConfirmBlockMemberAddress =
  (confirm: boolean) => (dispatch) => {
    return dispatch({ type: CONFIRM_BLOCK_MEMBER_ADDRESS, data: confirm });
  };

export const setBlockingMemberAddress =
  ({
    memberAddresses,
    blockingAddress,
  }: {
    memberAddresses: string[];
    blockingAddress: boolean;
  }) =>
  (
    dispatch: (arg0: { data: any; type: string }) => any,
    getState: () => {
      syndicatesReducer: { syndicate: any };
      initializeContractsReducer: { syndicateContracts: any };
      manageMembersDetailsReducer;
    },
  ) => {
    let syndicateMembersCopy = null;
    const {
      manageMembersDetailsReducer: {
        syndicateManageMembers: { syndicateMembers },
      },
    } = getState();
    memberAddresses.forEach((memberAddress) => {
      let memberIndex = -1;
      if (memberAddress) {
        memberIndex = findMemberAddressIndex(syndicateMembers, memberAddress);
        const memberCopy = syndicateMembers;
        memberCopy[memberIndex].blockingAddress = blockingAddress;
        syndicateMembersCopy = memberCopy;
      }
    });

    return dispatch({
      data: syndicateMembersCopy,
      type: BLOCKING_MEMBER_ADDRESS,
    });
  };

export const findMemberAddressIndex = (members, memberAddress) => {
  if (!members.length) {
    return -1;
  }
  const memberIndex = members.findIndex(
    (member) => member.memberAddress == memberAddress,
  );

  return memberIndex;
};
