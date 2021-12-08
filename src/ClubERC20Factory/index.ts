import { ISyndicateContracts } from "@/state/contracts";
import { ClubERC20Factory } from "./clubERC20Factory";
import { MintPolicyContract } from "./mintPolicy";
import { SingleTokenMintModuleContract } from "./singleTokenMintModule";
import { MerkleDistributorModuleContract } from "./merkleDistributorModule";

// Contract addresses for new contracts
const CLUB_ERC20_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_CLUB_ERC20_FACTORY;
const MINT_POLICY_ADDRESS = process.env.NEXT_PUBLIC_MINT_POLICY;
const SINGLE_TOKEN_MINT_MODULE =
  process.env.NEXT_PUBLIC_SINGLE_TOKEN_MINT_MODULE;
const MERKLE_DISTRIBUTOR_MODULE =
  process.env.NEXT_PUBLIC_MERKLE_DISTRIBUTOR_MODULE;

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

  // return all initialized contracts
  return {
    clubERC20Factory,
    mintPolicy,
    SingleTokenMintModule,
    MerkleDistributorModule,
  };
};
