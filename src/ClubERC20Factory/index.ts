import { ISyndicateContracts } from '@/state/contracts';
import { ClubERC20Contract } from './clubERC20';
import { ClubERC20Factory } from './clubERC20Factory';
import { ClubERC20FactoryNative } from './clubERC20FactoryNative';
import { DepositTokenMintModuleContract } from './depositTokenMintModule';
import { ERC721Contract } from './ERC721Membership';
import { NativeMintModuleContract } from './nativeMintModule';
import { MerkleDistributorModuleContract } from './merkleDistributorModule';
import { MerkleDistributorModuleERC721Contract } from './merkleDistributorModuleERC721';
import { ERC721MintPolicyContract } from './mintPolicyERC721';
import { OwnerMintModuleContract } from './ownerMintModule';
import { MintPolicyContract } from './policyMintERC20';
import { PublicMintWithFeeModuleContract } from './publicMintWithFeeModule';
import { PublicOnePerAddressModuleContract } from './publicOnePerAddressModule';
import { RugBonusTokenModule } from './RugRadio/RugBonusTokenModule';
import { RugERC20ClaimModule } from './RugRadio/RugERC20ClaimModule';
import { RugUtilityProperties } from './RugRadio/RugUtilityProperties';
import { RugUtilityMintModuleContract } from './rugUtilityMintModule';
import { CONTRACT_ADDRESSES } from '@/Networks';

// Contract addresses for Rug Radio
const PUBLIC_RUG_UTILITY_MINT_MODULE =
  process.env.NEXT_PUBLIC_UTILITY_MINT_MODULE;
const RUG_TOKEN = process.env.NEXT_PUBLIC_RUG_TOKEN;
const GENESIS_NFT = process.env.NEXT_PUBLIC_GenesisNFT;
const RUG_PROPERTIES = process.env.NEXT_PUBLIC_PROPERTIES;
const RUG_CLAIM_MODULE = process.env.NEXT_PUBLIC_RUG_CLAIM_MODULE;
const RUG_BONUS_CLAIM_MODULE = process.env.NEXT_PUBLIC_RUG_BONUS;

export const getSyndicateContracts = async (
  web3: Web3,
  activeNetwork
): Promise<ISyndicateContracts> => {
  // Retrieve contract from cache.
  const addresses = CONTRACT_ADDRESSES[activeNetwork.chainId];

  if (!addresses) {
    throw new Error('No chainz');
  }
  // if not contracts from cache or cache expired then continue
  // with initialization.
  // initialize contracts here
  const clubERC20Factory = new ClubERC20Factory(
    addresses.clubERC20Factory,
    web3
  );
  const policyMintERC20 = new MintPolicyContract(
    addresses.policyMintERC20,
    web3
  );

  const clubERC20FactoryNative = new ClubERC20FactoryNative(
    addresses.clubERC20FactoryNative,
    web3
  );
  const mintPolicy = new MintPolicyContract(addresses.mintPolicy, web3);

  const DepositTokenMintModule = new DepositTokenMintModuleContract(
    addresses.DepositTokenMintModule,
    web3
  );

  const SingleTokenMintModule = new DepositTokenMintModuleContract(
    addresses.SingleTokenMintModule,
    web3
  );

  const NativeMintModule = new NativeMintModuleContract(
    addresses.NativeMintModule,
    web3
  );

  const MerkleDistributorModule = new MerkleDistributorModuleContract(
    addresses.MerkleDistributorModule,
    web3
  );

  const MerkleDistributorModuleERC721 =
    new MerkleDistributorModuleERC721Contract(
      addresses.MerkleDistributorModuleERC721,
      web3
    );

  const PublicOnePerAddressModule = new PublicOnePerAddressModuleContract(
    addresses.PublicOnePerAddressModule,
    web3
  );

  const mintPolicyERC721 = new ERC721MintPolicyContract(
    addresses.ERC721MintPolicy,
    web3
  );

  const PublicMintWithFeeModule = new PublicMintWithFeeModuleContract(
    addresses.publicUtility,
    web3
  );

  const OwnerMintModule = new OwnerMintModuleContract(
    addresses.OwnerMintModule,
    web3
  );

  const RugUtilityMintModule = new RugUtilityMintModuleContract(
    PUBLIC_RUG_UTILITY_MINT_MODULE,
    web3
  );

  const RugClaimModule = new RugERC20ClaimModule(
    RUG_CLAIM_MODULE,
    RUG_TOKEN,
    GENESIS_NFT,
    RUG_PROPERTIES,
    web3
  );

  const RugUtilityProperty = new RugUtilityProperties(RUG_PROPERTIES, web3);

  const RugToken = new ClubERC20Contract(RUG_TOKEN, web3);

  const GenesisNFTContract = new ERC721Contract(GENESIS_NFT, web3);

  const rugBonusClaimModule = new RugBonusTokenModule(
    RUG_BONUS_CLAIM_MODULE,
    RUG_TOKEN,
    GENESIS_NFT,
    RUG_PROPERTIES,
    web3
  );

  // return all initialized contracts
  return {
    clubERC20Factory,
    policyMintERC20,
    clubERC20FactoryNative,
    mintPolicy,
    DepositTokenMintModule,
    SingleTokenMintModule,
    NativeMintModule,
    MerkleDistributorModule,
    MerkleDistributorModuleERC721,
    PublicOnePerAddressModule,
    mintPolicyERC721,
    RugUtilityMintModule,
    PublicMintWithFeeModule,
    RugClaimModule,
    RugUtilityProperty,
    RugToken,
    GenesisNFTContract,
    rugBonusClaimModule,
    OwnerMintModule
  };
};
