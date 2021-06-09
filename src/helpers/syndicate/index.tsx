import { Syndicate } from "@/@types/syndicate";
import HorizontalDivider from "@/components/horizontalDivider";
import {
  getTokenDecimals,
  processSyndicateDetails,
} from "@/redux/actions/syndicates";
import { getWeiAmount } from "@/utils/conversions";
import React from "react";
import { getEvents } from "../retrieveEvents";

/**
 * retrieves details for a given syndicate
 */
export const getSyndicate = async (
  syndicateAddress: string,
  syndicateContractInstance
): Promise<Syndicate> => {
  try {
    const syndicate = await syndicateContractInstance.methods
      .getSyndicateValues(syndicateAddress)
      .call();

    const tokenDecimals = await getTokenDecimals(syndicate.depositERC20Address);

    const syndicateDetails = processSyndicateDetails(syndicate, tokenDecimals);

    const managerSetterDistribution = await getEvents(
      syndicateContractInstance,
      "managerSetterDistribution",
      { syndicateAddress }
    );

    const distributionsEnabled =
      managerSetterDistribution.length && !syndicate.open ? true : false;

    return {
      ...syndicateDetails,
      syndicateAddress,
      distributionsEnabled,
    };
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

/**
 * This method creates a list of loader items
 * @param {number} count the number of loader items to be rendered
 * @returns {array} animations list of loader items
 */
export const showLoader = (count) => {
  const animations = [];
  for (let i = 0; i < count; i++) {
    animations.push(
      <div key={i}>
        <div className="w-full flex justify-between sm:m-auto">
          <div className="flex flex-1">
            <div className="image"></div>
            <div className="w-3/4">
              <div className="custom-animation w-full my-2 h-2"></div>
              <div className="custom-animation w-1/2 my-2 h-2"></div>
            </div>
          </div>
          <div className="card-placeholder w-16 sm:w-24 mb-2"></div>
        </div>
        <HorizontalDivider />
      </div>
    );
  }
  return animations;
};

/**
 * Retrieves member details for a given syndicate
 *
 * @param {object} syndicateContractInstance - web3 contract instance
 * @param {string} syndicateAddress - address to get member details from.
 * @param {string} memberAddress - member address to get details from a syndicate
 * @param {number} currentERC20Decimals - token decimals
 * @returns {object} - memberDeposits, memberTotalWithdrawals and memberAddressAllowed
 *
 */
export const getSyndicateMemberInfo = async (
  syndicateContractInstance,
  syndicateAddress,
  memberAddress,
  currentERC20Decimals = 18
) => {
  return await syndicateContractInstance.methods
    .getMemberInfo(syndicateAddress, memberAddress)
    .call()
    .then(async (result) => {
      const memberDeposits = parseInt(
        getWeiAmount(result[0], currentERC20Decimals, false)
      );

      const memberTotalWithdrawals = parseInt(
        getWeiAmount(result[1], currentERC20Decimals, false)
      );

      const memberAddressAllowed = result[2];

      return { memberDeposits, memberTotalWithdrawals, memberAddressAllowed };
    })
    .catch(() => {
      return {
        memberDeposits: 0,
        memberTotalWithdrawals: 0,
        memberAddressAllowed: false,
      };
    });
};
