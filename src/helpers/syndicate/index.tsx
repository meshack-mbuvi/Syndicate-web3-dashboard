import { Syndicate } from "@/@types/syndicate";
import HorizontalDivider from "@/components/horizontalDivider";
import {
  processSyndicateDetails,
} from "@/redux/actions/syndicates";
import { getWeiAmount } from "@/utils/conversions";
import { getCoinFromContractAddress } from "functions/src/utils/ethereum";

/**
 * retrieves details for a given syndicate
 */
export const getSyndicate = async (syndicateData): Promise<Syndicate> => {
  try {
    const { depositERC20Address } = syndicateData;

    // get token details
    const { symbol, logo, decimals,price } = await getCoinFromContractAddress(
      depositERC20Address,
    );
    const tokenDecimals = decimals;
    const depositERC20Logo = logo;
    const depositERC20TokenSymbol = symbol;
    const depositERC20Price =  price;

    const syndicateDetails = processSyndicateDetails(
      syndicateData,
      tokenDecimals,
      depositERC20TokenSymbol,
      depositERC20Logo,
      depositERC20Price
    );

    return {
      ...syndicateDetails,
    };
  } catch (error) {
    return null;
  }
};

/**
 * This method creates a list of loader items
 * @param {number} count the number of loader items to be rendered
 * @returns {array} animations list of loader items
 */
export const showLoader = (count) => {
  const animations = [];
  for (let i = 0; i < count; i++) {
    animations.push(
      <div key={i}>
        <div className="w-full flex justify-between sm:m-auto">
          <div className="flex flex-1">
            <div className="image"></div>
            <div className="w-3/4">
              <div className="custom-animation w-full my-2 h-2"></div>
              <div className="custom-animation w-1/2 my-2 h-2"></div>
            </div>
          </div>
          <div className="card-placeholder w-16 sm:w-24 mb-2"></div>
        </div>
        <HorizontalDivider />
      </div>,
    );
  }
  return animations;
};

/**
 * Retrieves member details for a given syndicate
 *
 * @param {object} GetterLogicContract - logic contract responsible for fetching member info
 * @param {string} syndicateAddress - address to get member details from.
 * @param {string} memberAddress - member address to get details from a syndicate
 * @param {number} currentERC20Decimals - token decimals
 * @returns {object} - memberDeposits, memberTotalWithdrawals and memberAddressAllowed
 *
 */
export const getSyndicateMemberInfo = async (
  GetterLogicContract,
  syndicateAddress,
  memberAddress,
  currentERC20Decimals = 18,
) => {
  try {
    const {
      memberDeposit,
      DistributionClaimed,
      memberAddressAllowed,
    } = await GetterLogicContract.getMemberInfo(
      syndicateAddress,
      memberAddress,
    );

    const memberDeposits = getWeiAmount(
      memberDeposit,
      currentERC20Decimals,
      false,
    );

    const memberTotalWithdrawals = getWeiAmount(
      DistributionClaimed,
      currentERC20Decimals,
      false,
    );

    return { memberDeposits, memberTotalWithdrawals, memberAddressAllowed };
  } catch (error) {
    return {
      memberDeposits: 0,
      memberTotalWithdrawals: 0,
      memberAddressAllowed: false,
    };
  }
};
