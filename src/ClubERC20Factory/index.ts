import { ISyndicateContracts } from "@/state/contracts";
import { ClubERC20Factory } from "./clubERC20Factory";
import { MerkleDistributorModuleContract } from "./merkleDistributorModule";
import { MerkleDistributorModuleERC721Contract } from "./merkleDistributorModuleERC721";
import { MintPolicyContract } from "./mintPolicy";
import { ERC721MintPolicyContract } from "./mintPolicyERC721";
import { publicMintWithFeeModuleContract } from "./publicMintWithFeeModule";
import { PublicOnePerAddressModuleContract } from "./publicOnePerAddressModule";
import { RugUtilityMintModuleContract } from "./rugUtilityMintModule";
import { SingleTokenMintModuleContract } from "./singleTokenMintModule";

// Contract addresses for new contracts
const CLUB_ERC20_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CLUB_ERC20_FACTORY;
const MINT_POLICY_ADDRESS = process.env.NEXT_PUBLIC_MINT_POLICY;
const SINGLE_TOKEN_MINT_MODULE =
  process.env.NEXT_PUBLIC_SINGLE_TOKEN_MINT_MODULE;
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
  const mintPolicy = new MintPolicyContract(MINT_POLICY_ADDRESS, web3);

  const SingleTokenMintModule = new SingleTokenMintModuleContract(
    SINGLE_TOKEN_MINT_MODULE,
    web3,
  );

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

  // return all initialized contracts
  return {
    clubERC20Factory,
    mintPolicy,
    SingleTokenMintModule,
    MerkleDistributorModule,
    MerkleDistributorModuleERC721,
    PublicOnePerAddressModule,
    mintPolicyERC721,
    RugUtilityMintModule,
    PublicMintWithFeeModule,
  };
};
