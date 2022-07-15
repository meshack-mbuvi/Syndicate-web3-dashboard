import { NFTMediaType } from '@/components/collectives/nftPreviewer';
export interface CollectiveCreation {
  name: string;
  symbol: string;
  artwork: any;
  artworkUrl: string;
  artworkType: NFTMediaType;
  description: string;
  pricePerNFT: number;
  maxPerWallet: number;
  invitation: boolean; // allowlist, token gating, anyone with link.
  openUntil: string; // future date., maxMembers, manualClose
  closeDate: string;
  closeAfterMaxSupply: boolean;
  maxSupply: number;
  transferrable: boolean;
  creationStatus: {
    transactionHash: string;
    creationReceipt:
      | {
          token: string;
        }
      | any;
  };
}

export const initialState: CollectiveCreation = {
  name: '',
  symbol: '',
  artwork: {},
  artworkUrl: '',
  artworkType: NFTMediaType.IMAGE,
  description: '',
  pricePerNFT: 0,
  maxPerWallet: 0,
  invitation: false, // allowlist, token gating, anyone with link.
  openUntil: '', // future date., maxMembers, manualClose
  closeDate: '',
  closeAfterMaxSupply: false,
  maxSupply: 0,
  transferrable: false,
  creationStatus: {
    transactionHash: '',
    creationReceipt: {
      token: ''
    }
  }
};
