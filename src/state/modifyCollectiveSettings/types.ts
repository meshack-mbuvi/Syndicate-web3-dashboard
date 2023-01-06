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
  Remix,

  /* Shared */
  Time,
  CloseTimeWindow
}

export enum CollectiveCardType {
  TIME_WINDOW = 'TIME_WINDOW',
  MAX_TOTAL_SUPPLY = 'MAX_TOTAL_SUPPLY',
  OPEN_UNTIL_CLOSED = 'OPEN_UNTIL_CLOSED'
}
export interface ICollectiveSettings {
  isTransferable: boolean;
  isOpen: boolean;
  mintPrice: string;
  maxPerWallet: string;
  mintEndTime: string;
  maxSupply: number;
  metadataCid: string;
  openUntil: OpenUntil;
}

export interface IState {
  settings: ICollectiveSettings;
  updateEnded: boolean;
  activeRow: EditRowIndex;
}

export const initialState: IState = {
  settings: {
    isTransferable: true,
    isOpen: true,
    mintPrice: '',
    maxPerWallet: '',
    mintEndTime: '',
    maxSupply: 0,
    metadataCid: '',
    openUntil: OpenUntil.FUTURE_DATE
  },
  updateEnded: true,
  activeRow: EditRowIndex.Default
};
