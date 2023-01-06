export enum MixinModuleRequirementType {
  TIME_WINDOW = 'TIME_WINDOW',
  MIN_PER_MEMBER = 'MIN_PER_MEMBER'
}

export enum PrecommitStatus {
  CANCELED = 'CANCELED',
  EXECUTED = 'EXECUTED',
  FAILED = 'FAILED',
  PENDING = 'PENDING'
}

export enum DealStatus {
  OPEN = 'Open to commitments',
  CLOSED = 'Commitments closed',
  EXECUTED = 'Deal executed'
}

export type Precommit = {
  id: string;
  userAddress: string;
  amount: string;
  status: PrecommitStatus;
  createdAt: string;
  deal: Deal;
};

export type Deal = {
  id: string;
  ownerAddress: string;
  destinationAddress: string;
  closed: boolean;
  goal: string;
  depositToken: string;
  dealToken: {
    id: string;
    contractAddress: string;
    createdAt: string;
    name: string;
    symbol: string;
  };
  totalCommitted: string;
  numCommits: string;
  mixins: [
    {
      id: string;
      requirementType: MixinModuleRequirementType;
      minPerMember: string;
      startTime: string;
      endTime: string;
    }
  ];
};

export interface DealPreview {
  dealName: string;
  contractAddress: string;
  isOwner: boolean;
  status: DealStatus;
  goal: string;
  depositToken: string;
  totalCommitments: string;
  totalCommitted: string;
  dealSymbol: string;
  depositTokenSymbol: string;
  goalCompletionPercentage: number;
}
