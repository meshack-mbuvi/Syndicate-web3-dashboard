import { CollectiveActivityType } from '@/components/collectives/activity';
import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';

export enum EditRowIndex {
  Default,
  ImageDescriptionGroup,
  MintPrice,
  MaxPerWallet,
  OpenUntil,
  Transfer,

  /* Club Settings */
  TotalSupply,
  MaxMembers,
  TokenGate,

  /* Shared */
  Time,
  CloseTimeWindow
}

export enum CollectiveCardType {
  TIME_WINDOW = 'TIME_WINDOW',
  MAX_TOTAL_SUPPLY = 'MAX_TOTAL_SUPPLY',
  OPEN_UNTIL_CLOSED = 'OPEN_UNTIL_CLOSED'
}

export interface Event {
  activityType: CollectiveActivityType;
  profile: {
    address: string;
  };
  timeStamp: string;
}

export interface ICollectiveDetails {
  collectiveName: string;
  ownerAddress: string;
  collectiveSymbol: string;
  collectiveAddress: string;
  maxPerWallet: string;
  maxTotalSupply: string;
  totalSupply: string;
  createdAt: any;
  numOwners: string;
  owners: any;
  mintPrice: string;
  isTransferable: boolean;
  mintEndTime: string;
  maxSupply: number;
  description: string;
  isOpen: boolean;
  metadataCid: string;
  mediaCid: string;
  collectiveCardType: CollectiveCardType;
}

export interface ICollectiveLoadingState {
  isFetchingCollective: boolean;
  collectiveNotFound: boolean;
}

export interface IState {
  details: ICollectiveDetails;
  settings: {
    isTransferable: boolean;
    isOpen: boolean;
    mintPrice: string;
    maxPerWallet: string;
    mintEndTime: string;
    maxSupply: number;
    openUntil: OpenUntil;
  };
  updateEnded: boolean;
  activeRow: EditRowIndex;
  loadingState: ICollectiveLoadingState;
  events: {
    loadingEvents: boolean;
    memberJoined: Event[];
  };
}

export const initialState: IState = {
  details: {
    collectiveName: '',
    ownerAddress: '',
    collectiveSymbol: '',
    collectiveAddress: '',
    maxPerWallet: '',
    maxTotalSupply: '',
    totalSupply: '',
    createdAt: '',
    numOwners: '',
    owners: [],
    mintPrice: '',
    isTransferable: true,
    mintEndTime: '',
    maxSupply: 0,
    metadataCid: '',
    description: '',
    isOpen: true,
    mediaCid: '',
    collectiveCardType: CollectiveCardType.OPEN_UNTIL_CLOSED
  },
  settings: {
    isTransferable: true,
    isOpen: true,
    mintPrice: '',
    maxPerWallet: '',
    mintEndTime: '',
    maxSupply: 0,
    openUntil: OpenUntil.FUTURE_DATE
  },
  updateEnded: true,
  activeRow: EditRowIndex.Default,
  loadingState: {
    isFetchingCollective: false,
    collectiveNotFound: false
  },
  events: {
    loadingEvents: false,
    memberJoined: []
  }
};
