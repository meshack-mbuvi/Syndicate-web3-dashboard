import { CONTRACT_ADDRESSES } from '@/Networks';
import { ISyndicateContracts } from '@/state/contracts';
import { IActiveNetwork } from '@/state/wallet/types';
import { AllowancePrecommitModuleERC20 } from './AllowancePrecommitModuleERC20';
import { ClubERC20Contract } from './clubERC20';
import { ClubERC20Factory } from './clubERC20Factory';
import { ClubERC20FactoryNative } from './clubERC20FactoryNative';
import { DepositTokenMintModuleContract } from './depositTokenMintModule';
import { DistributionsERC20 } from './distributionsERC20';
import { DistributionsETH } from './distributionsETH';
import { ERC20ClubFactory } from './ERC20ClubFactory';
import { ERC20DealFactory } from './ERC20DealFactory';
import { ERC721Collective } from './ERC721Collective';
import { ERC721CollectiveFactory } from './ERC721CollectiveFactory';
import { ERC721Contract } from './ERC721Membership';
import { EthPriceMintModule } from './EthPriceMintModule';
import { FixedRenderer } from './FixedRenderer';
import { GuardMixinManager } from './GuardMixinManager';
import { MaxMemberCountMixin } from './maxMemberMixin';
import { MaxPerMemberERC721 } from './MaxPerMemberERC721';
import { MaxTotalSupplyERC721 } from './MaxTotalSupplyERC721';
import { MaxTotalSupplyMixin } from './maxTotalSupplyMixin';
import { MerkleDistributorModuleContract } from './merkleDistributorModule';
import { MerkleDistributorModuleERC721Contract } from './merkleDistributorModuleERC721';
import { NativeMintModuleContract } from './nativeMintModule';
import { NativeTokenPriceMerkleMintModule } from './NativeTokenPriceMerkleMintModule';
import { OwnerMintModuleContract } from './ownerMintModule';
import { MintPolicyContract } from './policyMintERC20';
import { DepositExchangeMintModule } from './RugRadio/DepositExchangeTokenMintModule';
import { RugBonusTokenModule } from './RugRadio/RugBonusTokenModule';
import { RugERC20ClaimModule } from './RugRadio/RugERC20ClaimModule';
import { RugUtilityProperties } from './RugRadio/RugUtilityProperties';
import { TimeRequirements } from './TimeRequirements';
import { TokenGatedMixin } from './tokenGatingMixin';

const DEPOSIT_EXCHANGE_MODULE = process.env.NEXT_PUBLIC_DEPOSIT_EXCHANGE_MODULE;
// Contract addresses for Rug Radio
const RUG_TOKEN = process.env.NEXT_PUBLIC_RUG_TOKEN;
const GENESIS_NFT = process.env.NEXT_PUBLIC_GenesisNFT;
const RUG_PROPERTIES = process.env.NEXT_PUBLIC_PROPERTIES;
const RUG_CLAIM_MODULE = process.env.NEXT_PUBLIC_RUG_CLAIM_MODULE;
const RUG_BONUS_CLAIM_MODULE = process.env.NEXT_PUBLIC_RUG_BONUS;

export const getSyndicateContracts = async (
  web3: Web3,
  activeNetwork: IActiveNetwork
): Promise<ISyndicateContracts> => {
  // Retrieve contract from cache.
  const addresses = CONTRACT_ADDRESSES[activeNetwork.chainId];

  if (!addresses) {
    throw new Error('No chainz');
  }
  // if not contracts from cache or cache expired then continue
  // with initialization.
  // initialize contracts here
  const clubERC20Factory = addresses.clubERC20Factory
    ? new ClubERC20Factory(addresses.clubERC20Factory, web3, activeNetwork)
    : null;

  const distributionsERC20 = addresses.distributionsERC20
    ? new DistributionsERC20(addresses.distributionsERC20, web3, activeNetwork)
    : null;

  const distributionsETH = addresses.distributionsETH
    ? new DistributionsETH(addresses.distributionsETH, web3, activeNetwork)
    : null;

  const policyMintERC20 = addresses.policyMintERC20
    ? new MintPolicyContract(addresses.policyMintERC20, web3, activeNetwork)
    : null;

  const clubERC20FactoryNative = addresses.clubERC20FactoryNative
    ? new ClubERC20FactoryNative(
        addresses.clubERC20FactoryNative,
        web3,
        activeNetwork
      )
    : null;

  const erc20ClubFactory = addresses.erc20ClubFactory
    ? new ERC20ClubFactory(addresses.erc20ClubFactory, web3, activeNetwork)
    : null;

  const mintPolicy = addresses.mintPolicy
    ? new MintPolicyContract(addresses.mintPolicy, web3, activeNetwork)
    : null;

  const DepositTokenMintModule = addresses.DepositTokenMintModule
    ? new DepositTokenMintModuleContract(
        addresses.DepositTokenMintModule,
        web3,
        activeNetwork
      )
    : null;

  const SingleTokenMintModule = addresses.SingleTokenMintModule
    ? new DepositTokenMintModuleContract(
        addresses.SingleTokenMintModule,
        web3,
        activeNetwork
      )
    : null;

  const NativeMintModule = addresses.NativeMintModule
    ? new NativeMintModuleContract(
        addresses.NativeMintModule,
        web3,
        activeNetwork
      )
    : null;

  const MerkleDistributorModule = addresses.MerkleDistributorModule
    ? new MerkleDistributorModuleContract(
        addresses.MerkleDistributorModule,
        web3,
        activeNetwork
      )
    : null;

  const MerkleDistributorModuleERC721 = addresses.MerkleDistributorModuleERC721
    ? new MerkleDistributorModuleERC721Contract(
        addresses.MerkleDistributorModuleERC721,
        web3,
        activeNetwork
      )
    : null;

  const OwnerMintModule = addresses.OwnerMintModule
    ? new OwnerMintModuleContract(
        addresses.OwnerMintModule,
        web3,
        activeNetwork
      )
    : null;

  const RugClaimModule = new RugERC20ClaimModule(
    RUG_CLAIM_MODULE || '',
    RUG_TOKEN || '',
    GENESIS_NFT || '',
    RUG_PROPERTIES || '',
    web3,
    activeNetwork
  );

  // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
  const RugUtilityProperty = new RugUtilityProperties(RUG_PROPERTIES, web3);

  // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
  const RugToken = new ClubERC20Contract(RUG_TOKEN, web3, activeNetwork);

  // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
  const GenesisNFTContract = new ERC721Contract(GENESIS_NFT, web3);

  const rugBonusClaimModule = new RugBonusTokenModule(
    // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    RUG_BONUS_CLAIM_MODULE,
    RUG_TOKEN,
    GENESIS_NFT,
    RUG_PROPERTIES,
    web3,
    activeNetwork
  );

  const depositExchangeMintModule = new DepositExchangeMintModule(
    // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    DEPOSIT_EXCHANGE_MODULE,
    web3,
    activeNetwork
  );

  const erc721Collective = addresses.ERC721Collective
    ? new ERC721Collective(addresses.ERC721Collective, web3, activeNetwork)
    : null;

  const erc721CollectiveFactory = addresses.ERC721CollectiveFactory
    ? new ERC721CollectiveFactory(
        addresses.ERC721CollectiveFactory,
        web3,
        activeNetwork
      )
    : null;

  const ethPriceMintModule = addresses.EthPriceMintModule
    ? new EthPriceMintModule(addresses.EthPriceMintModule, web3, activeNetwork)
    : null;

  const fixedRenderer = addresses.FixedRenderer
    ? new FixedRenderer(addresses.FixedRenderer, web3, activeNetwork)
    : null;

  const guardMixinManager = addresses.GuardMixinManager
    ? new GuardMixinManager(addresses.GuardMixinManager, web3, activeNetwork)
    : null;

  const maxPerMemberERC721 = addresses.MaxPerMemberERC721
    ? new MaxPerMemberERC721(addresses.MaxPerMemberERC721, web3, activeNetwork)
    : null;

  const maxTotalSupplyERC721 = addresses.MaxTotalSupplyERC721
    ? new MaxTotalSupplyERC721(
        addresses.MaxTotalSupplyERC721,
        web3,
        activeNetwork
      )
    : null;

  const timeRequirements = addresses.TimeRequirements
    ? new TimeRequirements(addresses.TimeRequirements, web3, activeNetwork)
    : null;

  const maxMemberCountMixin = addresses.maxMemberMixin
    ? new MaxMemberCountMixin(addresses.maxMemberMixin, web3, activeNetwork)
    : null;

  const maxTotalSupplyMixin = addresses.maxTotalSupplyMixin
    ? new MaxTotalSupplyMixin(
        addresses.maxTotalSupplyMixin,
        web3,
        activeNetwork
      )
    : null;

  const tokenGatedMixin = addresses.tokenGatingMixin
    ? new TokenGatedMixin(addresses.tokenGatingMixin, web3, activeNetwork)
    : null;

  const nativeTokenPriceMerkleMintModule =
    addresses.nativeTokenPriceMerkleMintModule
      ? new NativeTokenPriceMerkleMintModule(
          addresses.nativeTokenPriceMerkleMintModule,
          web3,
          activeNetwork
        )
      : null;

  // Precommit
  const allowancePrecommitModuleERC20 = addresses.AllowancePrecommitModuleERC20
    ? new AllowancePrecommitModuleERC20(
        addresses.AllowancePrecommitModuleERC20,
        web3,
        activeNetwork
      )
    : null;

  const erc20DealFactory = addresses.ERC20DealFactory
    ? new ERC20DealFactory(addresses.ERC20DealFactory, web3, activeNetwork)
    : null;

  // return all initialized contracts
  return {
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    clubERC20Factory,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    distributionsERC20,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    distributionsETH,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    policyMintERC20,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    clubERC20FactoryNative,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    erc20ClubFactory,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    mintPolicy,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    DepositTokenMintModule,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    SingleTokenMintModule,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    NativeMintModule,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    MerkleDistributorModule,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    MerkleDistributorModuleERC721,
    RugClaimModule,
    RugUtilityProperty,
    RugToken,
    GenesisNFTContract,
    rugBonusClaimModule,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    OwnerMintModule,
    depositExchangeMintModule,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    erc721Collective,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    erc721CollectiveFactory,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    ethPriceMintModule,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    fixedRenderer,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    guardMixinManager,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    maxPerMemberERC721,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    maxTotalSupplyERC721,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    timeRequirements,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    maxMemberCountMixin,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    maxTotalSupplyMixin,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    tokenGatedMixin,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    allowancePrecommitModuleERC20,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    nativeTokenPriceMerkleMintModule,
    // @ts-expect-error TS(2345): Argument of type [contract] | null not assign... Remove this comment to see the full error message
    erc20DealFactory
  };
};
