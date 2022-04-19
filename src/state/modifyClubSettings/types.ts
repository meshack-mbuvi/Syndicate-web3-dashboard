export interface InitialState {
  existingIsOpenToDeposits: boolean;
  existingOpenToDepositsUntil: Date;
  existingAmountRaised: number;
  existingMaxAmountRaising: number;
  existingMaxNumberOfMembers: number;
  existingNumberOfMembers: number;
}

export const initialState = {
  // original amounts
  existingIsOpenToDeposits: true,
  existingOpenToDepositsUntil: new Date(0),
  existingAmountRaised: 0,
  existingMaxAmountRaising: 0,
  existingMaxNumberOfMembers: 0,
  existingNumberOfMembers: 0
};
