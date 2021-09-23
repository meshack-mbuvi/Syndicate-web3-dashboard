import { AppThunk } from "@/redux/store";
import { getWeiAmount } from "@/utils/conversions";
import { web3 } from "src/utils/web3Utils";
import { setMemberActivityLoading, setMemberActivity } from ".";
import { setLoadingSyndicateDepositorDetails } from "../manageMembers";
import { SET_LOADING_SYNDICATE_DEPOSITOR_DETAILS } from "../types";

const moment = require("moment");
const BN = web3.utils.BN;

interface ISyndicateLPData {
  syndicateAddress: string | string[];
  distributionTokens: {
    tokenAddress: string;
    tokenDecimals: string;
    tokenDistributions: string;
    tokenSymbol: string;
  }[];
  depositToken: {
    tokenAddress: string;
    tokenDecimals: string;
    tokenSymbol: string;
  };
  memberAddresses: string[];
}

interface MemberActivity {
    action: string;
    amountChanged: number;
    tokenSymbol: string;
    elapsedTime: string;
    epochDate: number;
}

/** action creator to trigger updates to the redux for
 * member events.
 * this action will store all member activity for the current syndicate.
 * @param {string | string[]} syndicateAddress the address of the syndicate.
 * @param {string []} distributionTokens
 * @param {string []} memberAddresses
 * @param {} depositToken
 * @returns dispatched syndicate member activity
 */
export const updateMemberActivityDetails = (
  data: ISyndicateLPData,
): AppThunk => async (dispatch, getState) => {
  const { syndicateAddress, distributionTokens, memberAddresses, depositToken } = data;

  const {
    syndicatesReducer: { syndicate },
    initializeContractsReducer: {
      syndicateContracts: { GetterLogicContract, DistributionLogicContract, DepositLogicContract },
    },
  } = getState();

  // we cannot query relevant values without the syndicate instance
  if (
    !GetterLogicContract ||
    !DistributionLogicContract || !DepositLogicContract ||
    (memberAddresses && !memberAddresses.length)
  )
    return;

  // retrieve member activity for each member address
  try {
    if (syndicateAddress && syndicate) {
      dispatch(setMemberActivityLoading(true));
      dispatch(setLoadingSyndicateDepositorDetails(true));

      await memberAddresses.forEach(async (memberAddress) => {

        const memberActivityData = <any>[];
        let memberActivityDetails = []
        let memberActivity = <any>{} as MemberActivity

        if (distributionTokens.length) {
          const memberDistributionsWithdrawalEvents = await DistributionLogicContract.getDistributionEvents(
            "DistributionClaimed",
            {
              syndicateAddress,
              memberAddress,
            },
          );
  
          memberDistributionsWithdrawalEvents.forEach(async (withrawalEvent) => {
            const {amount, distributionERC20Address} = withrawalEvent.returnValues

            const block = await web3.eth.getBlock(withrawalEvent.blockNumber)
  
            const token = distributionTokens.filter(_token => {
              return _token.tokenAddress === distributionERC20Address
            })
            const {tokenSymbol, tokenDecimals} = token[0]
  
            const amountChanged = await getWeiAmount(
              amount,
              parseInt(tokenDecimals, 10),
              false,
            );
            
            memberActivity = {
              action: "withdrew",
              amountChanged,
              tokenSymbol,
              elapsedTime: moment(block.timestamp*1000).fromNow(),
              epochDate: block.timestamp,
            };
  
            memberActivityDetails.push(memberActivity)
          })
  
        }

        const memberDepositEvents = await DepositLogicContract.getMemberDepositEvents(
          "DepositAdded",
          {
            syndicateAddress,
            memberAddress,
          },
        );

        memberDepositEvents.forEach(async (depositEvent) => {
          const {amount} = depositEvent.returnValues

          const block = await web3.eth.getBlock(depositEvent.blockNumber)

          const amountChanged = await getWeiAmount(
            amount,
            parseInt(depositToken.tokenDecimals, 10),
            false,
          );

          memberActivity = {
            action: "deposited",
            amountChanged,
            tokenSymbol: depositToken.tokenSymbol,
            elapsedTime: moment(block.timestamp*1000).fromNow(),
            epochDate: block.timestamp,
          };
          memberActivityDetails.push(memberActivity)
        })

          memberActivityData[memberAddress] = memberActivityDetails;
          // dispatch action to update syndicate member activity
          dispatch(
            setMemberActivity({
              ...memberActivityData,
            }),
          );
      });
      // adding a one-second timeout here to prevent glitching.
      setTimeout(() => dispatch(setMemberActivityLoading(false)), 1000);
      dispatch(setLoadingSyndicateDepositorDetails(false));
    }
  } catch (error) {
    console.log({ error });
  }
};
