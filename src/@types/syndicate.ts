export type Syndicate = {
  status: string;
  open: boolean;
  managerFeeAddress: string;
  depositsEnabled: boolean;
  depositMemberMin: string;
  depositMemberMax: string;
  depositTotalMax: string;
  distributionShareToSyndicateProtocol: number;
  distributionShareToSyndicateLead: number;
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
  depositERC20Logo: string;
  depositERC20Price: string;
  numMembersCurrent: string;
  syndicateDistributionShareBasisPoints: string;
  managerDistributionShareBasisPoints: number;
  distributing?: boolean;
  syndicateAddress?: string;
};
