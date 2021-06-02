export type Syndicate = {
  status: string;
  open: boolean;
  managerFeeAddress: string;
  depositsEnabled: boolean;
  depositMinMember: string;
  depositMaxMember: string;
  depositMaxTotal: string;
  profitShareToSyndicateProtocol: number;
  profitShareToSyndicateLead: number;
  depositTotal: string;
  closeDate: string;
  createdDate: string;
  allowlistEnabled: boolean;
  depositERC20Address: string;
  managerCurrent: string;
  managerPending: string;
  managerManagementFeeBasisPoints: number;
  numMembersMax: string;
  modifiable: boolean;
  tokenDecimals: number;
  depositERC20TokenSymbol: string;
  numMembersCurrent: string;
  syndicateProfitShareBasisPoints: string;
  managerPerformanceFeeBasisPoints: number;
  distributionsEnabled?: boolean;
  syndicateAddress?: string;
};
