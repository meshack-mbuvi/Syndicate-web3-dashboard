import { getSyndicateMemberInfo } from "@/helpers/syndicate";
import { AppThunk } from "@/redux/store";
import { divideIfNotByZero, getWeiAmount } from "@/utils/conversions";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { web3 } from "src/utils/web3Utils";
import { setMemberDetailsLoading, setMemberWithdrawalDetails } from ".";
import { setLoadingSyndicateDepositorDetails } from "../manageMembers";
import { SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS } from "../types";

const BN = web3.utils.BN;

interface ISyndicateLPData {
  syndicateAddress: string | string[];
  distributionTokens: {
    tokenAddress: string;
    tokenDecimals: string;
    tokenDistributions: string;
    tokenSymbol: string;
  }[];
  memberAddresses: string[];
}

/** action creator to trigger updates to the redux store whenever
 * a member withdraws distributions from a syndicate.
 * this action will store all member values for the current syndicate.
 * @param {string | string[]} syndicateAddress the address of the syndicate.
 * @param {string []} distributionTokens
 * @param {string []} memberAddresses
 * @returns dispatched syndicate member withdrawal values
 */
export const updateMemberWithdrawalDetails = (
  data: ISyndicateLPData,
): AppThunk => async (dispatch, getState) => {
  const { syndicateAddress, distributionTokens, memberAddresses } = data;

  const {
    syndicatesReducer: { syndicate },
    initializeContractsReducer: {
      syndicateContracts: { GetterLogicContract, DistributionLogicContract },
    },
  } = getState();

  // we cannot query relevant values without the syndicate instance
  if (
    !GetterLogicContract ||
    !DistributionLogicContract ||
    (memberAddresses && !memberAddresses.length)
  )
    return;

  // we also cannot query member details if there are no distributions available
  if (!distributionTokens?.length) return;

  const depositTokenDecimals = syndicate?.tokenDecimals;

  // retrieve member info for each member address
  try {
    if (syndicateAddress && syndicate) {
      dispatch(setMemberDetailsLoading(true));
      dispatch(setLoadingSyndicateDepositorDetails(true));

      const memberWithdrawalData = {};

      // get total member deposits
      await memberAddresses.forEach(async (memberAddress) => {
        // we need to get cap table for all distributions set per given token
        distributionTokens.forEach(async (distributionToken) => {
          const {
            tokenAddress,
            tokenDecimals,
            tokenDistributions,
            tokenSymbol,
          } = distributionToken;
          const currentERC20Decimals = depositTokenDecimals;

          // This method is more reliable when checking member total withdrawals
          // per given ERC20 than querrying events.
          // I found the other method unreliable since it does not track claimed distributions
          // set manually by manager but this one tracks both those set by
          // manage and those done by member himself/herself.
          // const memberDistributionsWithdrawalsToDate = await DistributionLogicContract.getDistributionClaimedMember(
          //   syndicateAddress,
          //   memberAddress,
          //   tokenAddress,
          // );

          // update member's withdrawals to date based on deposits or distributions
          let memberDistributionsWithdrawalsToDate = "0";
          if (syndicate.distributing) {
            const memberDistributionsWithdrawalEvents = await DistributionLogicContract.getDistributionEvents(
              "DistributionClaimed",
              {
                syndicateAddress,
                memberAddress,
                distributionERC20Address: tokenAddress,
              },
            );

            if (memberDistributionsWithdrawalEvents.length) {
              let tokenWithdrawalAmounts = new BN("0");

              for (
                let i = 0;
                i < memberDistributionsWithdrawalEvents.length;
                i++
              ) {
                const { amount } = memberDistributionsWithdrawalEvents[
                  i
                ].returnValues;

                tokenWithdrawalAmounts = tokenWithdrawalAmounts.add(
                  new BN(amount),
                );
              }
              memberDistributionsWithdrawalsToDate = tokenWithdrawalAmounts.toString();
            }
          }

          const memberInfo = await getSyndicateMemberInfo(
            GetterLogicContract,
            syndicateAddress,
            memberAddress,
            currentERC20Decimals,
          );
          const { memberDeposits } = memberInfo;

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
            tokenDistributions,
            parseInt(tokenDecimals, 10),
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
              parseInt(tokenDecimals, 10),
              false,
            );
          }

          // member distributions to date will be the sum of
          // member available distributions and member withdrawals to date
          const memberDistributionsToDate = new BN(eligibleWithdrawal)
            .add(new BN(memberDistributionsWithdrawalsToDate))
            .toString();

          // update member's withdrawals to distributions percentage
          const withdrawalsToDate = new BN(memberDistributionsWithdrawalsToDate)
            .mul(new BN("100"))
            .toString();

          const memberWithdrawalsToDistributionsPercentage = divideIfNotByZero(
            withdrawalsToDate,
            memberDistributionsToDate,
          ).toString();

          const memberWithdrawalDetails = {
            memberTotalDeposits: floatedNumberWithCommas(memberDeposits),
            memberAvailableDistributions,
            memberDistributionsToDate: floatedNumberWithCommas(
              getWeiAmount(
                memberDistributionsToDate,
                parseInt(tokenDecimals, 10),
                false,
              ),
            ),
            memberDistributionsWithdrawalsToDate: floatedNumberWithCommas(
              getWeiAmount(
                memberDistributionsWithdrawalsToDate,
                parseInt(tokenDecimals, 10),
                false,
              ),
            ),
            memberWithdrawalsToDistributionsPercentage: floatedNumberWithCommas(
              memberWithdrawalsToDistributionsPercentage,
            ),
            totalTokenDistributions: getWeiAmount(
              totalTokenDistributions,
              parseInt(tokenDecimals, 10),
              false,
            ),
          };

          // format member number details
          // values should have commas, if they are longer than 3 characters long
          // and be rounded to two decimal places.

          if (!memberWithdrawalData[memberAddress]) {
            memberWithdrawalData[memberAddress] = {
              [tokenSymbol]: {
                ...memberWithdrawalDetails,
              },
            };
          } else {
            memberWithdrawalData[memberAddress][tokenSymbol] = {
              ...memberWithdrawalDetails,
            };
          }
          // dispatch action to update syndicate member details
          dispatch(
            setMemberWithdrawalDetails({
              ...memberWithdrawalData,
            }),
          );
        });
      });

      // adding a one-second timeout here to prevent glitching.
      setTimeout(() => dispatch(setMemberDetailsLoading(false)), 1000);
      dispatch(setLoadingSyndicateDepositorDetails(false));

      dispatch({
        type: SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS,
        data: false,
      });
    }
  } catch (error) {
    console.log({ error });
  }
};
