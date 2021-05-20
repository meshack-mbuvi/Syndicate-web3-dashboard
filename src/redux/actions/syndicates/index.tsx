import { getPastEvents } from "@/helpers/retrieveEvents";
import { formatDate } from "@/utils";
import { basisPointsToPercentage, getWeiAmount } from "@/utils/conversions";
import { ERC20TokenDetails } from "@/utils/ERC20Methods";
import { getSyndicate } from "src/helpers/syndicate";
import {
  ADD_NEW_INVESTMENT,
  ALL_SYNDICATES,
  INVALID_SYNDICATE_ADDRESS,
  SET_LOADING,
  SYNDICATE_BY_ADDRESS,
} from "../types";

interface SyndicateInfo {
  [address: string]: {
    depositors: number;
    activities: number;
  };
}

/**
 * Read all syndicates from all events and add them to the store
 * The syndicates added to store are those the wallet account has invested in
 * or is leading
 * @param {object} data
 * @returns
 */
export const addSyndicates = (data) => async (dispatch) => {
  if (!data) return;

  const { account, web3contractInstance } = data;
  try {
    dispatch({
      data: true,
      type: SET_LOADING,
    });
    const events = await getPastEvents(web3contractInstance);

    const syndicates = [];
    const syndicateInfo: SyndicateInfo = {};

    await events.forEach(async (event) => {
      const { syndicateAddress } = event.returnValues;
      // check whether event belongs to this wallet owner
      if (syndicateAddress === account) {
        syndicates.push(syndicateAddress);
        syndicateInfo[syndicateAddress] = {
          activities: 0,
          depositors: 0,
        };
      }

      // get syndicates this wallet has invested in
      if (event.event === "lpInvestedInSyndicate") {
        const address = event.returnValues["0"];
        const lpAddress = event.returnValues["1"];

        // record depositors for each address
        if (syndicateInfo[address] && syndicateInfo[address]["depositors"]) {
          syndicateInfo[address]["depositors"] += 1;
        } else {
          syndicateInfo[address] = { ...syndicateInfo[address], depositors: 1 };
        }

        // save activities for the syndicate
        if (syndicateInfo[address] && syndicateInfo[address]["activities"]) {
          syndicateInfo[address]["activities"] += 1;
        } else {
          syndicateInfo[address] = { ...syndicateInfo[address], activities: 1 };
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
          web3contractInstance
        );
        const { syndicateAddress } = syndicate;
        /**
         * We check whether we have data returned; for the case of an error,
         * the returned value is undefined
         */
        if (syndicate) {
          allSyndicates.push({
            ...syndicate,
            ...syndicateInfo[syndicateAddress],
          });
        }
      } catch (error) {
        console.log({ error });
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

/**
 * Retrieve single syndicate from the contract by syndicateAddress
 */
export const getSyndicateByAddress = (
  syndicateAddress: string | string[],
  syndicateContractInstance
) => async (dispatch) => {
  try {
    const syndicate = await syndicateContractInstance.methods
      .getSyndicateValues(syndicateAddress)
      .call();

    const tokenDecimals = await getTokenDecimals(
      syndicate.depositERC20ContractAddress
    );

    const syndicateDetails = processSyndicateDetails(syndicate, tokenDecimals);

    // set these incase they are not reset
    dispatch({
      data: { syndicateAddressIsValid: true, syndicateFound: true },
      type: INVALID_SYNDICATE_ADDRESS,
    });

    // set syndicate details
    return dispatch({
      data: syndicateDetails,
      type: SYNDICATE_BY_ADDRESS,
    });
  } catch (err) {
    // syndicate not found
    // syndicateAddress is not valid
    dispatch({
      data: { syndicateAddressIsValid: false, syndicateFound: false },
      type: INVALID_SYNDICATE_ADDRESS,
    });
  }
};

// get number of decimal places for any ERC20 contract address
export const getTokenDecimals = async (contractAddress: string) => {
  try {
    const ERC20Details = new ERC20TokenDetails(contractAddress);
    const tokenDecimals = await ERC20Details.getTokenDecimals();
    return tokenDecimals;
  } catch (error) {
    // we should return default value here which is 18
    return 18;
  }
};

/**
 * This method formats syndicate data to be displayed in frontend
 * @param syndicateData an object containing syndicate data
 * @param tokenDecimals
 * @returns {} an object containing formatted syndicate data
 */
export const processSyndicateDetails = (syndicateData, tokenDecimals = 18) => {
  if (!syndicateData) return;
  let {
    modifiable,
    creationDate,
    syndicateProfitShareBasisPoints,
    managerPerformanceFeeBasisPoints,
    managerManagementFeeBasisPoints,
    depositERC20ContractAddress,
    syndicateOpen,
    currentManager,
    distributionsEnabled,
    maxTotalDeposits,
    totalDeposits,
    minDeposit,
    maxDeposit,
    totalLPs,
    maxLPs,
    allowlistEnabled,
  } = syndicateData;

  const closeDate = formatDate(
    new Date(parseInt(syndicateData.closeDate) * 1000)
  );

  /**
   * block.timestamp which is the one used to save creationDate is in
   * seconds. We multiply by 1000 to convert to milliseconds and then
   * convert this to javascript date object
   */
  const createdDate = formatDate(new Date(parseInt(creationDate) * 1000));

  const profitShareToSyndicateProtocol = basisPointsToPercentage(
    syndicateProfitShareBasisPoints
  );

  const profitShareToSyndicateLead = basisPointsToPercentage(
    managerPerformanceFeeBasisPoints
  );

  managerManagementFeeBasisPoints = basisPointsToPercentage(
    managerManagementFeeBasisPoints
  );

  const openToDeposits = syndicateOpen;
  maxTotalDeposits = getWeiAmount(maxTotalDeposits, tokenDecimals, false);

  totalDeposits = getWeiAmount(totalDeposits, tokenDecimals, false);
  minDeposit = getWeiAmount(minDeposit, tokenDecimals, false);

  maxDeposit = getWeiAmount(maxDeposit, tokenDecimals, false);

  return {
    minDeposit,
    maxDeposit,
    maxTotalDeposits,
    profitShareToSyndicateProtocol,
    profitShareToSyndicateLead,
    openToDeposits,
    totalDeposits,
    closeDate,
    createdDate,
    allowlistEnabled,
    depositERC20ContractAddress,
    currentManager,
    syndicateOpen,
    distributionsEnabled,
    managerManagementFeeBasisPoints,
    maxLPs,
    modifiable,
    tokenDecimals,
    totalLPs,
    totalDepositors: totalLPs,
  };
};
