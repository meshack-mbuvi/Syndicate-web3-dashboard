import { formatDate } from "src/utils";
const Web3 = require("web3");

/**
 * retrieves details for a given syndicate
 */
export const getSyndicate = async (address: string, syndicateInstance) => {
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
      depositors: 0, // depositors does not exist in returned data; it will be
      //recalculated by counting all lpInvestInsyndicate events
      inactive: syndicateData.inactive,
    };
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
