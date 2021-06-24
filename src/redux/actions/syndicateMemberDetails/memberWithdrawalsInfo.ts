import { AppThunk } from "@/redux/store";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { divideIfNotByZero, getWeiAmount } from "@/utils/conversions";
import { setMemberWithdrawalDetails, setMemberDetailsLoading } from ".";
import { getSyndicateMemberInfo } from "@/helpers/syndicate";
import { getEvents } from "@/helpers/retrieveEvents";
import { web3 } from "src/utils/web3Utils";

interface ISyndicateLPData {
  syndicateAddress: string | string[];
  currentTokenAvailableDistributions: string;
  currentDistributionTokenDecimals: number;
  currentDistributionTokenAddress: string | string[];
}

/** action creator to trigger updates to the redux store whenever
 * a member withdraws distributions from a syndicate.
 * this action will store all member values for the current syndicate.
 * @param {string | string[]} syndicateAddress the address of the syndicate.
 * @param {string} currentTokenAvailableDistributions total available distributions for the current token;
 * @param {string} currentDistributionTokenDecimals the number of decimal places for the current distribution token
 * @param {string} currentDistributionTokenAddress the address of the current distribution token
 * @returns dispatched syndicate member withdrawal values
 */
export const updateMemberWithdrawalDetails = (
  data: ISyndicateLPData
): AppThunk => async (dispatch, getState) => {
  const {
    syndicateAddress,
    currentTokenAvailableDistributions,
    currentDistributionTokenAddress,
    currentDistributionTokenDecimals,
  } = data;

  const {
    syndicatesReducer: { syndicate },
    syndicateInstanceReducer: { syndicateContractInstance },
    web3Reducer: {
      web3: { account },
    },
  } = getState();

  // we cannot query relevant values without the syndicate instance
  if (!syndicateContractInstance || !account) return;

  // we also cannot query member details if there are no distributions available
  if (
    +currentTokenAvailableDistributions === 0 ||
    !currentTokenAvailableDistributions
  )
    return;

  if (syndicate) {
    var depositTokenDecimals = syndicate.tokenDecimals;
  }
  // retrieve member info for the connected wallet.
  try {
    if (account && syndicateAddress && syndicate) {
      dispatch(setMemberDetailsLoading(true));

      // get total member deposits
      const memberAddress = account;
      const currentERC20Decimals = depositTokenDecimals;
      const memberInfo = await getSyndicateMemberInfo(
        syndicateContractInstance,
        syndicateAddress,
        memberAddress,
        currentERC20Decimals
      );
      const { memberDeposits } = memberInfo;

      // update member's withdrawals to date based on deposits or distributions
      let memberDistributionsWithdrawalsToDate = "0";
      if (syndicate.distributionsEnabled) {
        const memberDistributionsWithdrawalEvents = await getEvents(
          syndicateContractInstance,
          "memberWithdrewDistribution",
          {
            syndicateAddress,
            memberAddress: account,
            distributionERC20Address: currentDistributionTokenAddress,
          }
        );

        if (memberDistributionsWithdrawalEvents.length) {
          var BN = web3.utils.BN;
          let tokenWithdrawalAmounts = new BN("0");

          for (let i = 0; i < memberDistributionsWithdrawalEvents.length; i++) {
            const { amountWithdrawn } = memberDistributionsWithdrawalEvents[
              i
            ].returnValues;

            tokenWithdrawalAmounts = tokenWithdrawalAmounts.add(
              new BN(amountWithdrawn)
            );
          }
          memberDistributionsWithdrawalsToDate = tokenWithdrawalAmounts.toString();
        }
      }

      // update member's withdrawals to deposits percentage
      let memberWithdrawalsToDepositPercentage = "0";
      const memberWithdrawals = getWeiAmount(
        memberDistributionsWithdrawalsToDate,
        currentDistributionTokenDecimals,
        false
      );
      const withdrawalsToDate = parseFloat(memberWithdrawals) * 100;
      const memberTotalDeposits = parseFloat(memberDeposits);

      memberWithdrawalsToDepositPercentage = divideIfNotByZero(
        withdrawalsToDate,
        memberTotalDeposits
      ).toString();

      // update Member's total distributions to date if on the withdrawal page
      // totalDistributions * (deposit/depositTotal)
      // we'll calculate the member's eligible withdrawal value
      const { depositTotal } = syndicate;
      const totalSyndicateDeposits = getWeiAmount(
        depositTotal,
        depositTokenDecimals,
        true
      );
      const totalTokenDistributions = getWeiAmount(
        currentTokenAvailableDistributions,
        currentDistributionTokenDecimals,
        true
      );

      const totalMemberDeposits = getWeiAmount(
        memberDeposits,
        depositTokenDecimals,
        true
      );

      try {
        var eligibleWithdrawal = await syndicateContractInstance.methods
          .calculateEligibleWithdrawal(
            totalMemberDeposits,
            totalSyndicateDeposits,
            memberDistributionsWithdrawalsToDate,
            totalTokenDistributions
          )
          .call()
          .then((result) => result)
          .catch(() => "0");
      } catch (error) {
        eligibleWithdrawal = "0";
      }

      let memberDistributionsToDate = "0";
      if (eligibleWithdrawal) {
        memberDistributionsToDate = getWeiAmount(
          eligibleWithdrawal,
          currentDistributionTokenDecimals,
          false
        );
      }

      const memberWithdrawalDetails = {
        memberDistributionsToDate,
        memberDistributionsWithdrawalsToDate: getWeiAmount(
          memberDistributionsWithdrawalsToDate,
          currentDistributionTokenDecimals,
          false
        ),
        memberWithdrawalsToDepositPercentage,
      };

      // format member number details
      // values should have commas, if they are longer than 3 characters long
      // and be rounded to two decimal places.
      Object.keys(memberWithdrawalDetails).map((key) => {
        memberWithdrawalDetails[key] = floatedNumberWithCommas(
          memberWithdrawalDetails[key]
        );
        return;
      });

      // dispatch action to update syndicate member details
      dispatch(setMemberWithdrawalDetails({ ...memberWithdrawalDetails }));

      // adding a one-second timeout here to prevent glitching.
      setTimeout(() => dispatch(setMemberDetailsLoading(false)), 1000);
    }
  } catch (error) {
    console.log({ error });
  }
};
