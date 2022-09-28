import depositTokenMintModule_ABI from '@/contracts/DepositTokenMintModule.json';
import nativeMintModule_ABI from '@/contracts/EthMintModule.json';
import merkleDistributorModule_ABI from '@/contracts/MerkleDistributorModuleERC20.json';
import merkleDistributorModuleERC721_ABI from '@/contracts/MerkleDistributorModuleERC721.json';
import publicOnePerAddressModule_ABI from '@/contracts/PublicOnePerAddressModule.json';
import ownerMintModule_ABI from '@/contracts/OwnerMintModule.json';
import ETH_PRICE_MINT_MODULE_ABI from '@/contracts/EthPriceMintModule.json';

// TODO: [TYPES]: ABIITEM - https://github.com/web3/web3.js/issues/3310
export const SUPPORTED_ABIS: Readonly<{ [key: string]: AbiItem[] }> = {
  DepositTokenMintModule: depositTokenMintModule_ABI as AbiItem[],
  NativeMintModule: nativeMintModule_ABI as AbiItem[],
  MerkleDistributorModule: merkleDistributorModule_ABI as AbiItem[],
  MerkleDistributorModuleERC721: merkleDistributorModuleERC721_ABI as AbiItem[],
  PublicOnePerAddress: publicOnePerAddressModule_ABI as AbiItem[],
  SingleTokenMintModule: depositTokenMintModule_ABI as AbiItem[],
  OwnerMintModule: ownerMintModule_ABI as AbiItem[],
  EthPriceMintModule: ETH_PRICE_MINT_MODULE_ABI as AbiItem[]

  // OwnerMintModuleERC721/BatchMintModuleERC721 // only on mainnet assumes it is different from OwnerMintModule
  // PublicMintWithFeeModule // only on matic and different address on dev docs vs releases
  // RequiredTokensMintModule // not available yet
  // PermitMintModuleERC721 // not available yet

  // OnePerAddressMintModule: '', //currently assumes onePerAddress is unused / potential dupe of PublicOnePerAddress
  // UtilityMintModule: '', // currently assumes older modules will not be supported
};
