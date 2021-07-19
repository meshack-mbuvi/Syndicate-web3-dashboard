import React from "react";
import {
  SET_SELCETED_MEMBER_ADDRESS,
  SET_SHOW_REJECT_MEMBER_DEPOSIT_OR_ADDRESS,
  SHOW_MODIFY_CAP_TABLE,
  SHOW_MODIFY_MEMBER_DISTRIBUTIONS,
} from "../types";

/**
 * Action to trigger show/hide modify member distributions modal
 * @param show
 * @returns
 */
export const setShowModifyMemberDistributions = (show: boolean) => (
  dispatch: (arg0: {
    type: string;
    data: boolean;
  }) => React.Dispatch<{
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
export const setShowModifyCapTable = (show: boolean) => (
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
 * Action to set selected member address from manage members component.
 *
 * @param selectedMemberAddress
 * @returns
 */
export const setSelectedMemberAddress = (selectedMemberAddress: string) => (
  dispatch: (arg0: {
    type: string;
    data: string;
  }) => React.Dispatch<{ type: string; data: boolean }>,
): React.Dispatch<{ type: string; data: boolean }> => {
  return dispatch({
    type: SET_SELCETED_MEMBER_ADDRESS,
    data: selectedMemberAddress,
  });
};

/**
 * Action to trigger show/hide nodal to reject member address or deposits.
 *
 * @param { boolean } show
 * @returns
 */
export const setShowRejectDepositOrMemberAddress = (show: boolean) => (
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
