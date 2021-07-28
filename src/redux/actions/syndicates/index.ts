import { Syndicate } from "@/@types/syndicate";
import { getSyndicate } from "@/helpers";
import { AppThunk } from "@/redux/store";
import { formatDate } from "@/utils";
import { basisPointsToPercentage, getWeiAmount } from "@/utils/conversions";
import { pastDate } from "@/utils/dateUtils";
import { ERC20TokenDetails } from "@/utils/ERC20Methods";

import { getCoinFromContractAddress } from "functions/src/utils/ethereum";
import {
  ADD_NEW_INVESTMENT,
  ALL_SYNDICATES,
  FOUND_SYNDICATE_ADDRESS,
  INVALID_SYNDICATE_ADDRESS,
  SET_LOADING,
  SET_MANAGER_FEE_ADDRESS,
  SYNDICATE_BY_ADDRESS,
  UPDATE_SYNDICATE_DETAILS,
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
export const getSyndicates = (data) => async (dispatch) => {
  if (!data) return;

  const {
    account,
    GetterLogicContract,
    ManagerLogicContract,
    DistributionLogicContract,
    DepositLogicContract,
  } = data;

  if (
    !GetterLogicContract ||
    !ManagerLogicContract ||
    !DistributionLogicContract
  )
    return;

  try {
    dispatch({
      data: true,
      type: SET_LOADING,
    });

    const syndicates = [];
    const syndicateInfo: SyndicateInfo = {};

    const accountCreatedSyndicateEvents = await ManagerLogicContract.getSyndicatesForManager(
      account,
    );

    const memberDepositedEvents = await DepositLogicContract.getMemberDepositEvents(
      "DepositAdded",
    );

    await accountCreatedSyndicateEvents.forEach(async (event) => {
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
      const { memberAddress, syndicateAddress: address } = event.returnValues;

      // save activities for the syndicate
      if (syndicateInfo[address] && syndicateInfo[address]["activities"]) {
        syndicateInfo[address]["activities"] += 1;
      } else {
        syndicateInfo[address] = { ...syndicateInfo[address], activities: 1 };
      }

      if (memberAddress === account) {
        // we need to check whether memberAddress matches this wallet account
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
        const syndicate = await GetterLogicContract.getSyndicateValues(
          filteredSyndicateAddresses[index],
        );
        const syndicateDetails = await getSyndicate(syndicate);
        const { syndicateAddress } = syndicate;

        /**
         * We check whether we have data returned; for the case of an error,
         * the returned value is undefined
         */
        if (syndicateDetails) {
          allSyndicates.push({
            ...syndicateDetails,
            ...syndicateInfo[syndicateAddress],
          });
        }
      } catch (error) {}
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
export const getSyndicateByAddress = ({
  syndicateAddress,
  GetterLogicContract,
}): AppThunk => async (dispatch) => {
  try {
    if (!syndicateAddress.trim() || !GetterLogicContract) return;

    const syndicate = await GetterLogicContract.getSyndicateValues(
      syndicateAddress,
    );

    // get token details
    const {
      depositERC20TokenSymbol,
      depositERC20Logo,
      tokenDecimals,
      depositERC20Price,
    } = await getTokenDetails(syndicate.depositERC20Address);

    const syndicateDetails = processSyndicateDetails(
      syndicate,
      tokenDecimals,
      depositERC20TokenSymbol,
      depositERC20Logo,
      depositERC20Price,
    );
    // set these incase they are not reset
    dispatch({
      data: { syndicateAddressIsValid: true, syndicateFound: true },
      type: FOUND_SYNDICATE_ADDRESS,
    });

    // set syndicate details
    return dispatch({
      data: { ...syndicateDetails },
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
    // Default to 18 decimals.
    return 18;
  }
};

// get token details for the deposit ERC20
const getTokenDetails = async (contractAddress: string) => {
  const { symbol, logo, decimals, price } = await getCoinFromContractAddress(
    contractAddress,
  );
  return {
    depositERC20TokenSymbol: symbol,
    depositERC20Logo: logo,
    tokenDecimals: decimals,
    depositERC20Price: price,
  };
};

/**
 * This method formats syndicate data to be displayed in frontend
 * @param syndicateData an object containing syndicate data
 * @param tokenDecimals
 * @returns {} an object containing formatted syndicate data
 */
export const processSyndicateDetails = (
  syndicateData,
  tokenDecimals = 18,
  depositERC20TokenSymbol,
  depositERC20Logo,
  depositERC20Price,
): Syndicate => {
  if (!syndicateData) return;
  let {
    syndicateAddress,
    allowlistEnabled,
    dateClose,
    dateCreated,
    depositERC20Address,
    depositMemberMax,
    depositTotalMax,
    depositMemberMin,
    depositTotal,
    managerCurrent,
    managerFeeAddress,
    managerManagementFeeBasisPoints,
    managerPending,
    managerDistributionShareBasisPoints,
    modifiable,
    numMembersCurrent,
    numMembersMax,
    syndicateDistributionShareBasisPoints,
    open,
    distributing,
  } = syndicateData;

  const closeDate = formatDate(new Date(parseInt(dateClose) * 1000));

  /**
   * block.timestamp which is the one used to save creationDate is in
   * seconds. We multiply by 1000 to convert to milliseconds and then
   * convert this to javascript date object
   */
  const createdDate = formatDate(new Date(parseInt(dateCreated) * 1000));

  const distributionShareToSyndicateProtocol = basisPointsToPercentage(
    syndicateDistributionShareBasisPoints,
  );

  const distributionShareToSyndicateLead = basisPointsToPercentage(
    managerDistributionShareBasisPoints,
  );

  managerManagementFeeBasisPoints = basisPointsToPercentage(
    managerManagementFeeBasisPoints,
  );

  const depositsEnabled = !pastDate(new Date(parseInt(dateClose) * 1000));

  const status =
    depositsEnabled && parseInt(depositTotal) < parseInt(depositTotalMax)
      ? `Open until ${closeDate}`
      : distributing
      ? "Distributing"
      : "Operating";

  return {
    syndicateAddress,
    status,
    open,
    managerFeeAddress,
    depositsEnabled,
    depositMemberMin: getWeiAmount(depositMemberMin, tokenDecimals, false),
    depositMemberMax: getWeiAmount(depositMemberMax, tokenDecimals, false),
    depositTotalMax: getWeiAmount(depositTotalMax, tokenDecimals, false),
    distributionShareToSyndicateProtocol,
    distributionShareToSyndicateLead,
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
    depositERC20Logo,
    depositERC20Price,
    numMembersCurrent,
    syndicateDistributionShareBasisPoints,
    distributing,
    managerDistributionShareBasisPoints: distributionShareToSyndicateLead,
  };
};

export const updateSyndicateManagerFeeAddress = (managerFeeAddress: string) => (
  dispatch,
) => {
  if (!managerFeeAddress) return;

  return dispatch({
    type: SET_MANAGER_FEE_ADDRESS,
    data: managerFeeAddress,
  });
};

/**
 * updates syndicate details upon syndicate settings update
 * @param {*} data
 * @returns
 */
export const updateSyndicateSettingsDetails = (data) => (dispatch) => {
  return dispatch({
    data,
    type: UPDATE_SYNDICATE_DETAILS,
  });
};
