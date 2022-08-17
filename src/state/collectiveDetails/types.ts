export enum EditRowIndex {
  Default,
  Image,
  Description,
  MintPrice,
  MaxPerWallet,
  Time,
  Transfer
}

export enum CollectiveCardType {
  TIME_WINDOW = 'TIME_WINDOW',
  MAX_TOTAL_SUPPLY = 'MAX_TOTAL_SUPPLY',
  OPEN_UNTIL_CLOSED = 'OPEN_UNTIL_CLOSED'
}

export interface ICollectiveDetails {
  collectiveName: string;
  ownerAddress: string;
  collectiveSymbol: string;
  collectiveAddress: string;
  maxPerWallet: string;
  maxTotalSupply: string;
  totalSupply: string;
  createdAt: string;
  numMinted: string;
  numOwners: string;
  owners: any;
  mintPrice: string;
  isTransferable: boolean;
  mintEndTime: string;
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
  };
  activeRow: EditRowIndex;
  loadingState: ICollectiveLoadingState;
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
    numMinted: '',
    numOwners: '',
    owners: [],
    mintPrice: '',
    isTransferable: true,
    mintEndTime: '',
    metadataCid: '',
    description: '',
    isOpen: true,
    mediaCid: '',
    collectiveCardType: CollectiveCardType.OPEN_UNTIL_CLOSED
  },
  settings: {
    isTransferable: true,
    isOpen: true
  },
  activeRow: EditRowIndex.Default,
  loadingState: {
    isFetchingCollective: false,
    collectiveNotFound: false
  }
};
