import {
  LOADING_SYNDICATE_LP_DETAILS,
  SET_SYNDICATE_LP_DETAILS,
} from "../types";
import { floatedNumberWithCommas } from "@/utils/numberWithCommas";

export const setSyndicateLPDetails = (data) => {
  return {
    type: SET_SYNDICATE_LP_DETAILS,
    data,
  };
};

export const setSyndicateLPDetailsLoading = (data) => {
  return {
    type: LOADING_SYNDICATE_LP_DETAILS,
    data,
  };
};

interface SyndicateLPData {
  syndicateInstance: any;
  lpAccount: string;
  web3: any;
  syndicateAddress: string | string[];
  syndicate: any;
  totalAvailableDistributions: string;
}

/** action creator to trigger updates to the redux store whenever
 * an LP withdraws from or invests in a syndicate.
 * this action will store all LP values for the current syndicate.
 * @param SyndicateLPData values from the interface above
 * @returns dispatched syndicate LP values
 */
export const updateSyndicateLPDetails = (data: SyndicateLPData) => async (
  dispatch
) => {
  const {
    syndicateInstance,
    lpAccount,
    web3,
    syndicateAddress,
    syndicate,
    totalAvailableDistributions,
  } = data;

  // we cannot query relevant values without the syndicate instance
  if (!syndicateInstance) return;

  // Retrieves syndicateInfo for the connected wallet. We need to find out
  // how much the wallet account has invested in this syndicate
  try {
    setSyndicateLPDetailsLoading(true);
    const syndicateLPInfo = await syndicateInstance.getSyndicateLPInfo(
      syndicateAddress,
      lpAccount
    );

    // update total LP deposits
    const myDeposits = web3.utils.fromWei(syndicateLPInfo[0].toString());

    // update LP's withdrawals to date
    const myWithdrawalsToDate = web3.utils.fromWei(
      syndicateLPInfo[1].toString()
    );

    // check if LP is on the allowedAddresses list
    const myAddressAllowed = syndicateLPInfo[2];

    // update LP's withdrawals to deposits percentage
    let withdrawalsToDepositPercentage = 0;
    if (
      parseInt(myDeposits.toString()) > 0 &&
      parseInt(myWithdrawalsToDate.toString()) > 0
    ) {
      withdrawalsToDepositPercentage =
        (parseFloat(myWithdrawalsToDate.toString()) /
          parseFloat(myDeposits.toString())) *
        100;
    }

    // get the current LP's percentage share in the syndicate
    // (totalLPDeposits / totalSyndicateDeposits) * 100
    const myLPDeposits = parseFloat(myDeposits.toString());
    const totalSyndicateDeposits = syndicate?.totalDeposits;
    let myPercentageOfThisSyndicate = 0;
    if (totalSyndicateDeposits > 0) {
      myPercentageOfThisSyndicate =
        (myLPDeposits * 100) / totalSyndicateDeposits;
    }

    // update LP's total distributions to date
    // totalDistributions * (deposit/totalDeposits)
    const totalSyndicateDistributions = parseFloat(totalAvailableDistributions);
    const myDistributionsToDate =
      totalSyndicateDistributions * (myPercentageOfThisSyndicate / 100);

    const syndicateLPDetails = {
      myDeposits,
      myPercentageOfThisSyndicate,
      myWithdrawalsToDate,
      withdrawalsToDepositPercentage,
      myDistributionsToDate,
      myAddressAllowed,
    };

    // format all syndicate LP details
    // values should have commas, if they are longer than 3 characters long
    // and be rounded to two decimal places.
    Object.keys(syndicateLPDetails).map((key) => {
      if (key !== "myAddressAllowed") {
        syndicateLPDetails[key] = floatedNumberWithCommas(
          syndicateLPDetails[key]
        );
      }
      return;
    });

    // dispatch action to update syndicate LP details
    dispatch(setSyndicateLPDetails(syndicateLPDetails));
    setSyndicateLPDetailsLoading(false);
  } catch (error) {
    console.log({ error });
  }
};
