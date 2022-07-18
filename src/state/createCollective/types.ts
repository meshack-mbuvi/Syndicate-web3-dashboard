import { NFTMediaType } from '@/components/collectives/nftPreviewer';
import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
import { TimeWindow } from '@/components/collectives/create/inputs/timeWindow';
import { MembershipType } from '@/components/collectives/create/customize';
export interface CollectiveCreation {
  name: string;
  symbol: string;
  artwork: any;
  artworkUrl: string;
  artworkType: NFTMediaType;
  description: string;
  pricePerNFT: number;
  maxPerWallet: number;
  membershipType: MembershipType;
  openUntil: OpenUntil;
  timeWindow: TimeWindow;
  closeDate: Date;
  closeTime: string;
  closeAfterMaxSupply: boolean;
  maxSupply: number;
  transferrable: boolean;
  tokenDetails: { symbol: string; icon: string };
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
  membershipType: MembershipType.OPEN,
  openUntil: OpenUntil.FUTURE_DATE,
  timeWindow: TimeWindow.DAY,
  closeDate: new Date(),
  closeTime: '23:59',
  closeAfterMaxSupply: false,
  maxSupply: 0,
  transferrable: false,
  tokenDetails: { symbol: '', icon: '' },
  creationStatus: {
    transactionHash: '',
    creationReceipt: {
      token: ''
    }
  }
};
