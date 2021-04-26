import { LOADING_SYNDICATE_DETAILS, SET_SYNDICATE_DETAILS } from "../types";
import { ERC20TokenDetails } from "src/utils/ERC20Methods";
import syndicateABI from "src/contracts/Syndicate.json";
import { numberWithCommas } from "src/utils/numberWithCommas";
import { toEther, etherToNumber } from "src/utils/conversions";
const Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const startBlock = process.env.NEXT_PUBLIC_FROM_BLOCK;

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
 * @param syndicateInstance the instance of the syndicate
 * @param depositERC20ContractAddress the ERC20 token used to make withdrawals/deposits
 * @param profitShareToSyndicateLead profit share to syndicate lead in basis points
 * @param profitShareToSyndicateProtocol profit share to Syndicate Protocol in basis points
 * @param syndicate details of the syndicate fetched with getSyndicateValues()
 */
export const setSyndicateDetails = (
  syndicateInstance,
  depositERC20ContractAddress,
  profitShareToSyndicateLead,
  profitShareToSyndicateProtocol,
  syndicate
) => async (dispatch) => {
  if (!syndicateInstance) return;
  // initialise syndicate contract
  const syndicateContract = new web3.eth.Contract(
    syndicateABI.abi,
    syndicateInstance.address
  );

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
  await syndicateContract.getPastEvents(
    "lpInvestedInSyndicate",
    {
      fromBlock: startBlock,
      toBlock: "latest",
    },
    (error, eventResults) => {
      if (!error) {
        eventResults.map((event) => {
          // get the total number of depositors
          // we'll get all the lpAddresses from this event and then get a unique count
          const { lpAddress } = event.returnValues;
          totalDepositors.push(lpAddress);

          //set total deposits
          totalDeposits = syndicate.totalDeposits;
        });
      } else if (error) {
        console.log(error);
      }
    }
  );

  // get syndicate event(s) where distribution was withdrawn.
  const lpWithdrewDistribution = await syndicateContract.getPastEvents(
    "lpWithdrewDistributionFromSyndicate",
    {
      fromBlock: startBlock,
      toBlock: "latest",
    }
  );

  for (let i = 0; i < lpWithdrewDistribution.length; i++) {
    let event = lpWithdrewDistribution[i];
    // get total value withdrawn
    const { amountWithdrawn } = event.returnValues;
    const etherAmountWithdrawn =
      parseInt(amountWithdrawn) / Math.pow(10, tokenDecimals);
    const BNamountWithdrawn = toEther(etherAmountWithdrawn);

    // get the profit share from the syndicate instance.
    // returns a Tuple of the amounts (toUser, toSyndicate, toManager) that will
    // be transferred, together adding up to the passed amount.
    try {
      const profitShareValues = await syndicateInstance.calculateProfitShare(
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
