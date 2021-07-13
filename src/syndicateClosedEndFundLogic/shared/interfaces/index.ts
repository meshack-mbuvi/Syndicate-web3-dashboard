export interface SyndicateMemberInfo {
  memberDeposit: string;
  DistributionClaimed: string;
  memberAddressAllowed: boolean;
}

export interface CreateSyndicateData {
  managerManagementFeeBasisPoints: string;
  managerDistributionShareBasisPoints: string;
  syndicateDistributionShareBasisPoints: string;
  numMembersMax: string | bigint;
  depositERC20Address: string;
  depositMemberMin: string;
  depositMemberMax: string;
  depositTotalMax: string;
  dateCloseUnixTime: string | number;
  allowlistEnabled: boolean;
  modifiable: boolean;
  transferable: boolean;
}

export interface SyndicateValues {
  syndicateAddress: string;
  allowlistEnabled: boolean;
  dateClose: string;
  dateCreated: string;
  depositERC20Address: string;
  depositMemberMax: string;
  depositTotalMax: string;
  depositMemberMin: string;
  depositTotal: string;
  distributing: boolean;
  managerCurrent: string;
  managerFeeAddress: string;
  managerManagementFeeBasisPoints: string;
  managerPending: string;
  managerDistributionShareBasisPoints: string;
  modifiable: boolean;
  numMembersCurrent: string;
  numMembersMax: string;
  open: boolean;
  syndicateDistributionShareBasisPoints: string;
  transferable: boolean;
}
