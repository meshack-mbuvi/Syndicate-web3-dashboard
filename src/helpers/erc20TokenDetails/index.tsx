import { MintPolicyContract } from "@/ClubERC20Factory/mintPolicy";
import { SingleTokenMintModuleContract } from "@/ClubERC20Factory/singleTokenMintModule";
import { AppState } from "@/state";
import {
  setERC20TokenContract,
  setERC20TokenDetails,
  setLoadingClub,
} from "@/state/erc20token/slice";
import { ERC20Token } from "@/state/erc20token/types";
import { getWeiAmount } from "@/utils/conversions";

export const ERC20TokenDefaultState = {
  name: "",
  owner: "",
  address: "",
  depositToken: "",
  depositsEnabled: false,
  claimEnabled: false,
  totalSupply: 0,
  tokenDecimals: 18, //default to 18
  totalDeposits: 0,
  symbol: "",
  startTime: 0,
  endTime: 0,
  memberCount: 0,
  maxTotalDeposits: 25000000,
  isOwner: false,
  loading: false,
  maxMemberCount: 0,
  maxTotalSupply: 0,
  requiredToken: "",
  requiredTokenMinBalance: "",
};
/**
 * Retrieves details for an erc20 token for a particular
 * tokenAddress(initially called syndicateAddress)
 */
export const getERC20TokenDetails = async (
  ERC20tokenContract,
  SingleTokenMintModule: SingleTokenMintModuleContract,
  mintPolicy: MintPolicyContract,
): Promise<ERC20Token> => {
  if (ERC20tokenContract) {
    try {
      // ERC20tokenContract is initialized with the contract address
      const { address } = ERC20tokenContract;
      const {
        endTime,
        maxMemberCount,
        maxTotalSupply,
        requiredToken,
        requiredTokenMinBalance,
        startTime,
      } = await mintPolicy?.getSyndicateValues(address);
      // TODO: Multicall :-)
      const [name, owner, tokenDecimals, depositToken, symbol, memberCount] =
        await Promise.all([
          ERC20tokenContract.name(),
          ERC20tokenContract.owner(),
          ERC20tokenContract.decimals(),
          SingleTokenMintModule?.depositToken(
            ERC20tokenContract.clubERC20Contract._address,
          ),
          ERC20tokenContract.symbol(),
          ERC20tokenContract.memberCount(),
        ]);
      const MERKLE_DISTRIBUTOR_MODULE =
        process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_MODULE;

      const totalSupply = await ERC20tokenContract.totalSupply().then((wei) =>
        getWeiAmount(wei, tokenDecimals, false),
      );

      const claimEnabled = await mintPolicy.isModuleAllowed(
        ERC20tokenContract.clubERC20Contract._address,
        MERKLE_DISTRIBUTOR_MODULE,
      );

      let depositsEnabled = false;
      if (!claimEnabled) {
        const endDateInFuture = +endTime * 1000 > new Date().getTime();

        depositsEnabled = endDateInFuture;
      }

      return {
        totalSupply,
        address,
        name,
        owner,
        tokenDecimals,
        depositToken,
        symbol,
        memberCount,
        loading: false,
        maxMemberCount,
        maxTotalSupply: getWeiAmount(maxTotalSupply, tokenDecimals, false),
        requiredToken,
        depositsEnabled,
        claimEnabled,
        requiredTokenMinBalance,
        maxTotalDeposits: getWeiAmount(maxTotalSupply, tokenDecimals, false), //should be updated if token prices is not 1:1
        startTime: parseInt(startTime, 10) * 1000, // time is in seconds. need to change to milliseconds
        endTime: parseInt(endTime, 10) * 1000, // time is in seconds. need to change to milliseconds
      };
    } catch (error) {
      return ERC20TokenDefaultState;
    }
  }
};

/**
 * This function retrieves limited club details. The details retrieved here are
 * missing club totalDeposits.
 *
 * NOTE: In order to get club totalDeposits, call useClubDepositsAndSupply() hook
 * where you have called dispatch(setERC20Token)
 * Reason for separating the two is coz, there is no function on the club contract to retrive
 *  totalDeposits, but we can get this from the thegraph endpoint.
 *
 * @param ERC20tokenContract
 * @param SingleTokenMintModule
 * @returns
 */
export const setERC20Token =
  (ERC20tokenContract, SingleTokenMintModule: SingleTokenMintModuleContract) =>
  async (dispatch, getState: () => AppState): Promise<void> => {
    const {
      initializeContractsReducer: {
        syndicateContracts: { mintPolicy },
      },
    } = getState();

    dispatch(setERC20TokenContract(ERC20tokenContract));
    dispatch(setLoadingClub(true));
    try {
      const erc20Token = await getERC20TokenDetails(
        ERC20tokenContract,
        SingleTokenMintModule,
        mintPolicy,
      );
      dispatch(setERC20TokenDetails(erc20Token));
      dispatch(setLoadingClub(false));
    } catch (error) {
      return dispatch(setERC20TokenDetails(ERC20TokenDefaultState));
    }
  };
