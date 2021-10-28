export interface InitialState {
  investmentClubName: string;
  investmentClubSymbol: string;
  tokenCap: string;
  mintEndTime: string;
  membersCount: number;
  
}

export const initialState: InitialState = {
  investmentClubName: "",
  investmentClubSymbol: "",
  tokenCap: "", // How much are you raising?
  mintEndTime: "", // How long will deposits be accepted?
  membersCount: 0, // How many members can join?
  
}
