import { ADD_NEW_INVESTMENT } from "../types";

/**
 * Adds a new investment to the state.
 * The investment object has the following properties:
 *  - amountInvested
 *  - lpAddress: wallet address of the investor
 *  - syndicateAddress: address of the syndicate to which new investment is made
 * @param {object} data
 * @returns
 */
export const addSyndicateInvestments = (data) => async (dispatch) => {
  return dispatch({
    data,
    type: ADD_NEW_INVESTMENT,
  });
};
