import { ISyndicateContracts } from "@/state/contracts";
import { ClubERC20Contract } from "./clubERC20";
import { ClubERC20Factory } from "./clubERC20Factory";
import { ClubERC20FactoryEth } from "./clubERC20FactoryEth";
import { DepositTokenMintModuleContract } from "./depositTokenMintModule";
import { ERC721Contract } from "./ERC721Membership";
import { MerkleDistributorModuleContract } from "./merkleDistributorModule";
import { MerkleDistributorModuleERC721Contract } from "./merkleDistributorModuleERC721";
import { ERC721MintPolicyContract } from "./mintPolicyERC721";
import { MintPolicyContract } from "./policyMintERC20";
import { publicMintWithFeeModuleContract } from "./publicMintWithFeeModule";
import { PublicOnePerAddressModuleContract } from "./publicOnePerAddressModule";
import { RugERC20ClaimModule } from "./RugRadio/RugERC20ClaimModule";
import { RugUtilityProperties } from "./RugRadio/RugUtilityProperties";
import { RugUtilityMintModuleContract } from "./rugUtilityMintModule";
import { EthMintModuleContract } from "./ethMintModule";

// Contract addresses for new contracts
const CLUB_ERC20_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CLUB_ERC20_FACTORY;
const POLICY_MINT_ERC20_ADDRESS = process.env.NEXT_PUBLIC_POLICY_MINT_ERC20;
const CLUB_ERC20_FACTORY_ETH_ADDRESS =
  process.env.NEXT_PUBLIC_CLUB_ERC20_ETH_FACTORY;
const MINT_POLICY_ADDRESS = process.env.NEXT_PUBLIC_MINT_POLICY;
const DEPOSIT_TOKEN_MINT_MODULE =
  process.env.NEXT_PUBLIC_DEPOSIT_TOKEN_MINT_MODULE;
const SINGLE_TOKEN_MINT_MODULE =
  process.env.NEXT_PUBLIC_SINGLE_TOKEN_MINT_MODULE;
const ETH_MINT_MODULE = process.env.NEXT_PUBLIC_ETH_MINT_MODULE;
const MERKLE_DISTRIBUTOR_MODULE =
  process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_MODULE;
const MERKLE_DISTRIBUTOR_MODULE_ERC721 =
  process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_MODULE_ERC721;
const PUBLIC_ONE_PER_ADDRESS_MODULE =
  process.env.NEXT_PUBLIC_ONE_PER_ADDRESS_MODULE;
const PUBLIC_ERC721_MINT_POLICY = process.env.NEXT_PUBLIC_ERC721_MINT_POLICY;
const PUBLIC_RUG_UTILITY_MINT_MODULE =
  process.env.NEXT_PUBLIC_RUG_UTILITY_MINT_MODULE;
const PUBLIC_UTILITY_MINT_MODULE = process.env.NEXT_PUBLIC_UTILITY_MINT_MODULE;

// Contract addresses for Rug Radio
const RUG_TOKEN = process.env.NEXT_PUBLIC_RUG_TOKEN;
const GENESIS_NFT = process.env.NEXT_PUBLIC_GenesisNFT;
const RUG_PROPERTIES = process.env.NEXT_PUBLIC_PROPERTIES;
const RUG_CLAIM_MODULE = process.env.NEXT_PUBLIC_RUG_CLAIM_MODULE;

export const getSyndicateContracts = async (
  web3: Web3,
): Promise<ISyndicateContracts> => {
  // Retrieve contract from cache.
  // if not contracts from cache or cache expired then continue
  // with initialization.
  // initialize contracts here
  const clubERC20Factory = new ClubERC20Factory(
    CLUB_ERC20_FACTORY_ADDRESS,
    web3,
  );
  const policyMintERC20 = new MintPolicyContract(
    POLICY_MINT_ERC20_ADDRESS,
    web3,
  );
  const clubERC20FactoryEth = new ClubERC20FactoryEth(
    CLUB_ERC20_FACTORY_ETH_ADDRESS,
    web3,
  );
  const mintPolicy = new MintPolicyContract(MINT_POLICY_ADDRESS, web3);

  const DepositTokenMintModule = new DepositTokenMintModuleContract(
    DEPOSIT_TOKEN_MINT_MODULE,
    web3,
  );

  const SingleTokenMintModule = new DepositTokenMintModuleContract(
    SINGLE_TOKEN_MINT_MODULE,
    web3,
  );

  const EthMintModule = new EthMintModuleContract(ETH_MINT_MODULE, web3);

  const MerkleDistributorModule = new MerkleDistributorModuleContract(
    MERKLE_DISTRIBUTOR_MODULE,
    web3,
  );

  const MerkleDistributorModuleERC721 =
    new MerkleDistributorModuleERC721Contract(
      MERKLE_DISTRIBUTOR_MODULE_ERC721,
      web3,
    );

  const PublicOnePerAddressModule = new PublicOnePerAddressModuleContract(
    PUBLIC_ONE_PER_ADDRESS_MODULE,
    web3,
  );

  const mintPolicyERC721 = new ERC721MintPolicyContract(
    PUBLIC_ERC721_MINT_POLICY,
    web3,
  );

  const RugUtilityMintModule = new RugUtilityMintModuleContract(
    PUBLIC_RUG_UTILITY_MINT_MODULE,
    web3,
  );

  const PublicMintWithFeeModule = new publicMintWithFeeModuleContract(
    PUBLIC_UTILITY_MINT_MODULE,
    web3,
  );

  const RugClaimModule = new RugERC20ClaimModule(
    RUG_CLAIM_MODULE,
    RUG_TOKEN,
    GENESIS_NFT,
    RUG_PROPERTIES,
    web3,
  );

  const RugUtilityProperty = new RugUtilityProperties(RUG_PROPERTIES, web3);

  const RugToken = new ClubERC20Contract(RUG_TOKEN, web3);

  const GenesisNFTContract = new ERC721Contract(GENESIS_NFT, web3);

  // return all initialized contracts
  return {
    clubERC20Factory,
    policyMintERC20,
    clubERC20FactoryEth,
    mintPolicy,
    DepositTokenMintModule,
    SingleTokenMintModule,
    EthMintModule,
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
  };
};
