export interface syndicateInterface {
  open: boolean;
  syndicateAddress?: string;
  allowlistEnabled: boolean;
  closeDate: string;
  createdDate: string;
  depositERC20Address: string;
  depositMemberMax: string;
  depositTotalMax: string;
  depositMemberMin: string;
  depositTotal: string;
  depositsEnabled: boolean;
  depositExceedTotal: boolean;
  distributing?: boolean;
  managerCurrent: string;
  managerFeeAddress: string;
  managerManagementFeeBasisPoints: string | number;
  managerPending: string;
  managerDistributionShareBasisPoints: string | number;
  modifiable: boolean;
  numMembersCurrent: string;
  numMembersMax: string;
  syndicateDistributionShareBasisPoints: string;
  version: string;
  tokenDecimals?: number;
  distributionShareToSyndicateProtocol?: number;
  distributionShareToSyndicateLead?: string | number;
  active?: boolean;
  depositERC20TokenSymbol: string;
}
