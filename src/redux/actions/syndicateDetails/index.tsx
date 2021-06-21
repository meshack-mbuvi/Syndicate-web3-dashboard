import { getEvents } from "@/helpers/retrieveEvents";
import { etherToNumber, toEther } from "src/utils/conversions";
import { ERC20TokenDetails } from "src/utils/ERC20Methods";
import { numberWithCommas } from "@/utils/formattedNumbers";
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
 * @param syndicateContractInstancee the instance of the syndicate
 * @param depositERC20ContractAddress the ERC20 token used to make withdrawals/deposits
 * @param profitShareToSyndicateLead profit share to syndicate lead in basis points
 * @param profitShareToSyndicateProtocol profit share to Syndicate Protocol in basis points
 * @param syndicate details of the syndicate fetched with getSyndicateValues()
 * @param syndicateAddress the address of the syndicate
 */
export const setSyndicateDetails = (
  syndicateContractInstance,
  depositERC20ContractAddress,
  profitShareToSyndicateLead,
  profitShareToSyndicateProtocol,
  syndicate,
  syndicateAddress
) => async (dispatch) => {
  if (!syndicateContractInstance) return;
  // initialise syndicate contract
  // get number of decimal places for the current ERC20 token
  let tokenDecimals;
  if (depositERC20ContractAddress) {
    const tokenDetails = new ERC20TokenDetails(depositERC20ContractAddress);
    tokenDecimals = await tokenDetails.getTokenDecimals();
  }

  // instantiate syndicate details variables.
  let totalDeposits = 0;
  let totalDepositors = [];
  let totalWithdrawn = 0;
  let profitSharedToSyndicateLead = 0;
  let profitSharedToSyndicateProtocol = 0;
  let totalOperatingFees = 0;

  // add a loading state
  setLoadingSyndicateDetails(true);

  // get events where an LP invested in a syndicate.
  const lpInvestedInSyndicateEvents = await getEvents(
    syndicateContractInstance,
    "lpInvestedInSyndicate",
    { syndicateAddress }
  );

  // process lpInvestedInSyndicate events
  lpInvestedInSyndicateEvents.map((event) => {
    // get the total number of depositors
    // we'll get all the lpAddresses from this event and then get a unique count
    const { lpAddress } = event.returnValues;
    totalDepositors.push(lpAddress);

    //set total deposits
    totalDeposits = syndicate.totalDeposits;
  });

  // get syndicate event(s) where distribution was withdrawn.
  const lpWithdrewDistributionEvents = await getEvents(
    syndicateContractInstance,
    "lpWithdrewDistributionFromSyndicate",
    { syndicateAddress }
  );

  for (let i = 0; i < lpWithdrewDistributionEvents.length; i++) {
    let event = lpWithdrewDistributionEvents[i];
    // get total value withdrawn
    const { amountWithdrawn } = event.returnValues;
    const etherAmountWithdrawn =
      parseInt(amountWithdrawn) / Math.pow(10, tokenDecimals);
    const BNamountWithdrawn = toEther(etherAmountWithdrawn);

    // get the profit share from the syndicate instance.
    // returns a Tuple of the amounts (toUser, toSyndicate, toManager) that will
    // be transferred, together adding up to the passed amount.
    try {
      const profitShareValues = await syndicateContractInstance.methods.calculateProfitShare(
        BNamountWithdrawn,
        profitShareToSyndicateLead,
        profitShareToSyndicateProtocol
      );

      const toSyndicate = etherToNumber(profitShareValues[1]);
      const toManager = etherToNumber(profitShareValues[2]);

      profitSharedToSyndicateProtocol += toSyndicate;
      profitSharedToSyndicateLead += toManager;
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
    profitSharedToSyndicateLead,
    profitSharedToSyndicateProtocol,
    totalOperatingFees,
  };

  // format all syndicate details, except totalDepositors.
  // values should have commas, if they are longer than 3 characters long
  // and rounded to two decimal places.
  Object.keys(syndicateDetails).map((key) => {
    if (key !== "totalDepositors") {
      syndicateDetails[key] = parseFloat(
        numberWithCommas(syndicateDetails[key])
      ).toFixed(2);
    }
    return;
  });

  // remove loading state
  setLoadingSyndicateDetails(false);

  // update redux store with latest syndicate details.
  return dispatch(updateSyndicateDetails(syndicateDetails));
};
