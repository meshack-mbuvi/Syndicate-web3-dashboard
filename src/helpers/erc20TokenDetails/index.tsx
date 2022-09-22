import { DepositTokenMintModuleContract } from '@/ClubERC20Factory/depositTokenMintModule';
import { GuardMixinManager } from '@/ClubERC20Factory/GuardMixinManager';
import { MerkleDistributorModuleContract } from '@/ClubERC20Factory/merkleDistributorModule';
import { MintPolicyContract } from '@/ClubERC20Factory/policyMintERC20';
import { CONTRACT_ADDRESSES } from '@/Networks';
import { AppState } from '@/state';
import {
  setActiveModuleDetails,
  setERC20TokenContract,
  setERC20TokenDetails,
  setIsNewClub,
  setLoadingClub,
  setTokenGatingDetails
} from '@/state/erc20token/slice';
import { DepositDetails, ERC20Token } from '@/state/erc20token/types';
import { IActiveNetwork } from '@/state/wallet/types';
import {
  ActiveModuleDetails,
  ModuleReqs,
  TokenGatedRequirementsDetails
} from '@/types/modules';
import { isZeroAddress } from '@/utils';
import { getTokenDetails } from '@/utils/api';
import { getSyndicateValues } from '@/utils/contracts/getSyndicateValues';
import { getWeiAmount } from '@/utils/conversions';
import { Dispatch } from 'redux';

export const ERC20TokenDefaultState = {
  isValidClub: false,
  name: '',
  owner: '',
  address: '',
  depositToken: '',
  mintModule: '', //TODO: [REFACTOR] does not appear to be used anywhere
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
  requiredToken: '', //TODO: [GRAPH_COORD] remove from queries / contract calls + deprecate on the graph
  requiredTokenMinBalance: '', //TODO: [GRAPH_COORD] remove from queries / contract calls + deprecate on the graph
  currentMintPolicyAddress: ''
};

export const initialActiveModuleDetailsState: ActiveModuleDetails = {
  hasActiveModules: false,
  activeModules: [],
  mintModule: '', // TODO: [REFACTOR] curr updated in addtion to DepositDetails.mintModule
  activeMintModuleReqs: {
    isTokenGated: false
  },
  ownerModule: '',
  activeOwnerModuleReqs: {}
};

export const initialTokenGatingDetailsState: TokenGatedRequirementsDetails = {
  meetsRequirements: false,
  requiredTokenDetails: []
};

/**
 * Retrieves details for an erc20 token for a particular
 * tokenAddress(initially called syndicateAddress)
 */
export const getERC20TokenDetails = async (
  ERC20tokenContract,
  policyMintERC20: MintPolicyContract,
  mintPolicy: MintPolicyContract,
  MerkleDistributorModule: MerkleDistributorModuleContract,
  guardMixinManager: GuardMixinManager,
  mintModule: string,
  activeMintReqs: ModuleReqs,
  web3: any
): Promise<ERC20Token> => {
  if (ERC20tokenContract) {
    try {
      // ERC20tokenContract is initialized with the contract address
      const { address } = ERC20tokenContract;

      const {
        currentMintPolicyAddress,
        endTime,
        maxMemberCount,
        maxTotalSupply,
        requiredToken,
        requiredTokenMinBalance,
        startTime
      } = await getSyndicateValues(
        address,
        policyMintERC20,
        mintPolicy,
        guardMixinManager,
        activeMintReqs,
        mintModule
      );

      const [name, owner, tokenDecimals, symbol, memberCount] =
        await Promise.all([
          ERC20tokenContract.name(),
          ERC20tokenContract.owner(),
          ERC20tokenContract.decimals(),
          ERC20tokenContract.symbol(),
          ERC20tokenContract.memberCount()
        ]);

      const totalSupply = await ERC20tokenContract.totalSupply().then((wei) =>
        getWeiAmount(web3, wei, tokenDecimals, false)
      );

      //TODO: [TOKEN-GATING] confirm MerkleDistributorModule / contracts that enable claims
      let hasGuardMixinManagerEnabledClaim;
      if (
        currentMintPolicyAddress.toLowerCase() ==
        guardMixinManager.address.toLowerCase()
      ) {
        hasGuardMixinManagerEnabledClaim =
          await guardMixinManager.isModuleAllowed(
            address,
            MerkleDistributorModule.contract._address
          );
      }

      // Check both mint policies
      let claimEnabledPolicyMintERC20;
      if (policyMintERC20?.address) {
        claimEnabledPolicyMintERC20 = await policyMintERC20.isModuleAllowed(
          address,
          MerkleDistributorModule.contract._address
        );
      }

      let claimEnabledMintPolicy;
      if (mintPolicy?.address) {
        claimEnabledMintPolicy = await mintPolicy.isModuleAllowed(
          address,
          MerkleDistributorModule.contract._address
        );
      }

      const claimEnabled =
        claimEnabledPolicyMintERC20 ||
        claimEnabledMintPolicy ||
        hasGuardMixinManagerEnabledClaim;

      let depositsEnabled = false;
      if (!claimEnabled) {
        const endDateInFuture = +endTime * 1000 > new Date().getTime();

        depositsEnabled = endDateInFuture;
      }

      const isValid = +startTime > 0;

      return {
        isValid,
        currentMintPolicyAddress,
        totalSupply,
        address,
        name: name || '',
        owner,
        tokenDecimals,
        symbol,
        memberCount,
        loading: false,
        maxMemberCount,
        maxTotalSupply: getWeiAmount(
          web3,
          maxTotalSupply,
          tokenDecimals,
          false
        ),
        requiredToken,
        depositsEnabled,
        claimEnabled,
        requiredTokenMinBalance,
        maxTotalDeposits: getWeiAmount(
          web3,
          maxTotalSupply,
          tokenDecimals,
          false
        ), //should be updated if token prices is not 1:1
        startTime: parseInt(startTime, 10) * 1000, // time is in seconds. need to change to milliseconds
        endTime: parseInt(endTime, 10) * 1000 // time is in seconds. need to change to milliseconds
      };
    } catch (error) {
      console.log(error);
      return ERC20TokenDefaultState;
    }
  }
};

export const getDepositDetails = async (
  depositToken,
  ERC20tokenContract,
  DepositTokenMintModule: DepositTokenMintModuleContract,
  SingleTokenMintModule: DepositTokenMintModuleContract,
  mintModuleAddress: string,
  activeNetwork: IActiveNetwork
): Promise<DepositDetails> => {
  let mintModule = mintModuleAddress; // TODO: [REFACTOR] get depositToken if mintModule avail from graph
  if (!mintModule) {
    mintModule = DepositTokenMintModule.address;
  }
  let nativeDepositToken = false;

  const NATIVE_MINT_MODULE =
    CONTRACT_ADDRESSES[activeNetwork.chainId]?.NativeMintModule;

  if (!depositToken && ERC20tokenContract) {
    depositToken = await DepositTokenMintModule?.depositToken(
      ERC20tokenContract.clubERC20Contract._address
    );
    if (isZeroAddress(depositToken)) {
      depositToken = '';
      mintModule = NATIVE_MINT_MODULE;
      nativeDepositToken = true;
    } else if (!depositToken) {
      depositToken = await SingleTokenMintModule?.depositToken(
        ERC20tokenContract.clubERC20Contract._address
      );
      if (!depositToken || isZeroAddress(depositToken)) {
        depositToken = '';
        mintModule = NATIVE_MINT_MODULE;
        nativeDepositToken = true;
      } else {
        mintModule = SingleTokenMintModule.address;
      }
    } else {
      mintModule = DepositTokenMintModule.address;
    }
  }

  const tokenDetails = await getTokenDetails(
    depositToken,
    activeNetwork.chainId
  ).then((res) => res.data);

  return {
    mintModule,
    nativeDepositToken,
    depositTokenLogo: nativeDepositToken
      ? activeNetwork.nativeCurrency.logo
      : tokenDetails.logo,
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
  SingleTokenMintModule: DepositTokenMintModuleContract
) => {
  let _nativeDepositToken = false;

  let depositToken = await DepositTokenMintModule?.depositToken(
    ERC20tokenContract.clubERC20Contract._address
  );

  if (!depositToken || isZeroAddress(depositToken)) {
    depositToken = await SingleTokenMintModule?.depositToken(
      ERC20tokenContract.clubERC20Contract._address
    );

    if (!depositToken || isZeroAddress(depositToken)) {
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
          guardMixinManager,
          SingleTokenMintModule,
          DepositTokenMintModule,
          MerkleDistributorModule
        }
      },
      web3Reducer: {
        web3: { activeNetwork, web3 }
      },
      erc20TokenSliceReducer: { activeModuleDetails }
    } = getState();

    dispatch(setERC20TokenContract(ERC20tokenContract));
    dispatch(setLoadingClub(true));
    try {
      const erc20Token = await getERC20TokenDetails(
        ERC20tokenContract,
        policyMintERC20,
        mintPolicy,
        MerkleDistributorModule,
        guardMixinManager,
        activeModuleDetails?.mintModule,
        activeModuleDetails?.activeMintModuleReqs,
        web3
      );

      const { _nativeDepositToken } = await isNativeDepositToken(
        ERC20tokenContract,
        DepositTokenMintModule,
        SingleTokenMintModule
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
      resetClubState(dispatch);
      return;
    }
  };

export const resetClubState = (dispatch: Dispatch, mockData?: any): void => {
  dispatch(setERC20TokenDetails(mockData ? mockData : ERC20TokenDefaultState));
  dispatch(setIsNewClub(false));
  dispatch(setActiveModuleDetails(initialActiveModuleDetailsState));
  dispatch(setTokenGatingDetails(initialTokenGatingDetailsState));
};
