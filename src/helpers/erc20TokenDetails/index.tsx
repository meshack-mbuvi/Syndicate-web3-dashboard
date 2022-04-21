import { DepositTokenMintModuleContract } from '@/ClubERC20Factory/depositTokenMintModule';
import { MintPolicyContract } from '@/ClubERC20Factory/policyMintERC20';
import { MerkleDistributorModuleContract } from '@/ClubERC20Factory/merkleDistributorModule';
import { AppState } from '@/state';
import {
  setERC20TokenContract,
  setERC20TokenDetails,
  setLoadingClub
} from '@/state/erc20token/slice';
import { DepositDetails, ERC20Token } from '@/state/erc20token/types';
import { isZeroAddress } from '@/utils';
import { getTokenDetails } from '@/utils/api';
import { getWeiAmount } from '@/utils/conversions';
import { CONTRACT_ADDRESSES, SUPPORTED_TOKENS } from '@/Networks';

export const ERC20TokenDefaultState = {
  name: '',
  owner: '',
  address: '',
  depositToken: '',
  mintModule: '',
  nativeDepositToken: false,
  depositsEnabled: false,
  claimEnabled: false,
  totalSupply: 0,
  tokenDecimals: 18, //default to 18
  totalDeposits: 0,
  symbol: '',
  startTime: 0,
  endTime: 0,
  memberCount: 0,
  maxTotalDeposits: 25000000,
  isOwner: false,
  loading: false,
  maxMemberCount: 0,
  maxTotalSupply: 0,
  requiredToken: '',
  requiredTokenMinBalance: '',
  currentMintPolicyAddress: undefined
};

/**
 * Retrieves details for an erc20 token for a particular
 * tokenAddress(initially called syndicateAddress)
 */
export const getERC20TokenDetails = async (
  ERC20tokenContract,
  policyMintERC20: MintPolicyContract,
  mintPolicy: MintPolicyContract,
  MerkleDistributorModule: MerkleDistributorModuleContract
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
        startTime
      } = await policyMintERC20?.getSyndicateValues(address);

      if (!+endTime && !+maxMemberCount && !+maxTotalSupply && !+startTime) {
        ({
          endTime,
          maxMemberCount,
          maxTotalSupply,
          requiredToken,
          requiredTokenMinBalance,
          startTime
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
          ERC20tokenContract.memberCount()
        ]);

      const totalSupply = await ERC20tokenContract.totalSupply().then((wei) =>
        getWeiAmount(wei, tokenDecimals, false)
      );

      // Check both mint policies
      const claimEnabledPolicyMintERC20 = await policyMintERC20.isModuleAllowed(
        address,
        MerkleDistributorModule.contract._address
      );

      let claimEnabledMintPolicy;

      if (mintPolicy.address) {
        claimEnabledMintPolicy = await mintPolicy.isModuleAllowed(
          address,
          MerkleDistributorModule.contract._address
        );
      }

      const claimEnabled =
        claimEnabledPolicyMintERC20 || claimEnabledMintPolicy;

      let depositsEnabled = false;
      if (!claimEnabled) {
        const endDateInFuture = +endTime * 1000 > new Date().getTime();
        depositsEnabled = endDateInFuture;
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
        endTime: parseInt(endTime, 10) * 1000 // time is in seconds. need to change to milliseconds
      };
    } catch (error) {
      return ERC20TokenDefaultState;
    }
  }
};

export const getDepositDetails = async (
  depositToken,
  ERC20tokenContract,
  DepositTokenMintModule: DepositTokenMintModuleContract,
  SingleTokenMintModule: DepositTokenMintModuleContract,
  activeNetwork
): Promise<DepositDetails> => {
  const depositTokenMapping = SUPPORTED_TOKENS[activeNetwork.chainId];

  let mintModule = DepositTokenMintModule.address;
  let nativeDepositToken = false;

  const NATIVE_MINT_MODULE =
    CONTRACT_ADDRESSES[activeNetwork.chainId]?.nativeMintModule;

  if (!depositToken && ERC20tokenContract) {
    depositToken = await SingleTokenMintModule?.depositToken(
      ERC20tokenContract.clubERC20Contract._address
    );

    if (isZeroAddress(depositToken)) {
      depositToken = '';
      mintModule = NATIVE_MINT_MODULE;
      nativeDepositToken = true;
    } else {
      mintModule = SingleTokenMintModule.address;
    }
  }
  const [depositTokenInfo] = depositTokenMapping.filter(
    (token) => token.address === depositToken
  );
  const tokenDetails = await getTokenDetails(
    depositToken,
    activeNetwork.chainId
  ).then((res) => res.data);

  return {
    mintModule,
    nativeDepositToken,
    depositTokenLogo: tokenDetails.logo,
    depositTokenSymbol: tokenDetails.symbol,
    depositTokenName: tokenDetails.name,
    depositTokenDecimals: tokenDetails.decimals,
    depositToken,
    loading: true
  };
};

export const isNativeDepositToken = async (
  ERC20tokenContract,
  DepositTokenMintModule: DepositTokenMintModuleContract,
  SingleTokenMintModule: DepositTokenMintModuleContract,
  activeNetwork
) => {
  let _nativeDepositToken = false;

  let depositToken = await DepositTokenMintModule?.depositToken(
    ERC20tokenContract.clubERC20Contract._address
  );

  if (isZeroAddress(depositToken)) {
    depositToken = await SingleTokenMintModule?.depositToken(
      ERC20tokenContract.clubERC20Contract._address
    );

    if (isZeroAddress(depositToken)) {
      depositToken = '';
      _nativeDepositToken = true;
    }
  }
  return { _nativeDepositToken };
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
          MerkleDistributorModule
        }
      },
      web3Reducer: {
        web3: { activeNetwork }
      }
    } = getState();

    dispatch(setERC20TokenContract(ERC20tokenContract));
    dispatch(setLoadingClub(true));
    try {
      const erc20Token = await getERC20TokenDetails(
        ERC20tokenContract,
        policyMintERC20,
        mintPolicy,
        MerkleDistributorModule
      );

      const { _nativeDepositToken } = await isNativeDepositToken(
        ERC20tokenContract,
        DepositTokenMintModule,
        SingleTokenMintModule,
        activeNetwork
      );

      dispatch(
        setERC20TokenDetails({
          ...erc20Token,
          /**
           * If we are using eth as the deposit token, the ratio
           * is 1: 100000 erc20 tokens. For other erc20 tokens,
           * the ratio is 1:1
           */
          maxTotalDeposits: _nativeDepositToken
            ? Number(erc20Token.maxTotalDeposits) /
              activeNetwork.nativeCurrency.exchangeRate
            : erc20Token.maxTotalDeposits
        })
      );

      dispatch(setLoadingClub(false));
    } catch (error) {
      console.log({ error });
      return dispatch(setERC20TokenDetails(ERC20TokenDefaultState));
    }
  };
