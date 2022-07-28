export interface ICollectiveDetails {
  collectiveName: string;
  collectiveSymbol: string;
  collectiveAddress: string;
  maxPerWallet: string;
  maxTotalSupply: string;
  totalSupply: string;
  numMinted: string;
  numOwners: string;
  mintPrice: string;
  isTransferable: boolean;
  mintEndTime: string;
  ipfsHash: string;
  description: string;
  isOpen: boolean;
}

export interface IState {
  details: ICollectiveDetails;
  settings: {
    isTransferable: boolean;
    isOpen: boolean;
  };
}
export const initialState: IState = {
  details: {
    collectiveName: '',
    collectiveSymbol: '',
    collectiveAddress: '',
    maxPerWallet: '',
    maxTotalSupply: '',
    totalSupply: '',
    numMinted: '',
    numOwners: '',
    mintPrice: '',
    isTransferable: true,
    mintEndTime: '',
    ipfsHash: '',
    description: '',
    isOpen: true
  },
  settings: {
    isTransferable: true,
    isOpen: true
  }
};
