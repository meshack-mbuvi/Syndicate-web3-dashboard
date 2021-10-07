import { AppThunk } from "@/redux/store";
import { getWeiAmount } from "@/utils/conversions";
import { web3 } from "src/utils/web3Utils";
import { setMemberActivity, setMemberActivityLoading } from ".";
import { setLoadingSyndicateDepositorDetails } from "../manageMembers";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require("moment");

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
export const updateMemberActivityDetails =
  (data: ISyndicateLPData): AppThunk =>
  async (dispatch, getState) => {
    const {
      syndicateAddress,
      distributionTokens,
      memberAddresses,
      depositToken,
    } = data;

    const {
      syndicatesReducer: { syndicate },
      initializeContractsReducer: {
        syndicateContracts: {
          GetterLogicContract,
          DistributionLogicContract,
          DepositLogicContract,
        },
      },
    } = getState();

    // we cannot query relevant values without the syndicate instance
    if (
      !GetterLogicContract ||
      !DistributionLogicContract ||
      !DepositLogicContract ||
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
          const memberActivityDetails = [];
          let memberActivity = (<any>{}) as MemberActivity;

          if (distributionTokens.length) {
            const memberDistributionsWithdrawalEvents =
              await DistributionLogicContract.getDistributionEvents(
                "DistributionClaimed",
                {
                  syndicateAddress,
                  memberAddress,
                },
              );

            for (
              let index = 0;
              index < memberDistributionsWithdrawalEvents.length;
              index++
            ) {
              const withdrawalEvent =
                memberDistributionsWithdrawalEvents[index];
              const { amount, distributionERC20Address } =
                withdrawalEvent.returnValues;

              const block = await web3.eth.getBlock(
                withdrawalEvent.blockNumber,
              );

              const token = distributionTokens.filter((_token) => {
                return _token.tokenAddress === distributionERC20Address;
              });
              const { tokenSymbol, tokenDecimals } = token[0];

              const amountChanged = await getWeiAmount(
                amount,
                parseInt(tokenDecimals, 10),
                false,
              );

              memberActivity = {
                action: "withdrew",
                amountChanged,
                tokenSymbol,
                elapsedTime: moment(block.timestamp * 1000).fromNow(),
                epochDate: block.timestamp,
              };

              memberActivityDetails.push(memberActivity);
            }
          }
          const memberDepositEvents =
            await DepositLogicContract.getMemberDepositEvents("DepositAdded", {
              syndicateAddress,
              memberAddress,
            });

          for (let index = 0; index < memberDepositEvents.length; index++) {
            const depositEvent = memberDepositEvents[index];
            const { amount } = depositEvent.returnValues;

            const block = await web3.eth.getBlock(depositEvent.blockNumber);

            const amountChanged = await getWeiAmount(
              amount,
              parseInt(depositToken.tokenDecimals, 10),
              false,
            );

            memberActivity = {
              action: "deposited",
              amountChanged,
              tokenSymbol: depositToken.tokenSymbol,
              elapsedTime: moment(block.timestamp * 1000).fromNow(),
              epochDate: block.timestamp,
            };
            memberActivityDetails.push(memberActivity);
          }

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
