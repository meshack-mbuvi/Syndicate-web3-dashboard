import { getPastEvents } from "@/helpers/retrieveEvents";
import { getSyndicate } from "src/helpers/syndicate";
import {
  ADD_NEW_INVESTMENT,
  ALL_SYNDICATES,
  NEW_SYNDICATE,
  SET_LOADING,
} from "../types";

type Depositors = {
  address?: {
    depositors?: number;
  };
};

/**
 * Read all syndicates from all events and add them to the store
 * The syndicates added to store are those the wallet account has invested in
 * or is leading
 * @param {object} data
 * @returns
 */
export const addSyndicates = (data) => async (dispatch) => {
  if (!data) return;

  const { syndicateInstance, account, web3contractInstance, web3 } = data;
  try {
    dispatch({
      data: true,
      type: SET_LOADING,
    });
    const events = await getPastEvents(web3, web3contractInstance);

    const syndicates = [];
    const syndicateDepositors: Depositors = {};

    await events.forEach(async (event) => {
      const { syndicateAddress } = event.returnValues;
      // check whether event belongs to this wallet owner
      if (
        (event.event === "createdSyndicate" ||
          event.event === "closedSyndicate") &&
        syndicateAddress === account
      ) {
        syndicates.push(syndicateAddress);
      }

      // get syndicates this wallet has invested in
      if (event.event === "lpInvestedInSyndicate") {
        const address = event.returnValues["0"];
        const lpAddress = event.returnValues["1"];

        // record depositors for each address
        if (syndicateDepositors.address) {
          syndicateDepositors[address] += 1;
        } else {
          syndicateDepositors[address] = 1;
        }

        if (lpAddress === account) {
          // we need to check whether lpAddress matches this wallet account
          // meaning this account has invested in this wallet
          // we use default for fields missing in the event
          // syndicate details will be retrieved during display
          syndicates.push(address);
        }
      }
    });

    /**
     * wallet might have send several investments and thus many events
     * for the same use are emitted. We process all the events and the get
     * a single syndicate, hence the filtering below.
     */
    const filteredSyndicateAddresses = syndicates.reduce((acc, current) => {
      const x = acc.find((item) => item === current);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    /**
     * Get syndicate details for all address of obtained from events
     * NOTE: we are using for loop instead of build in map/forEach function.
     * This is because the built in functions above do not update the length of
     * const allSyndicates = []; after array.push method
     *
     */
    const allSyndicates = [];

    for (let index = 0; index < filteredSyndicateAddresses.length; index++) {
      try {
        const syndicate = await getSyndicate(
          filteredSyndicateAddresses[index],
          syndicateInstance
        );
        let { address } = syndicate;

        /**
         * We check whether we have data returned; for the case of an error,
         * the returned value is undefined
         */
        if (syndicate) {
          allSyndicates.push({
            ...syndicate,
            depositors: syndicateDepositors[address] || 0,
          });
        }
      } catch (error) {
        console.error({ message: "Error retrieving syndicate data" });
      }
    }
    dispatch({
      data: false,
      type: SET_LOADING,
    });
    return dispatch({
      data: allSyndicates,
      type: ALL_SYNDICATES,
    });
  } catch (error) {
    dispatch({
      data: false,
      type: SET_LOADING,
    });
    console.log({
      error,
      message: "An error occured while retrieving all events",
    });
  }
};

export const addNewSyndicate = (data: object) => async (dispatch) => {
  return dispatch({
    data,
    type: NEW_SYNDICATE,
  });
};

/**
 * adds syndicates to application store
 * @param {*} data
 * @returns
 */
export const addSyndicateInvestment = (data) => async (dispatch) => {
  return dispatch({
    data,
    type: ADD_NEW_INVESTMENT,
  });
};
