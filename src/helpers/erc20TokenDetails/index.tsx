import { MintPolicyContract } from "@/ClubERC20Factory/mintPolicy";
import { SingleTokenMintModuleContract } from "@/ClubERC20Factory/singleTokenMintModule";
import { AppState } from "@/state";
import {
  setERC20TokenContract,
  setERC20TokenDetails,
  setLoading,
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
  connectedMemberDeposits: "0.0",
  symbol: "",
  startTime: 0,
  endTime: 0,
  memberCount: 0,
  maxTotalDeposits: 25000000,
  accountClubTokens: 0,
  isOwner: false,
  loading: false,
  memberPercentShare: 0,
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
  account: string,
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
      const [
        name,
        owner,
        tokenDecimals,
        depositToken,
        symbol,
        memberCount,
        connectedAccountTokenBalance,
      ] = await Promise.all([
        ERC20tokenContract.name(),
        ERC20tokenContract.owner(),
        ERC20tokenContract.decimals(),
        SingleTokenMintModule?.depositToken(
          ERC20tokenContract.clubERC20Contract._address,
        ),
        ERC20tokenContract.symbol(),
        ERC20tokenContract.memberCount(),
        ERC20tokenContract.balanceOf(account),
      ]);
      const MERKLE_DISTRIBUTOR_MODULE =
        process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_MODULE;

      const isOwner = account === owner && account != "" && owner != "";

      const totalSupply = await ERC20tokenContract.totalSupply().then((wei) =>
        getWeiAmount(wei, tokenDecimals, false),
      );
      const totalDeposits = parseFloat(totalSupply);

      const accountClubTokens = getWeiAmount(
        connectedAccountTokenBalance,
        tokenDecimals,
        false,
      );
      const memberPercentShare = (+accountClubTokens * 100) / +totalSupply;

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
        address,
        name,
        owner,
        tokenDecimals,
        totalDeposits,
        totalSupply,
        depositToken,
        symbol,
        accountClubTokens,
        isOwner,
        memberCount,
        memberPercentShare,
        loading: false,
        maxMemberCount,
        maxTotalSupply: getWeiAmount(maxTotalSupply, tokenDecimals, false),
        requiredToken,
        depositsEnabled,
        claimEnabled,
        requiredTokenMinBalance,
        maxTotalDeposits: getWeiAmount(maxTotalSupply, tokenDecimals, false), //should be updated if token prices is not 1:1
        connectedMemberDeposits: accountClubTokens,
        startTime: parseInt(startTime, 10) * 1000, // time is in seconds. need to change to milliseconds
        endTime: parseInt(endTime, 10) * 1000, // time is in seconds. need to change to milliseconds
      };
    } catch (error) {
      return ERC20TokenDefaultState;
    }
  }
};

export const setERC20Token =
  (
    ERC20tokenContract,
    SingleTokenMintModule: SingleTokenMintModuleContract,
    account: string,
  ) =>
  async (dispatch, getState: () => AppState): Promise<void> => {
    const {
      initializeContractsReducer: {
        syndicateContracts: { mintPolicy },
      },
    } = getState();

    dispatch(setERC20TokenContract(ERC20tokenContract));
    dispatch(setLoading(true));
    try {
      const erc20Token = await getERC20TokenDetails(
        ERC20tokenContract,
        SingleTokenMintModule,
        mintPolicy,
        account,
      );
      dispatch(setERC20TokenDetails(erc20Token));
      dispatch(setLoading(false));
    } catch (error) {
      return dispatch(setERC20TokenDetails(ERC20TokenDefaultState));
    }
  };
