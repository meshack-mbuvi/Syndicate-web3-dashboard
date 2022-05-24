export type mintEndTime = {
  mintTime: string;
  value: number;
};

export type tokenDetails = {
  depositToken: string;
  depositTokenSymbol: string;
  depositTokenLogo: any;
  depositTokenName: string;
  depositTokenDecimals: number;
};

export interface InitialState {
  investmentClubName: string;
  investmentClubSymbol: string;
  investmentClubSymbolPlaceHolder: string;
  tokenCap: string;
  mintEndTime: mintEndTime;
  mintSpecificEndTime: string;
  membersCount: string;
  clubCreationStatus: {
    transactionHash: string;
    creationReceipt:
      | {
          token: string;
        }
      | any;
  };
  tokenDetails: {
    depositToken: string;
    depositTokenSymbol: string;
    depositTokenLogo: any;
    depositTokenName: string;
    depositTokenDecimals: number;
  };
}

export const initialState: InitialState = {
  investmentClubName: '',
  investmentClubSymbol: '',
  investmentClubSymbolPlaceHolder: '', // Don't send this to backend. use investmentClubSymbol above
  tokenCap: '', // How much are you raising?
  mintEndTime: {
    mintTime: '',
    value: parseInt(
      (new Date(new Date().setHours(23, 59, 0, 0)).getTime() / 1000).toString()
    )
  }, // How long will deposits be accepted?
  mintSpecificEndTime: '23:59',
  membersCount: '', // How many members can join?
  clubCreationStatus: {
    transactionHash: '',
    creationReceipt: {
      token: ''
    }
  },
  tokenDetails: {
    depositToken: '',
    depositTokenSymbol: '',
    depositTokenLogo: '',
    depositTokenName: '',
    depositTokenDecimals: 0
  }
};
