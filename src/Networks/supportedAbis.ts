import depositTokenMintModule_ABI from '@/contracts/DepositTokenMintModule.json';
import nativeMintModule_ABI from '@/contracts/EthMintModule.json';
import ownerMintModule_ABI from '@/contracts/OwnerMintModule.json';
import ETH_PRICE_MINT_MODULE_ABI from '@/contracts/EthPriceMintModule.json';
import ERC721_COLLECTIVE_ABI from 'src/contracts/ERC721Collective.json';

interface SupportedAbi {
  abi: AbiItem[];
  description?: string;
  name?: string;
  type?: 'module' | 'other';
}

// TODO: [TYPES]: ABIITEM - https://github.com/web3/web3.js/issues/3310
export const SUPPORTED_ABIS: Readonly<{ [key: string]: SupportedAbi }> = {
  DepositTokenMintModule: {
    abi: depositTokenMintModule_ABI as AbiItem[],
    description:
      'Allows Club owners to accept any ERC-20 as the deposit token and mint club tokens in return using a fixed 1:1 ratio',
    name: '',
    type: 'module'
  },
  NativeMintModule: {
    abi: nativeMintModule_ABI as AbiItem[],
    description:
      'Allows Club owners to accept ETH as the deposit token and mint club tokens in return using a fixed 1:10000 ratio, i.e. 0.0001 ETH per club token.',
    name: 'EthMintModule',
    type: 'module'
  },
  ERC721Collective: {
    abi: ERC721_COLLECTIVE_ABI as AbiItem[],
    type: 'other'
  },
  OwnerMintModule: {
    abi: ownerMintModule_ABI as AbiItem[],
    description:
      'Allows Club owners to "airdrop" token(s) in the following ratios: one token to one recipient address, multiple tokens to one recipient, or one token each to multiple recipients.',
    name: '',
    type: 'module'
  },
  EthPriceMintModule: {
    abi: ETH_PRICE_MINT_MODULE_ABI as AbiItem[],
    description:
      'Allows anyone to "purchase" Collective NFTs in exchange for a given ETH price per NFT.',
    name: '',
    type: 'module'
  }
};
