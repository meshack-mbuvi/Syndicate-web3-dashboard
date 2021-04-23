import HorizontalDivider from "@/components/horizontalDivider";
import React from "react";
import { formatDate } from "src/utils";
const Web3 = require("web3");

/**
 * retrieves details for a given syndicate
 */
export const getSyndicate = async (address: string, syndicateInstance) => {
  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  try {
    const syndicateData = await syndicateInstance.getSyndicateValues(address);

    // The value stored in syndicate during creation is in seconds, hence the need
    // to multiply by 1000 to convert to milliseconds and then initialize a
    // date object
    const closeDate = formatDate(
      new Date(syndicateData.closeDate.toNumber() * 1000)
    );
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
    const { depositERC20ContractAddress, currentManager } = syndicateData;

    return {
      address,
      openToDeposits,
      closeDate,
      maxTotalDeposits,
      totalDeposits,
      createdDate,
      depositors: 0, // depositors does not exist in returned data; it will be
      //recalculated by counting all lpInvestInsyndicate events
      active: true,
      currentManager,
      depositERC20ContractAddress,
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
              <div className="animated w-full my-2 h-2"></div>
              <div className="animated w-1/2 my-2 h-2"></div>
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
