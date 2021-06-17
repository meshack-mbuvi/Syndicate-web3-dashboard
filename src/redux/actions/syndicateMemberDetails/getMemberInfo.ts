import { AppThunk } from "@/redux/store";
import { floatedNumberWithCommas } from "@/utils/numberWithCommas";
import { divideIfNotByZero, getWeiAmount } from "src/utils/conversions";
import { setSyndicateLPDetails, setSyndicateLPDetailsLoading } from ".";


interface ISyndicateLPData {
  syndicateAddress: string | string[];
  currentERC20Decimals: number;
}

/** action creator to trigger updates to the redux store whenever
 * an LP withdraws from or invests in a syndicate.
 * this action will store all LP values for the current syndicate.
 * @param SyndicateLPData values from the interface above
 * @returns dispatched syndicate LP values
 */
export const getMemberInfo = (data: ISyndicateLPData): AppThunk => async (dispatch, getState) => {
  const {
    syndicateAddress,
    currentERC20Decimals,
  } = data;

  const {
    syndicatesReducer: { syndicate },
    syndicateInstanceReducer: { syndicateContractInstance },
    web3Reducer: { web3: { account } },
  } = getState();

  // we cannot query relevant values without the syndicate instance
  if (!syndicateContractInstance || !account) return;

  // Retrieves syndicateInfo for the connected wallet. We need to find out
  // how much the wallet account has invested in this syndicate
  try {
    if (account && syndicateAddress && syndicate) {
      setSyndicateLPDetailsLoading(true);
      await syndicateContractInstance.methods
        .getMemberInfo(syndicateAddress, account)
        .call()
        .then(async (result) => {
          // update total LP deposits
          const myDeposits = getWeiAmount(
            result[0],
            currentERC20Decimals,
            false
          );

          // update LP's withdrawals to date
          const myWithdrawalsToDate = getWeiAmount(
            result[1],
            currentERC20Decimals,
            false
          );

          // update LP's address allowed
          const myAddressAllowed = result[2];

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
          const { depositTotal } = syndicate;
          const myLPDeposits = parseFloat(myDeposits) * 100;
          const totalSyndicateDeposits = parseFloat(depositTotal.toString());
          const myPercentageOfThisSyndicate = divideIfNotByZero(
            myLPDeposits,
            totalSyndicateDeposits
          );
          
          // check whether the member has reached their maximum deposit cap.
          const { maxDeposit } = syndicate;
          const maxDepositReached = +maxDeposit === +myDeposits;

          const memberNumDetails = {
            myDeposits,
            myPercentageOfThisSyndicate,
            myWithdrawalsToDate,
            withdrawalsToDepositPercentage,
          };

          const memberBoolDetails = {
            myAddressAllowed,
            maxDepositReached,
          };

          // format member number details
          // values should have commas, if they are longer than 3 characters long
          // and be rounded to two decimal places.
          Object.keys(memberNumDetails).map((key) => {
            memberNumDetails[key] = floatedNumberWithCommas(
              memberNumDetails[key]
            );
            return;
          });

          // dispatch action to update syndicate LP details
          dispatch(
            setSyndicateLPDetails({ ...memberNumDetails, ...memberBoolDetails })
          );
          setSyndicateLPDetailsLoading(false);
        });
    }
  } catch (error) {
    console.log({ error });
  }
};
