import { getSyndicateMemberInfo } from "@/helpers/syndicate";
import { AppThunk } from "@/redux/store";
import { floatedNumberWithCommas } from "@/utils/formattedNumbers";
import { divideIfNotByZero } from "src/utils/conversions";
import { setMemberDepositDetails, setMemberDetailsLoading } from ".";

interface ISyndicateLPData {
  syndicateAddress: string | string[];
  depositTokenDecimals: number;
}

/** action creator to trigger updates to the redux store whenever
 * a member invests in or withdraws deposits from a syndicate.
 * @param {string | string[]} syndicateAddress the address of the syndicate
 * @param {number} depositTokenDecimals the number of decimals for the deposit token
 * @returns dispatched syndicate member deposit values
 */
export const updateMemberDepositDetails = (
  data: ISyndicateLPData
): AppThunk => async (dispatch, getState) => {
  const { syndicateAddress, depositTokenDecimals } = data;

  const {
    syndicatesReducer: { syndicate },
    initializeContractsReducer: {
      syndicateContracts: { GetterLogicContract },
    },
    web3Reducer: {
      web3: { account },
    },
  } = getState();

  // we cannot query relevant values without the syndicate instance
  if (!GetterLogicContract || !account) return;

  // Retrieves syndicateInfo for the connected wallet. We need to find out
  // how much the wallet account has invested in this syndicate
  try {
    if (account && syndicateAddress && syndicate) {
      dispatch(setMemberDetailsLoading(true));

      // get total member deposits and address allowed values
      const memberAddress = account;
      const currentERC20Decimals = depositTokenDecimals;

      const {
        memberDeposits,
        memberAddressAllowed,
      } = await getSyndicateMemberInfo(
        GetterLogicContract,
        syndicateAddress,
        memberAddress,
        currentERC20Decimals
      );

      // get the current members's percentage share in the syndicate
      const { depositTotal } = syndicate;
      const memberDepositsByHundred = parseFloat(memberDeposits) * 100;
      const totalSyndicateDeposits = parseFloat(depositTotal.toString());
      const memberPercentageOfSyndicate = divideIfNotByZero(
        memberDepositsByHundred,
        totalSyndicateDeposits
      );

      // check whether the member has reached their maximum deposit cap.
      const { maxDeposit } = syndicate;
      const memberMaxDepositReached = +memberDeposits >= +maxDeposit;

      const memberNumDetails = {
        memberTotalDeposits: memberDeposits,
        memberPercentageOfSyndicate: floatedNumberWithCommas(memberPercentageOfSyndicate)
      };

      const memberBoolDetails = {
        memberAddressAllowed,
        memberMaxDepositReached,
      };

      // dispatch action to update syndicate member details
      dispatch(
        setMemberDepositDetails({ ...memberNumDetails, ...memberBoolDetails })
      );
      dispatch(setMemberDetailsLoading(false));
    }
  } catch (error) {
    console.log({ error });
  }
};
