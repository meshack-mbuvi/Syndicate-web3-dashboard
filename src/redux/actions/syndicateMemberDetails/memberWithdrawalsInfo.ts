import { getSyndicateMemberInfo } from "@/helpers/syndicate";
import { AppThunk } from "@/redux/store";
import { divideIfNotByZero, getWeiAmount } from "@/utils/conversions";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { web3 } from "src/utils/web3Utils";
import { setMemberDetailsLoading, setMemberWithdrawalDetails } from ".";
const BN = web3.utils.BN;

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
  data: ISyndicateLPData,
): AppThunk => async (dispatch, getState) => {
  const {
    syndicateAddress,
    currentTokenAvailableDistributions,
    currentDistributionTokenAddress,
    currentDistributionTokenDecimals,
  } = data;

  const {
    syndicatesReducer: { syndicate },
    initializeContractsReducer: {
      syndicateContracts: { GetterLogicContract, DistributionLogicContract },
    },
    web3Reducer: {
      web3: { account },
    },
  } = getState();

  // we cannot query relevant values without the syndicate instance
  if (!GetterLogicContract || !DistributionLogicContract || !account) return;

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
        GetterLogicContract,
        syndicateAddress,
        memberAddress,
        currentERC20Decimals,
      );
      const { memberDeposits } = memberInfo;

      // update member's withdrawals to date based on deposits or distributions
      let memberDistributionsWithdrawalsToDate = "0";
      if (syndicate.distributing) {
        const memberDistributionsWithdrawalEvents = await DistributionLogicContract.getDistributionEvents(
          "DistributionClaimed",
          {
            syndicateAddress,
            memberAddress: account,
            distributionERC20Address: currentDistributionTokenAddress,
          },
        );

        if (memberDistributionsWithdrawalEvents.length) {
          let tokenWithdrawalAmounts = new BN("0");

          for (let i = 0; i < memberDistributionsWithdrawalEvents.length; i++) {
            const { amount } = memberDistributionsWithdrawalEvents[
              i
            ].returnValues;

            tokenWithdrawalAmounts = tokenWithdrawalAmounts.add(new BN(amount));
          }
          memberDistributionsWithdrawalsToDate = tokenWithdrawalAmounts.toString();
        }
      }

      // update Member's total distributions to date if on the withdrawal page
      // totalDistributions * (deposit/depositTotal)
      // we'll calculate the member's eligible withdrawal value
      const { depositTotal } = syndicate;
      const totalSyndicateDeposits = getWeiAmount(
        depositTotal,
        depositTokenDecimals,
        true,
      );
      const totalTokenDistributions = getWeiAmount(
        currentTokenAvailableDistributions,
        currentDistributionTokenDecimals,
        true,
      );

      const totalMemberDeposits = getWeiAmount(
        memberDeposits,
        depositTokenDecimals,
        true,
      );
      let eligibleWithdrawal = "0";
      try {
        eligibleWithdrawal = await DistributionLogicContract.calculateEligibleDistribution(
          totalMemberDeposits,
          totalSyndicateDeposits,
          memberDistributionsWithdrawalsToDate,
          totalTokenDistributions,
        );
      } catch (error) {
        eligibleWithdrawal = "0";
      }

      let memberAvailableDistributions = "0";
      if (eligibleWithdrawal) {
        memberAvailableDistributions = getWeiAmount(
          eligibleWithdrawal,
          currentDistributionTokenDecimals,
          false,
        );
      }

      // member distributions to date will be the sum of
      // member available distributions and member withdrawals to date
      const memberDistributionsToDate = new BN(eligibleWithdrawal)
        .add(new BN(memberDistributionsWithdrawalsToDate))
        .toString();

      // update member's withdrawals to distributions percentage
      let memberWithdrawalsToDistributionsPercentage = "0";
      const withdrawalsToDate = new BN(memberDistributionsWithdrawalsToDate)
        .mul(new BN("100"))
        .toString();

      memberWithdrawalsToDistributionsPercentage = divideIfNotByZero(
        withdrawalsToDate,
        memberDistributionsToDate,
      ).toString();

      // consolidate values to push to the redux store
      const memberWithdrawalDetails = {
        memberDistributionsToDate: floatedNumberWithCommas(
          getWeiAmount(
            memberDistributionsToDate,
            currentDistributionTokenDecimals,
            false,
          ),
        ),
        memberDistributionsWithdrawalsToDate: floatedNumberWithCommas(
          getWeiAmount(
            memberDistributionsWithdrawalsToDate,
            currentDistributionTokenDecimals,
            false,
          ),
        ),
        memberAvailableDistributions,
        memberWithdrawalsToDistributionsPercentage: floatedNumberWithCommas(
          memberWithdrawalsToDistributionsPercentage,
        ),
      };

      // dispatch action to update syndicate member details
      dispatch(setMemberWithdrawalDetails({ ...memberWithdrawalDetails }));

      // adding a one-second timeout here to prevent glitching.
      setTimeout(() => dispatch(setMemberDetailsLoading(false)), 1000);
    }
  } catch (error) {
    console.log({ error });
  }
};
