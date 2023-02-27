export interface InitialState {
  existingIsOpenToDeposits: boolean;
  existingOpenToDepositsUntil: Date;
  existingAmountRaised: number;
  existingMaxAmountRaising: string;
  existingMaxNumberOfMembers: number;
  existingNumberOfMembers: number;
  maxNumberOfMembers: number;
  maxAmountRaising: string;
  openToDepositsUntil: Date;
}

export const initialState = {
  // original amounts
  existingIsOpenToDeposits: true,
  existingOpenToDepositsUntil: new Date(0),
  existingAmountRaised: 0,
  existingMaxAmountRaising: '0',
  existingMaxNumberOfMembers: 0,
  existingNumberOfMembers: 0,
  maxNumberOfMembers: 0,
  maxAmountRaising: '0',
  openToDepositsUntil: new Date(0)
};
