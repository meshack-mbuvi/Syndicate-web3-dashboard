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
  fileName: string;
  progressPercent: number;
  description: string;
  pricePerNFT: number;
  maxPerWallet: number;
  membershipType: MembershipType;
  openUntil: OpenUntil;
  timeWindow: TimeWindow;
  closeDate: Date;
  closeTime: string;
  EpochCloseTime: number;
  closeAfterMaxSupply: boolean;
  maxSupply: number;
  transferrable: boolean;
  tokenDetails: { symbol: string; icon: string };
  creationStatus: {
    submittingToIPFS: boolean;
    ipfsError: boolean;
    waitingForConfirmation: boolean;
    confirmed: boolean;
    transactionSuccess: boolean;
    transactionError: boolean;
    transactionHash: string;
    ipfsHash: string;
    creationReceipt: {
      collective: string;
      name: string;
      symbol: string;
    };
  };
}

export const initialState: CollectiveCreation = {
  name: '',
  symbol: '',
  artwork: {},
  artworkUrl: '',
  artworkType: NFTMediaType.IMAGE,
  fileName: '',
  progressPercent: 0,
  description: '',
  pricePerNFT: NaN,
  maxPerWallet: 0,
  membershipType: MembershipType.OPEN,
  openUntil: OpenUntil.FUTURE_DATE,
  timeWindow: TimeWindow.DAY,
  closeDate: new Date(new Date().getTime() + 60 * 60 * 24 * 1000), // 1 day from now
  closeTime: '23:59',
  EpochCloseTime: ~~(
    new Date(new Date().getTime() + 60 * 60 * 24 * 1000).getTime() / 1000
  ),
  closeAfterMaxSupply: false,
  maxSupply: 0,
  transferrable: false,
  tokenDetails: { symbol: '', icon: '' },
  creationStatus: {
    submittingToIPFS: false,
    ipfsError: false,
    waitingForConfirmation: false,
    confirmed: false,
    transactionSuccess: false,
    transactionError: false,
    transactionHash: '',
    ipfsHash: '',
    creationReceipt: {
      collective: '',
      name: '',
      symbol: ''
    }
  }
};
