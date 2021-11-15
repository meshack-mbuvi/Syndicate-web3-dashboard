import {
  setERC20TokenContract,
  setERC20TokenDetails,
  setLoading,
} from "@/state/erc20token/slice";
import { ERC20Token } from "@/state/erc20token/types";
import { getWeiAmount } from "@/utils/conversions";

const ERC20TokenDefaultState = {
  name: "",
  owner: "",
  address: "",
  depositToken: "",
  depositsEnabled: false,
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
  SingleTokenMintModule,
  mintPolicy,
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

      const name = await ERC20tokenContract?.name();
      const owner = await ERC20tokenContract?.owner();
      const tokenDecimals = await ERC20tokenContract?.decimals();

      const depositToken = await SingleTokenMintModule?.depositToken(
        ERC20tokenContract.clubERC20Contract._address,
      );

      const isOwner = owner === account;

      const symbol = await ERC20tokenContract?.symbol();

      const memberCount = await ERC20tokenContract?.memberCount();

      const totalSupplyInWei = await ERC20tokenContract?.totalSupply();
      const connectedAccountTokenBalance = await ERC20tokenContract?.balanceOf(
        account,
      );

      const totalSupply = getWeiAmount(totalSupplyInWei, tokenDecimals, false);
      const totalDeposits = parseFloat(totalSupply);

      const accountClubTokens = getWeiAmount(
        connectedAccountTokenBalance,
        tokenDecimals,
        false,
      );
      const memberPercentShare = (+accountClubTokens * 100) / +totalSupply;

      const endDateInFuture = +endTime * 1000 > new Date().getTime();

      const depositsEnabled =
        +totalSupply < +getWeiAmount(maxTotalSupply, tokenDecimals, false) &&
        endDateInFuture &&
        +memberCount < +maxMemberCount;

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
  (ERC20tokenContract, SingleTokenMintModule, account: string) =>
  async (
    dispatch,
    getState: () => {
      initializeContractsReducer: { syndicateContracts: any };
    },
  ) => {
    const {
      initializeContractsReducer: {
        syndicateContracts: { mintPolicy },
      },
    } = getState();
    dispatch(setLoading({ loading: true }));
    dispatch(setERC20TokenContract(ERC20tokenContract));
    try {
      const erc20Token = await getERC20TokenDetails(
        ERC20tokenContract,
        SingleTokenMintModule,
        mintPolicy,
        account,
      );
      return dispatch(setERC20TokenDetails(erc20Token));
    } catch (error) {
      return dispatch(setERC20TokenDetails(ERC20TokenDefaultState));
    }
  };
