import { divideIfNotByZero, getWeiAmount } from "@/utils/conversions";
import {
  CONFIRM_RETURN_DEPOSIT,
  RETURNING_DEPOSIT,
  SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
  SET_SELECTED_MEMBER_ADDRESS,
  SET_SYNDICATE_MANAGE_MEMBERS,
  SHOW_REJECT_MEMBER_ADDRESS_ONLY,
} from "../types";

/**
 * Action creator for loading state when loading manage member distribution
 *  details.
 *
 * @param loading
 * @returns
 */
export const setLoadingSyndicateDepositorDetails =
  (loading: boolean) =>
  (dispatch): void => {
    return dispatch({
      type: SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
      data: loading,
    });
  };

/** Set new member addresses efore allowlist action completes
 *
 * @param memberAdresses
 * @returns
 */
export const setNewMemberAddresses =
  (
    newMemberAddresses: Array<{
      memberAddress: string;
      memberDeposit: string;
      memberClaimedDistribution: string;
      memberStake: string;
      allowlistEnabled: boolean;
      memberAddressAllowed: boolean;
    }>,
  ) =>
  (dispatch): void => {
    return dispatch({
      type: SET_NEW_MEMBER_ADDRESSES,
      data: newMemberAddresses,
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
    const depositEvents =
      await syndicateContracts.DepositLogicContract.getMemberDepositEvents(
        "DepositAdded",
        { syndicateAddress },
      );
    // This event is emitted when syndicate cap table is overriden
    const depositOverriddenEvents =
      await syndicateContracts.DepositLogicContract.getMemberDepositEvents(
        "DepositOverridden",
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

    depositOverriddenEvents.forEach((event) => {
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
export const getMemberDetails = async (
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
  const { memberAddressAllowed } =
    await syndicateContracts.GetterLogicContract.getMemberInfo(
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
    const memberAllowedEvents =
      await syndicateContracts?.AllowlistLogicContract.getAllowlistEvents(
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
export const getSyndicateDepositorData =
  () =>
  async (
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

    // show loader
    dispatch({
      type: SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
      data: true,
    });

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
      if (memberInfo)
        syndicateMemberData.push({ ...memberInfo, returningDeposit: false });
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

export const setShowRejectAddressOnly = (value: boolean) => (dispatch) => {
  return dispatch({
    type: SHOW_REJECT_MEMBER_ADDRESS_ONLY,
    data: value,
  });
};

export const setReturningMemberDeposit =
  ({
    memberAddresses,
    returningDeposit,
  }: {
    memberAddresses: string[];
    returningDeposit: boolean;
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

        memberCopy[memberIndex].returningDeposit = returningDeposit;
        syndicateMembersCopy = memberCopy;
      }
    });

    return dispatch({
      data: syndicateMembersCopy,
      type: RETURNING_DEPOSIT,
    });
  };

export const showConfirmReturnDeposit = (confirm: boolean) => (dispatch) => {
  return dispatch({ type: CONFIRM_RETURN_DEPOSIT, data: confirm });
};

export const setSelectedMemberAddress =
  (selectedMemberAddress: string[], totalAmountToReturn: number | string) =>
  (
    dispatch: (arg0: {
      type: string;
      data: {
        selectedMemberAddress: string[];
        totalAmountToReturn: string | number;
      };
    }) => React.Dispatch<{ type: string; data: boolean }>,
  ): React.Dispatch<{ type: string; data: boolean }> => {
    return dispatch({
      type: SET_SELECTED_MEMBER_ADDRESS,
      data: { selectedMemberAddress, totalAmountToReturn },
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
