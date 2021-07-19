import { divideIfNotByZero, getWeiAmount } from "@/utils/conversions";
import {
  SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
  SET_SYNDICATE_MANAGE_MEMBERS,
  SHOW_REJECT_MEMBER_ADDRESS_ONLY,
  SHOW_REJECT_MEMBER_DEPOSIT_ONLY,
} from "../types";

/**
 * Action creator for loading state when loading manage member distribution
 *  details.
 *
 * @param loading
 * @returns
 */
export const setLoadingSyndicateDepositorDetails = (loading: boolean) => (
  dispatch,
): void => {
  return dispatch({
    type: SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
    data: loading,
  });
};

/**
 * Retrieve member depositors per given syndicate.
 *
 * @param syndicateContracts
 * @param syndicateAddress
 * @returns
 */
const getSyndicateDepositors = async (syndicateContracts, syndicateAddress) => {
  try {
    const depositEvents = await syndicateContracts.DepositLogicContract.getMemberDepositEvents(
      "DepositAdded",
      { syndicateAddress },
    );

    const memberAddresses = [];
    // process events
    depositEvents.forEach((event) => {
      const {
        returnValues: { memberAddress },
      } = event;
      memberAddresses.push(memberAddress);
    });

    return memberAddresses;
  } catch (error) {
    return [];
  }
};

/**
 * Retrieve member information for a given member address from a given syndicate.
 * @param syndicateContracts
 * @param memberAddress
 * @param syndicate
 * @returns {object} - an object containing:
 *    - memberAddress
 *    - memberDeposit
 *    - memberStake
 *    - memberClaimedDistribution
 */
const getMemberDetails = async (
  syndicateContracts,
  memberAddress,
  syndicate,
) => {
  const { syndicateAddress, depositTotal } = syndicate;
  try {
    let {
      memberDeposit,
      // eslint-disable-next-line prefer-const
      memberAddressAllowed,
      // eslint-disable-next-line prefer-const
      memberClaimedDistribution,
    } = await syndicateContracts.GetterLogicContract.getMemberInfo(
      syndicateAddress,
      memberAddress,
    );

    memberDeposit = getWeiAmount(memberDeposit, syndicate.tokenDecimals, false);

    const memberStake = divideIfNotByZero(
      +memberDeposit * 100,
      +depositTotal,
    ).toFixed(2);

    return {
      memberAddress,
      memberDeposit,
      memberStake,
      memberClaimedDistribution,
      memberAddressAllowed,
    };
  } catch (error) {
    return null;
  }
};

/**
 * Checks whether address is allowed to make deposits
 *
 * @param syndicateContracts
 * @param syndicateAddress
 * @param memberAddress
 * @returns
 */
export const isAddressAllowed = async (
  syndicateContracts: {
    GetterLogicContract: {
      getMemberInfo: (
        arg0: any,
        arg1: any,
      ) =>
        | PromiseLike<{ memberAddressAllowed: any }>
        | { memberAddressAllowed: any };
    };
  },
  syndicateAddress: any,
  memberAddress: any,
): Promise<boolean> => {
  const {
    memberAddressAllowed,
  } = await syndicateContracts.GetterLogicContract.getMemberInfo(
    syndicateAddress,
    memberAddress,
  );
  return memberAddressAllowed;
};

/**
 *
 * @param syndicateContracts
 * @param syndicateAddress
 * @returns
 */
const getMembersInAllowlist = async (
  syndicateContracts: any,
  syndicateAddress: any,
) => {
  if (!syndicateAddress.trim()) return [];

  try {
    const memberAllowedEvents = await syndicateContracts?.AllowlistLogicContract.getAllowlistEvents(
      "AddressAllowed",
      { syndicateAddress },
    );

    // get member address from each event and return the addresses
    const memberAddresses = await memberAllowedEvents.map(
      ({ returnValues: { memberAddress } }) => memberAddress,
    );

    const allowedMemberAddress = [];

    for (let index = 0; index < memberAddresses.length; index++) {
      // Address might have been rejected afterwards.
      // we have to check whether its still allowed to make deposits.
      const addressAllowed = await isAddressAllowed(
        syndicateContracts,
        syndicateAddress,
        memberAddresses[index],
      );
      if (addressAllowed) {
        allowedMemberAddress.push(memberAddresses[index]);
      }
    }
    return allowedMemberAddress;
  } catch (error) {
    return [];
  }
};

/**
 * Retrieves all deposits in a given syndicate and if allowlistEnabled is active,
 * all members in the allowlist are retrieved as well.
 * @returns
 */
export const getSyndicateDepostorData = () => async (
  dispatch: (arg0: { type: string; data: any }) => any,
  getState: () => {
    syndicatesReducer: { syndicate: any };
    initializeContractsReducer: { syndicateContracts: any };
  },
): Promise<void> => {
  const {
    syndicatesReducer: { syndicate },
    initializeContractsReducer: { syndicateContracts },
  } = getState();

  const memberAddresses = await getSyndicateDepositors(
    syndicateContracts,
    syndicate.syndicateAddress,
  );

  // when allowlist is enabled, retrieve all allowed addresses
  let allowedMembers = [];
  if (syndicate.allowlistEnabled) {
    allowedMembers = await getMembersInAllowlist(
      syndicateContracts,
      syndicate.syndicateAddress,
    );
  }
  const allMemberAddress = [...memberAddresses, ...allowedMembers];

  // Note: A member may have made several deposits during the lifetime of a
  // given syndicate. So we need to get unique member addresses.
  const uniqueMemberAddressese = await Array.from(new Set(allMemberAddress));
  if (!uniqueMemberAddressese.length)
    // Syndicate does not have investors at the moment or no members in
    // the allowlist

    return dispatch({
      type: SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
      data: false,
    });

  const syndicateMemberData = [];

  for (let index = 0; index < uniqueMemberAddressese.length; index++) {
    const memberInfo = await getMemberDetails(
      syndicateContracts,
      uniqueMemberAddressese[index],
      syndicate,
    );
    if (memberInfo) syndicateMemberData.push(memberInfo);
  }
  dispatch({
    type: SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
    data: false,
  });

  return dispatch({
    type: SET_SYNDICATE_MANAGE_MEMBERS,
    data: syndicateMemberData,
  });
};

export const setShowRejectDepositOnly = (value: boolean) => (dispatch) => {
  return dispatch({
    type: SHOW_REJECT_MEMBER_DEPOSIT_ONLY,
    data: value,
  });
};

export const setShowRejectAddressOnly = (value: boolean) => (dispatch) => {
  return dispatch({
    type: SHOW_REJECT_MEMBER_ADDRESS_ONLY,
    data: value,
  });
};
