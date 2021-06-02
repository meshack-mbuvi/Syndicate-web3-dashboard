export interface syndicateInterface {
  open: boolean;
  syndicateAddress?: string;
  allowlistEnabled: boolean;
  closeDate: string;
  createdDate: string;
  depositERC20Address: string;
  depositMaxMember: string;
  depositMaxTotal: string;
  depositMinMember: string;
  depositTotal: string;
  depositsEnabled: boolean;
  distributionsEnabled?: boolean;
  managerCurrent: string;
  managerFeeAddress: string;
  managerManagementFeeBasisPoints: string | number;
  managerPending: string;
  managerPerformanceFeeBasisPoints: string | number;
  modifiable: boolean;
  numMembersCurrent: string;
  numMembersMax: string;
  syndicateProfitShareBasisPoints: string;
  version: string;
  tokenDecimals?: number;
  profitShareToSyndicateProtocol?: number;
  profitShareToSyndicateLead?: string | number;
  active?: boolean;
  depositERC20TokenSymbol: string;
}
