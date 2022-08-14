export enum EditRowIndex {
  Default,
  Image,
  Description,
  MintPrice,
  MaxPerWallet,
  Time,
  Transfer
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
    mediaCid: ''
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
