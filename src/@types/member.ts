export type Member = {
  memberAddress: string;
  memberDeposit: string;
  distributing: boolean;
  modifiable: boolean;
  open: boolean;
  memberAddressAllowed: boolean;
  allowlistEnabled: boolean;
  amountError?: string;
  addressError?: string;
  showInputField?: boolean;
  memberStake: string;
  depositERC20TokenSymbol: string;
  newMember?: boolean;
  newMemberDeposit?: string;
};
