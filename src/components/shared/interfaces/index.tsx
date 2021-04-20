export interface syndicateProps {
  currentManager: string;
  depositERC20ContractAddress: string;
  distributionsEnabled: boolean;
  managerFeeAddress: string;
  managerManagementFeeBasisPoints: string;
  managerPerformanceFeeBasisPoints: string;
  maxDeposit: string;
  maxTotalDeposits: string;
  modifiable: boolean;
  pendingManager: string;
  syndicateOpen: boolean;
  syndicateProfitShareBasisPoints: string;
  totalDeposits: string;
  allowlistEnabled: boolean;
  closeDate: string;
  creationDate: string;
}
