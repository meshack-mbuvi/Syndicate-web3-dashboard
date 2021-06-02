import { Syndicate } from "@/@types/syndicate";
import { getSyndicate } from "@/helpers";
import { getEvents } from "@/helpers/retrieveEvents";
import { formatDate } from "@/utils";
import { basisPointsToPercentage, getWeiAmount } from "@/utils/conversions";
import { pastDate } from "@/utils/dateUtils";
import { ERC20TokenDetails } from "@/utils/ERC20Methods";
import { TokenMappings } from "src/utils/tokenMappings";
import { web3 } from "src/utils/web3Utils";
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
 * This function does the following:
 * 1. get all managerCreatedSyndicate and memberDeposited filtered by account connected
 * 2. process all the above events to get all syndicates for this account
 * The syndicates added to store are those the wallet account has invested in
 * or is leading
 * @param {object} data
 * @returns
 */
export const addSyndicates = (data) => async (dispatch) => {
  if (!data) return;

  const { account, syndicateContractInstance } = data;
  try {
    dispatch({
      data: true,
      type: SET_LOADING,
    });

    const syndicates = [];
    const syndicateInfo: SyndicateInfo = {};

    const managerCreatedSyndicateEvents = await getEvents(
      syndicateContractInstance,
      "managerCreatedSyndicate",
      { syndicateAddress: account }
    );

    const memberDepositedEvents = await getEvents(
      syndicateContractInstance,
      "memberDeposited"
    );

    await managerCreatedSyndicateEvents.forEach(async (event) => {
      const { syndicateAddress } = event.returnValues;
      // check whether event belongs to this wallet owner
      if (syndicateAddress === account) {
        syndicates.push(syndicateAddress);
        syndicateInfo[syndicateAddress] = {
          activities: 0,
          depositors: 0,
        };
      }
    });

    await memberDepositedEvents.forEach(async (event) => {
      const address = event.returnValues["0"];
      const memberAddress = event.returnValues["1"];

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

      if (memberAddress === account) {
        // we need to check whether lpAddress matches this wallet account
        // meaning this account has invested in this wallet
        // we use default for fields missing in the event
        // syndicate details will be retrieved during display
        syndicates.push(address);
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
          syndicateContractInstance
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
      data: allSyndicates,
      type: ALL_SYNDICATES,
    });

    return dispatch({
      data: false,
      type: SET_LOADING,
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

    const tokenDecimals = await getTokenDecimals(syndicate.depositERC20Address);

    const syndicateDetails = processSyndicateDetails(syndicate, tokenDecimals);

    const managerSetterDistributionERC20Address = await getEvents(
      syndicateContractInstance,
      "managerSetterDistributionERC20Address",
      { syndicateAddress }
    );

    const distributionsEnabled =
      managerSetterDistributionERC20Address.length && !syndicate.open
        ? true
        : false;

    // set these incase they are not reset
    dispatch({
      data: { syndicateAddressIsValid: true, syndicateFound: true },
      type: INVALID_SYNDICATE_ADDRESS,
    });

    // set syndicate details
    return dispatch({
      data: { ...syndicateDetails, distributionsEnabled },
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
export const processSyndicateDetails = (
  syndicateData,
  tokenDecimals = 18
): Syndicate => {
  if (!syndicateData) return;
  let {
    allowlistEnabled,
    dateClose,
    dateCreation,
    depositERC20Address,
    depositMaxMember,
    depositMaxTotal,
    depositMinMember,
    depositTotal,
    managerCurrent,
    managerFeeAddress,
    managerManagementFeeBasisPoints,
    managerPending,
    managerPerformanceFeeBasisPoints,
    modifiable,
    numMembersCurrent,
    numMembersMax,
    syndicateProfitShareBasisPoints,
    open,
  } = syndicateData;

  const closeDate = formatDate(new Date(parseInt(dateClose) * 1000));

  // get deposit token symbol
  let depositERC20TokenSymbol = "";
  const mappedTokenAddress = Object.keys(TokenMappings).find(
    (key) =>
      web3.utils.toChecksumAddress(key) ===
      web3.utils.toChecksumAddress(depositERC20Address)
  );
  if (mappedTokenAddress) {
    depositERC20TokenSymbol = TokenMappings[mappedTokenAddress];
  } else {
    depositERC20TokenSymbol = "Unknown";
  }

  /**
   * block.timestamp which is the one used to save creationDate is in
   * seconds. We multiply by 1000 to convert to milliseconds and then
   * convert this to javascript date object
   */
  const createdDate = formatDate(new Date(parseInt(dateCreation) * 1000));

  const profitShareToSyndicateProtocol = basisPointsToPercentage(
    syndicateProfitShareBasisPoints
  );

  const profitShareToSyndicateLead = basisPointsToPercentage(
    managerPerformanceFeeBasisPoints
  );

  managerManagementFeeBasisPoints = basisPointsToPercentage(
    managerManagementFeeBasisPoints
  );

  const depositsEnabled = !pastDate(new Date(parseInt(dateClose) * 1000));

  const status =
    depositsEnabled && parseInt(depositTotal) < parseInt(depositMaxTotal)
      ? `Open until ${closeDate}`
      : "Operating";

  return {
    status,
    open,
    managerFeeAddress,
    depositsEnabled,
    depositMinMember: getWeiAmount(depositMinMember, tokenDecimals, false),
    depositMaxMember: getWeiAmount(depositMaxMember, tokenDecimals, false),
    depositMaxTotal: getWeiAmount(depositMaxTotal, tokenDecimals, false),
    profitShareToSyndicateProtocol,
    profitShareToSyndicateLead,
    depositTotal: getWeiAmount(depositTotal, tokenDecimals, false),
    closeDate,
    createdDate,
    allowlistEnabled,
    depositERC20Address,
    managerCurrent,
    managerPending,
    managerManagementFeeBasisPoints,
    numMembersMax,
    modifiable,
    tokenDecimals,
    depositERC20TokenSymbol,
    numMembersCurrent,
    syndicateProfitShareBasisPoints,
    managerPerformanceFeeBasisPoints: profitShareToSyndicateLead,
  };
};
