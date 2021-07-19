import { numberWithCommas } from "@/utils/formattedNumbers";
import { etherToNumber, getWeiAmount } from "src/utils/conversions";
import { ERC20TokenDetails } from "src/utils/ERC20Methods";
import { LOADING_SYNDICATE_DETAILS, SET_SYNDICATE_DETAILS } from "../types";

const updateSyndicateDetails = (data) => {
  return {
    type: SET_SYNDICATE_DETAILS,
    data,
  };
};

const setLoadingSyndicateDetails = (data) => {
  return {
    type: LOADING_SYNDICATE_DETAILS,
    data,
  };
};

// filter a given array by unique values
// we'll use this to filter unique addresses
// when calculating total depositors.
const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

/** action creator to fetch and update syndicate details
 * @param syndicateContracts object containing all logic contracts
 * @param depositERC20ContractAddress the ERC20 token used to make withdrawals/deposits
 * @param distributionShareToSyndicateLead distribution share to syndicate lead in basis points
 * @param distributionShareToSyndicateProtocol distribution share to Syndicate Protocol in basis points
 * @param syndicate details of the syndicate fetched with getSyndicateValues()
 * @param syndicateAddress the address of the syndicate
 */
export const setSyndicateDetails = (
  syndicateContracts,
  depositERC20ContractAddress,
  distributionShareToSyndicateLead,
  distributionShareToSyndicateProtocol,
  syndicate,
  syndicateAddress,
) => async (dispatch) => {
  if (
    !syndicateContracts?.DepositLogicContract ||
    !syndicateContracts?.DistributionLogicContract
  )
    return;
  // initialise syndicate contract
  // get number of decimal places for the current ERC20 token
  let tokenDecimals;
  if (depositERC20ContractAddress) {
    const tokenDetails = new ERC20TokenDetails(depositERC20ContractAddress);
    tokenDecimals = await tokenDetails.getTokenDecimals();
  }

  // instantiate syndicate details variables.
  let totalDeposits = 0;
  const totalDepositors = [];
  let totalWithdrawn = 0;
  let distributionSharedToSyndicateLead = 0;
  let distributionSharedToSyndicateProtocol = 0;
  const totalOperatingFees = 0;

  // add a loading state
  setLoadingSyndicateDetails(true);

  const {
    DepositLogicContract,
    DistributionLogicContract,
  } = syndicateContracts;

  // get events where an member invested in a syndicate.
  const memberDepositEvents = await DepositLogicContract.getMemberDepositEvents(
    syndicateAddress,
    { syndicateAddress },
  );

  // process memberDeposit events
  memberDepositEvents.map((event) => {
    // get the total number of depositors
    // we'll get all the lpAddresses from this event and then get a unique count
    const { memberAddress } = event.returnValues;
    totalDepositors.push(memberAddress);

    //set total deposits
    totalDeposits = syndicate.depositTotal;
  });
  // DistributionClaimed
  // get syndicate event(s) where distribution was withdrawn.
  const memberWithdrewDistributionEvents = await DistributionLogicContract.getDistributionEvents(
    "DistributionClaimed",
    syndicateAddress,
    { syndicateAddress },
  );

  for (let i = 0; i < memberWithdrewDistributionEvents.length; i++) {
    const event = memberWithdrewDistributionEvents[i];
    // get total value withdrawn
    const { amount } = event.returnValues;
    const etherAmountWithdrawn = getWeiAmount(amount, tokenDecimals, false);

    // get the distribution share from the syndicate instance.
    // returns a Tuple of the amounts (toUser, toSyndicate, toManager) that will
    // be transferred, together adding up to the passed amount.
    try {
      let {
        toSyndicate,
        toManager,
      } = await DistributionLogicContract.calculateDistributionShares(
        etherAmountWithdrawn,
        distributionShareToSyndicateProtocol,
        distributionShareToSyndicateLead,
      );

      toSyndicate = etherToNumber(toSyndicate);
      toManager = etherToNumber(toManager);

      distributionSharedToSyndicateProtocol += toSyndicate;
      distributionSharedToSyndicateLead += toManager;
    } catch (err) {
      console.log({ err });
    }
    // update the value of total deposits/investments.
    totalWithdrawn += etherAmountWithdrawn;
  }

  // get unique depositors
  const totalUniqueDepositors = totalDepositors.filter(onlyUnique);

  const syndicateDetails = {
    totalDepositors: totalUniqueDepositors.length,
    totalDeposits,
    totalWithdrawn,
    distributionSharedToSyndicateLead,
    distributionSharedToSyndicateProtocol,
    totalOperatingFees,
  };

  // format all syndicate details, except totalDepositors.
  // values should have commas, if they are longer than 3 characters long
  // and rounded to two decimal places.
  Object.keys(syndicateDetails).map((key) => {
    if (key !== "totalDepositors") {
      syndicateDetails[key] = parseFloat(
        numberWithCommas(syndicateDetails[key]),
      ).toFixed(2);
    }
    return;
  });

  // remove loading state
  setLoadingSyndicateDetails(false);

  // update redux store with latest syndicate details.
  return dispatch(updateSyndicateDetails(syndicateDetails));
};
