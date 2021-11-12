export type mintEndTime = {
  mintTime: string;
  value: number;
};

export interface InitialState {
  investmentClubName: string;
  investmentClubSymbol: string;
  investmentClubSymbolPlaceHolder: string;
  tokenCap: string;
  mintEndTime: mintEndTime;
  membersCount: string;
  clubCreationStatus: {
    transactionHash: string;
    creationReceipt:
      | {
          token: string;
        }
      | any;
  };
}

export const initialState: InitialState = {
  investmentClubName: "",
  investmentClubSymbol: "",
  investmentClubSymbolPlaceHolder: "", // Don't send this to backend. use investmentClubSymbol above
  tokenCap: "", // How much are you raising?
  mintEndTime: {
    mintTime: "",
    value: parseInt((new Date(new Date().setHours(23, 59, 0, 0)).getTime() / 1000).toString()),
  }, // How long will deposits be accepted?
  membersCount: "", // How many members can join?
  clubCreationStatus: {
    transactionHash: "",
    creationReceipt: {
      token: "",
    },
  },
};
