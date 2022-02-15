import { DepositTokenMintModuleContract } from "@/ClubERC20Factory/depositTokenMintModule";
import { MintPolicyContract } from "@/ClubERC20Factory/policyMintERC20";
import { AppState } from "@/state";
import {
  setERC20TokenContract,
  setERC20TokenDetails,
  setLoadingClub,
} from "@/state/erc20token/slice";
import { ERC20Token } from "@/state/erc20token/types";
import { isZeroAddress } from "@/utils";
import { getWeiAmount } from "@/utils/conversions";

export const ERC20TokenDefaultState = {
  name: "",
  owner: "",
  address: "",
  depositToken: "",
  mintModule: "",
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
  DepositTokenMintModule: DepositTokenMintModuleContract,
  SingleTokenMintModule: DepositTokenMintModuleContract,
  policyMintERC20: MintPolicyContract,
  mintPolicy: MintPolicyContract,
): Promise<ERC20Token> => {
  if (ERC20tokenContract) {
    try {
      // ERC20tokenContract is initialized with the contract address
      const { address } = ERC20tokenContract;

      let {
        endTime,
        maxMemberCount,
        maxTotalSupply,
        requiredToken,
        requiredTokenMinBalance,
        startTime,
      } = await policyMintERC20?.getSyndicateValues(address);

      if (!+endTime && !+maxMemberCount && !+maxTotalSupply && !+startTime) {
        ({
          endTime,
          maxMemberCount,
          maxTotalSupply,
          requiredToken,
          requiredTokenMinBalance,
          startTime,
        } = await mintPolicy?.getSyndicateValues(address));
      }

      let mintModule = DepositTokenMintModule.address;

      let depositToken = await DepositTokenMintModule?.depositToken(
        ERC20tokenContract.clubERC20Contract._address,
      );

      if (isZeroAddress(depositToken)) {
        depositToken = await SingleTokenMintModule?.depositToken(
          ERC20tokenContract.clubERC20Contract._address,
        );
        mintModule = SingleTokenMintModule.address;
      }

      // TODO: Multicall :-)
      const [name, owner, tokenDecimals, symbol, memberCount] =
        await Promise.all([
          ERC20tokenContract.name(),
          ERC20tokenContract.owner(),
          ERC20tokenContract.decimals(),
          ERC20tokenContract.symbol(),
          ERC20tokenContract.memberCount(),
        ]);
      const MERKLE_DISTRIBUTOR_MODULE =
        process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_MODULE;

      const totalSupply = await ERC20tokenContract.totalSupply().then((wei) =>
        getWeiAmount(wei, tokenDecimals, false),
      );
      
      // Check both mint policies 
      const claimEnabledPolicyMintERC20 = await policyMintERC20.isModuleAllowed(
        ERC20tokenContract.clubERC20Contract._address,
        MERKLE_DISTRIBUTOR_MODULE,
      );
      const claimEnabledMintPolicy = await mintPolicy.isModuleAllowed(
        ERC20tokenContract.clubERC20Contract._address,
        MERKLE_DISTRIBUTOR_MODULE,
      );
      const claimEnabled = claimEnabledPolicyMintERC20 || claimEnabledMintPolicy;

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
        mintModule,
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
 * @param DepositTokenMintModule
 * @returns
 */
export const setERC20Token =
  (
    ERC20tokenContract,
    DepositTokenMintModule: DepositTokenMintModuleContract,
  ) =>
  async (dispatch, getState: () => AppState): Promise<void> => {
    const {
      initializeContractsReducer: {
        syndicateContracts: {
          policyMintERC20,
          mintPolicy,
          SingleTokenMintModule,
        },
      },
    } = getState();
  

    dispatch(setERC20TokenContract(ERC20tokenContract));
    dispatch(setLoadingClub(true));
    try {
      const erc20Token = await getERC20TokenDetails(
        ERC20tokenContract,
        DepositTokenMintModule,
        SingleTokenMintModule,
        policyMintERC20,
        mintPolicy,
      );

      dispatch(setERC20TokenDetails(erc20Token));
      dispatch(setLoadingClub(false));
    } catch (error) {
      return dispatch(setERC20TokenDetails(ERC20TokenDefaultState));
    }
  };
