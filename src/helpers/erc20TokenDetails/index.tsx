import { DepositTokenMintModuleContract } from "@/ClubERC20Factory/depositTokenMintModule";
import { MintPolicyContract } from "@/ClubERC20Factory/policyMintERC20";
import { AppState } from "@/state";
import {
  setERC20TokenContract,
  setERC20TokenDepositDetails,
  setERC20TokenDetails,
  setLoadingClub,
} from "@/state/erc20token/slice";
import { DepositDetails, ERC20Token } from "@/state/erc20token/types";
import { isZeroAddress } from "@/utils";
import { getWeiAmount } from "@/utils/conversions";
import { isDev } from "@/utils/environment";

const ETH_MINT_MODULE = process.env.NEXT_PUBLIC_ETH_MINT_MODULE;
export const ERC20TokenDefaultState = {
  name: "",
  owner: "",
  address: "",
  depositToken: "",
  mintModule: "",
  ethDepositToken: false,
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
  currentMintPolicyAddress: undefined,
};

const depositTokenMapping = {
  rinkeby: {
    usdc: {
      depositToken: "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926",
      depositTokenSymbol: "USDC",
      depositTokenLogo: "/images/TestnetTokenLogos/usdcIcon.svg",
      depositTokenName: "USD-Coin",
      depositTokenDecimals: 6,
    },
    ether: {
      depositToken: "",
      depositTokenSymbol: "ETH",
      depositTokenLogo: "/images/ethereum-logo.png",
      depositTokenName: "Ethereum",
      depositTokenDecimals: 18,
    },
  },
  mainnet: {
    usdc: {
      depositToken: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      depositTokenSymbol: "USDC",
      depositTokenLogo: "/images/prodTokenLogos/usd-coin-usdc.svg",
      depositTokenName: "USD-Coin",
      depositTokenDecimals: 6,
    },
    ether: {
      depositToken: "",
      depositTokenSymbol: "ETH",
      depositTokenLogo: "/images/ethereum-logo.png",
      depositTokenName: "Ethereum",
      depositTokenDecimals: 18,
    },
  },
}[isDev ? "rinkeby" : "mainnet"];

/**
 * Retrieves details for an erc20 token for a particular
 * tokenAddress(initially called syndicateAddress)
 */
export const getERC20TokenDetails = async (
  ERC20tokenContract,
  policyMintERC20: MintPolicyContract,
  mintPolicy: MintPolicyContract,
): Promise<ERC20Token> => {
  if (ERC20tokenContract) {
    try {
      // ERC20tokenContract is initialized with the contract address
      const { address } = ERC20tokenContract;

      let currentMintPolicyAddress = policyMintERC20.address;

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

        // Change current mint policy
        currentMintPolicyAddress = mintPolicy.address;
      }

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
      const claimEnabled =
        claimEnabledPolicyMintERC20 || claimEnabledMintPolicy;

      let depositsEnabled = false;
      if (!claimEnabled) {
        const endDateInFuture = +endTime * 1000 > new Date().getTime();
        depositsEnabled = endDateInFuture;
      }

      // temporary fix for 0x563014c0aa72cdf877d2b9b963b55d8859bff411
      if (
        address.toLowerCase() === "0x563014c0aa72cdf877d2b9b963b55d8859bff411"
      ) {
        depositsEnabled = true;
      }

      return {
        currentMintPolicyAddress,
        totalSupply,
        address,
        name,
        owner,
        tokenDecimals,
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

export const getDespositDetails = async (
  ERC20tokenContract,
  DepositTokenMintModule: DepositTokenMintModuleContract,
  SingleTokenMintModule: DepositTokenMintModuleContract,
): Promise<DepositDetails> => {
  let mintModule = DepositTokenMintModule.address;
  let ethDepositToken = false;

  let depositToken = await DepositTokenMintModule?.depositToken(
    ERC20tokenContract.clubERC20Contract._address,
  );

  if (isZeroAddress(depositToken)) {
    depositToken = await SingleTokenMintModule?.depositToken(
      ERC20tokenContract.clubERC20Contract._address,
    );

    if (isZeroAddress(depositToken)) {
      depositToken = "";
      mintModule = ETH_MINT_MODULE;
      ethDepositToken = true;
    } else {
      mintModule = SingleTokenMintModule.address;
    }
  }

  return {
    mintModule,
    ethDepositToken,
    ...depositTokenMapping[ethDepositToken ? "ether" : "usdc"],
  };
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
  (ERC20tokenContract) =>
  async (dispatch, getState: () => AppState): Promise<void> => {
    const {
      initializeContractsReducer: {
        syndicateContracts: {
          policyMintERC20,
          mintPolicy,
          SingleTokenMintModule,
          DepositTokenMintModule,
        },
      },
    } = getState();

    dispatch(setERC20TokenContract(ERC20tokenContract));
    dispatch(setLoadingClub(true));
    try {
      const erc20Token = await getERC20TokenDetails(
        ERC20tokenContract,
        policyMintERC20,
        mintPolicy,
      );
      const depositDetails = await getDespositDetails(
        ERC20tokenContract,
        DepositTokenMintModule,
        SingleTokenMintModule,
      );

      const { ethDepositToken } = depositDetails;
      dispatch(
        setERC20TokenDetails({
          ...erc20Token,
          /**
           * If we are using eth as the deposit token, the ratio
           * is 1: 100000 erc20 tokens. For other erc20 tokens,
           * the ratio is 1:1
           */
          maxTotalDeposits: ethDepositToken
            ? Number(erc20Token.maxTotalDeposits) / 10000
            : erc20Token.maxTotalDeposits,
        }),
      );
      dispatch(setERC20TokenDepositDetails(depositDetails));
      dispatch(setLoadingClub(false));
    } catch (error) {
      return dispatch(setERC20TokenDetails(ERC20TokenDefaultState));
    }
  };
