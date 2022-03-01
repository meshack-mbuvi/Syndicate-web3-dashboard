import { ISyndicateContracts } from "@/state/contracts";
import Web3 from "web3";

import { ClubERC20Contract } from "./clubERC20";
import { ClubERC20Factory } from "./clubERC20Factory";
import { ClubERC20FactoryEth } from "./clubERC20FactoryEth";
import { DepositTokenMintModuleContract } from "./depositTokenMintModule";
import { ERC721Contract } from "./ERC721Membership";
import { EthMintModuleContract } from "./ethMintModule";
import { MerkleDistributorModuleContract } from "./merkleDistributorModule";
import { MerkleDistributorModuleERC721Contract } from "./merkleDistributorModuleERC721";
import { ERC721MintPolicyContract } from "./mintPolicyERC721";
import { MintPolicyContract } from "./policyMintERC20";
import { PublicMintWithFeeModuleContract } from "./publicMintWithFeeModule";
import { PublicOnePerAddressModuleContract } from "./publicOnePerAddressModule";
import { RugBonusTokenModule } from "./RugRadio/RugBonusTokenModule";
import { RugERC20ClaimModule } from "./RugRadio/RugERC20ClaimModule";
import { RugUtilityProperties } from "./RugRadio/RugUtilityProperties";
import { RugUtilityMintModuleContract } from "./rugUtilityMintModule";

const CONTRACT_ADDRESSES = Object.freeze({
  // Ethereum Mainnet
  1: {
    clubERC20Factory: "0x01C0E2E70336EDB2C1459960AD16AB3D27508699",
    clubERC20FactoryEth: "0x2372fd8d69da29b4b328b518c6d7e84f3aa25dc3",
    DepositTokenMintModule: "0x9cAf7337F9fe05469FaaA3b388C479C6E8393276",
    ERC721MintPolicy: "0x543B8a295a485b50bA0db1D686Ab806656D7D542",
    EthMintModule: "0x960fd5cfa6c36e9db131824ddf07df6322a053de",
    MerkleDistributorModule: "0x90543E032A7c8db9087Ab30F2a04929592700134",
    MerkleDistributorModuleERC721: "0xCaeE041fFa50165ba009EF2d7b00C1D2b0874a44",
    mintPolicy: "0x1CC6E7eD55538F77E13C057E9521de5D2f3000dd",
    policyMintERC20: "0x543B8a295a485b50bA0db1D686Ab806656D7D542",
    PublicOnePerAddress: "0x4eD3fEDAaaBE0Da0D4a772A2210D0BfE5e475f91",
    SingleTokenMintModule: "0x0449F65a5e09F0f30Aa504B8474D1D4d0e10B8B8",
    UtilityMintModule: "0x56b8A2A1e7F37C5E66daF14DB28D1dc38e176Fb8",
  },
  // Rinkeby
  4: {
    clubERC20Factory: "0xBaE7eaA8317B3652dad3886caF454Da0706F53Ca",
    clubERC20FactoryEth: "0x04A8A99C80cC19E7a56342Fef2d8DAC6cd5f8dD4",
    DepositTokenMintModule: "0x9cAf7337F9fe05469FaaA3b388C479C6E8393276",
    ERC721MintPolicy: "0xbBca348239b6D620D0F9c21C1b641f36f62988D6",
    EthMintModule: "0x15780803d56d0f574B9DB6f46c5dBA692c646ab6",
    MerkleDistributorModule: "0x72B7817075AC3263783296f33c8F053e848594a3",
    MerkleDistributorModuleERC721: "0xeC85E73048aaaBB2d7dD99f605E56E6Dc5A2a67B",
    mintPolicy: "0x00C327dBd884662080A8eD3FD84f0e9bc39ccbF4",
    policyMintERC20: "0x36d367884b5088465C0Ea2EaF52224a922DC71E6",
    PublicOnePerAddress: "0xce6E260226639F1dD446dc19F21bd66cbE613d0D",
    SingleTokenMintModule: "0x7f450D0B82f4785881736bcd7635bbDd0cbA7648",
    UtilityMintModule: "0xD193Cfbc267f23127E024A025233A8483b29C66e",
  },
  // Matic
  137: {
    clubERC20Factory: "0x3902AB762a94b8088b71eE5c84bC3C7d2075646B",
    DepositTokenMintModule: "0xa052E325e112A5a6DfF7F4115B2f6DAA15eDa2F3",
    ERC721Membership: "0x43A23837a14F3FafB7cb6e4924586C970108c9Be",
    ERC721MintPolicy: "0xf9b79c55865EdD9ECed42b9C49312b5E03230d5D",
    MerkleDistributorModule: "0xc0e779A917EFED7D6dB8D03b79915968651c6ce4",
    MerkleDistributorModuleERC721: "0x1D73B78249363c6B5Cb6A0AdD6a1Cf21D5390eF2",
    policyMintERC20: "0x945B46289483aB88ACE4E41646eEC12B3B702dda",
    PublicOnePerAddress: "0x0E580f047a6553ec066fedA7D5DA6CbB327D670b",
  },
});

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
): Promise<ISyndicateContracts> => {
  // Retrieve contract from cache.
  const addresses = CONTRACT_ADDRESSES[await web3.eth.getChainId()];
  if (!addresses) {
    throw new Error("No chainz");
  }
  // if not contracts from cache or cache expired then continue
  // with initialization.
  // initialize contracts here
  const clubERC20Factory = new ClubERC20Factory(
    addresses.clubERC20Factory,
    web3,
  );
  const policyMintERC20 = new MintPolicyContract(
    addresses.policyMintERC20,
    web3,
  );

  const clubERC20FactoryEth = new ClubERC20FactoryEth(
    addresses.clubERC20FactoryEth,
    web3,
  );
  const mintPolicy = new MintPolicyContract(addresses.mintPolicy, web3);

  const DepositTokenMintModule = new DepositTokenMintModuleContract(
    addresses.DepositTokenMintModule,
    web3,
  );

  const SingleTokenMintModule = new DepositTokenMintModuleContract(
    addresses.SingleTokenMintModule,
    web3,
  );

  const EthMintModule = new EthMintModuleContract(
    addresses.EthMintModule,
    web3,
  );

  const MerkleDistributorModule = new MerkleDistributorModuleContract(
    addresses.MerkleDistributorModule,
    web3,
  );

  const MerkleDistributorModuleERC721 =
    new MerkleDistributorModuleERC721Contract(
      addresses.MerkleDistributorModuleERC721,
      web3,
    );

  const PublicOnePerAddressModule = new PublicOnePerAddressModuleContract(
    addresses.PublicOnePerAddressModule,
    web3,
  );

  const mintPolicyERC721 = new ERC721MintPolicyContract(
    addresses.ERC721MintPolicy,
    web3,
  );

  const PublicMintWithFeeModule = new PublicMintWithFeeModuleContract(
    addresses.publicUtility,
    web3,
  );

  const RugUtilityMintModule = new RugUtilityMintModuleContract(
    PUBLIC_RUG_UTILITY_MINT_MODULE,
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

  const rugBonusClaimModule = new RugBonusTokenModule(
    RUG_BONUS_CLAIM_MODULE,
    RUG_TOKEN,
    GENESIS_NFT,
    RUG_PROPERTIES,
    web3,
  );

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
    rugBonusClaimModule,
  };
};
