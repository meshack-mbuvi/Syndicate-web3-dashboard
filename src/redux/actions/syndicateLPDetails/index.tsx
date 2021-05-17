import { floatedNumberWithCommas } from "@/utils/numberWithCommas";
import { divideIfNotByZero, getWeiAmount } from "src/utils/conversions";
import {
  LOADING_SYNDICATE_LP_DETAILS,
  SET_SYNDICATE_LP_DETAILS,
} from "../types";

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
  syndicateContractInstance: any;
  lpAccount: string;
  web3: any;
  syndicateAddress: string | string[];
  syndicateDepositsTotal: string;
  totalAvailableDistributions: string;
  currentERC20Decimals: number;
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
    syndicateContractInstance,
    lpAccount,
    syndicateAddress,
    syndicateDepositsTotal,
    totalAvailableDistributions,
    currentERC20Decimals,
  } = data;

  // we cannot query relevant values without the syndicate instance
  if (!syndicateContractInstance) return;

  // Retrieves syndicateInfo for the connected wallet. We need to find out
  // how much the wallet account has invested in this syndicate
  try {
    setSyndicateLPDetailsLoading(true);
    const syndicateLPInfo = await syndicateContractInstance.methods
      .getSyndicateLPInfo(syndicateAddress, lpAccount)
      .call();

    const [lpDeposits, lpWithdrawals, myAddressAllowed] = syndicateLPInfo;

    // update total LP deposits
    const myDeposits = getWeiAmount(lpDeposits, currentERC20Decimals, false);

    // update LP's withdrawals to date
    const myWithdrawalsToDate = getWeiAmount(
      lpWithdrawals,
      currentERC20Decimals,
      false
    );

    // update LP's withdrawals to deposits percentage
    let withdrawalsToDepositPercentage = 0;
    const withdrawalsToDate = parseFloat(myWithdrawalsToDate) * 100;
    const myTotalDeposits = parseFloat(myDeposits);

    withdrawalsToDepositPercentage = divideIfNotByZero(
      withdrawalsToDate,
      myTotalDeposits
    );

    // get the current LP's percentage share in the syndicate
    // (totalLPDeposits / totalSyndicateDeposits) * 100
    const myLPDeposits = parseFloat(myDeposits) * 100;
    const totalSyndicateDeposits = parseFloat(
      syndicateDepositsTotal.toString()
    );
    const myPercentageOfThisSyndicate = divideIfNotByZero(
      myLPDeposits,
      totalSyndicateDeposits
    );

    // update LP's total distributions to date
    // totalDistributions * (deposit/totalDeposits)
    const totalSyndicateDistributions = parseFloat(totalAvailableDistributions);
    const myDistributionsToDate =
      (totalSyndicateDistributions * myPercentageOfThisSyndicate) / 100;

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
