export interface SyndicateMemberInfo {
  memberDeposit: string;
  memberClaimedDistribution: string;
  memberAddressAllowed: boolean;
}

export interface CreateSyndicateData {
  managerManagementFeeBasisPoints: string;
  managerPerformanceFeeBasisPoints: string;
  syndicateProfitShareBasisPoints: string;
  numMembersMax: string | bigint;
  depositERC20Address: string;
  depositMinMember: string;
  depositMaxMember: string;
  depositMaxTotal: string;
  dateCloseUnixTime: string | number;
  allowlistEnabled: boolean;
  modifiable: boolean;
  transferable: boolean;
}

export interface SyndicateValues {
  syndicateAddress: string;
  allowlistEnabled: boolean;
  dateClose: string;
  dateCreation: string;
  depositERC20Address: string;
  depositMaxMember: string;
  depositMaxTotal: string;
  depositMinMember: string;
  depositTotal: string;
  distributing: boolean;
  managerCurrent: string;
  managerFeeAddress: string;
  managerManagementFeeBasisPoints: string;
  managerPending: string;
  managerPerformanceFeeBasisPoints: string;
  modifiable: boolean;
  numMembersCurrent: string;
  numMembersMax: string;
  open: boolean;
  syndicateProfitShareBasisPoints: string;
  transferable: boolean;
}
