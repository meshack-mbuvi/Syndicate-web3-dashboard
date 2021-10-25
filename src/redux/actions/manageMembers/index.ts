import { divideIfNotByZero, getWeiAmount } from "@/utils/conversions";
import {
  ADD_TO_SYNDICATE_MEMBERS,
  CONFIRM_RETURN_DEPOSIT,
  RETURNING_DEPOSIT,
  SELECTED_MEMBER,
  SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
  SET_SELECTED_MEMBER_ADDRESS,
  SET_SYNDICATE_MANAGE_MEMBERS,
  SHOW_TRANSFER_DEPOSIT_MODAL,
  TRANSFERRING_DEPOSIT,
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
  (memberAddresses: string[], addingMember) =>
  (
    dispatch,
    getState: () => {
      manageMembersDetailsReducer: {
        syndicateManageMembers: {
          syndicateMembers;
        };
      };
    },
  ): void => {
    const {
      manageMembersDetailsReducer: {
        syndicateManageMembers: { syndicateMembers },
      },
    } = getState();
    const members = [];

    memberAddresses.forEach((memberAddress) => {
      // find whether memberAddress exists in current members, if exists, set addingMember to true
      const indexOfMember = findMemberAddressIndex(
        syndicateMembers,
        memberAddress,
      );

      // member exists in current list
      if (indexOfMember >= 0) {
        syndicateMembers[indexOfMember].addingMember = addingMember;

        // addingMember is set to false when adding member to allowlist is successful.
        if (!addingMember) {
          syndicateMembers[indexOfMember].memberAddressAllowed = true;
        }
      } else {
        // If address does not exist, add a new member object on top of the list.
        members.push({
          memberAddress,
          memberDeposit: "0",
          memberClaimedDistribution: "0",
          allowlistEnabled: true,
          memberAddressAllowed: true,
          memberStake: "0.00",
          addingMember: addingMember,
        });
      }
    });

    return dispatch({
      type: SET_SYNDICATE_MANAGE_MEMBERS,
      data: [...members, ...syndicateMembers],
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

    // get DepositTransferred events
    const depositTransferredEvents =
      await syndicateContracts.DepositTransferLogicContract.getDepositTransferredEvents(
        "DepositTransferred",
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

    depositTransferredEvents.forEach((event) => {
      const {
        returnValues: { targetAddress },
      } = event;
      memberAddresses.push(targetAddress);
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
    dispatch({
      type: SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
      data: true,
    });
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

    const syndicateMemberData = [];

    for (let index = 0; index < uniqueMemberAddressese.length; index++) {
      const memberInfo = await getMemberDetails(
        syndicateContracts,
        uniqueMemberAddressese[index],
        syndicate,
      );
      if (memberInfo)
        syndicateMemberData.push({
          ...memberInfo,
          returningDeposit: false,
          blockingAddress: false,
          addingMember: false,
          transferringDeposit: false,
          modifyingDeposits: false,
        });
    }

    dispatch({
      type: SET_SYNDICATE_MANAGE_MEMBERS,
      data: syndicateMemberData,
    });
    dispatch({
      type: SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
      data: false,
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

export const setSelectedMember =
  (member: {
    distributing: boolean;
    memberAddress: string;
    memberDeposit: string;
    modifiable: boolean;
    open: boolean;
    memberAddressAllowed: boolean;
    allowlistEnabled: boolean;
  }) =>
  (dispatch) => {
    return dispatch({
      type: SELECTED_MEMBER,
      data: member,
    });
  };

export const setShowTransferDepositModal = (status: boolean) => (dispatch) => {
  return dispatch({
    type: SHOW_TRANSFER_DEPOSIT_MODAL,
    data: status,
  });
};

export const setTransferringMemberDeposit =
  ({
    memberAddress,
    transferringDeposit,
  }: {
    memberAddress: string;
    transferringDeposit: boolean;
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
    let memberIndex = -1;
    if (memberAddress) {
      memberIndex = findMemberAddressIndex(syndicateMembers, memberAddress);
      const memberCopy = syndicateMembers;

      memberCopy[memberIndex].transferringDeposit = transferringDeposit;
      syndicateMembersCopy = memberCopy;
    }

    return dispatch({
      data: syndicateMembersCopy,
      type: TRANSFERRING_DEPOSIT,
    });
  };

export const addToSyndicateMembers = (members) => (dispatch) => {
  return dispatch({
    data: members,
    type: ADD_TO_SYNDICATE_MEMBERS,
  });
};
