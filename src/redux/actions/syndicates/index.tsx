import { formatDate } from "src/utils";
import { ADD_NEW_INVESTMENT, ALL_SYNDICATES } from "../types";

const Web3 = require("web3");

type Depositors = {
  address?: {
    depositors?: number;
  };
};

/**
 * Adds a new investment to the state.
 * The investment object has the following properties:
 *  - amountInvested
 *  - lpAddress: wallet address of the investor
 *  - syndicateAddress: address of the syndicate to which new investment is made
 * @param {object} data
 * @returns
 */
export const addSyndicates = (data) => async (dispatch) => {
  if (!data) return;
  const allSyndicates = [];

  const { syndicateInstance, account, web3contractInstance, web3 } = data;
  try {
    const currentBlock = await web3.eth.getBlockNumber();

    const events = await web3contractInstance.getPastEvents("allEvents", {
      fromBlock: currentBlock - 10,
      toBlock: "latest",
    });

    const syndicates = [];
    const syndicateDepositors: Depositors = {};

    await events.forEach(async (event) => {
      const { syndicateAddress } = event.returnValues;
      // check whether event belongs to this wallet owner
      if (event.event === "createdSyndicate" && syndicateAddress === account) {
        syndicates.push(syndicateAddress);
      }

      // get syndicates this wallet has invested in
      if (event.event === "lpInvestedInSyndicate") {
        const address = event.returnValues["0"];
        const lpAddress = event.returnValues["1"];

        // record depositors for each address
        if (syndicateDepositors.address) {
          syndicateDepositors.address.depositors += 1;
        } else {
          syndicateDepositors.address.depositors = 0;
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
     */
    for (let index = 0; index < filteredSyndicateAddresses.length; index++) {
      try {
        const syndicate = await getSyndicate(
          filteredSyndicateAddresses[index],
          syndicateInstance
        );

        /**
         * We check whether we have data returned; for the case of an error,
         * the returned value is undefined
         */
        if (syndicate) {
          allSyndicates.push({
            ...syndicate,
            depositors: syndicateDepositors.address?.depositors || 0,
          });
        }
      } catch (error) {
        console.error({ message: "Error retrieving syndicate data" });
      }
    }

    return dispatch({
      data: allSyndicates,
      type: ALL_SYNDICATES,
    });
  } catch (error) {
    console.log({
      error,
      message: "An error occured while retrieving all events",
    });
  }
};

/**
 * retrieves details for a given syndicate
 */
const getSyndicate = async (address: string, syndicateInstance) => {
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  try {
    const syndicateData = await syndicateInstance.getSyndicateValues(address);
    const closeDate = formatDate(new Date(syndicateData.closeDate.toNumber()));
    const createdDate = formatDate(
      new Date(syndicateData.creationDate.toNumber() * 1000)
    );
    const openToDeposits = syndicateData.syndicateOpen;

    const totalDeposits = web3.utils.fromWei(
      syndicateData.totalDeposits.toString()
    );

    const maxTotalDeposits = web3.utils.fromWei(
      syndicateData.maxTotalDeposits.toString()
    );

    return {
      address,
      openToDeposits,
      closeDate,
      maxTotalDeposits,
      totalDeposits,
      createdDate,
      inactive: syndicateData.inactive,
    };
  } catch (error) {
    console.log({ error });
  }
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
