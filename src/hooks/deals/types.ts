export type Deal = {
  id: string;
  closed: boolean;
  goal: string;
  totalCommitted: string;
  numCommits: string;
  depositToken: string;
  dealToken: {
    id: string;
    name: string;
  };
};

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

export type DealDetails = {
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

export type Precommit = {
  id: string;
  userAddress: string;
  amount: string;
  status: PrecommitStatus;
  createdAt: string;
  deal: {
    id: string;
  };
};

export type PrecommitsDeal = {
  id: string;
  status: PrecommitStatus;
  deal: {
    id: string;
    closed: boolean;
    numCommits: string;
    goal: string;
    totalCommitted: string;
    depositToken: string;
    dealToken: {
      id: string;
      name: string;
    };
  };
};

export interface DealPreview {
  dealName: string;
  status: 'OPEN' | 'CLOSED';
  goal: string;
  depositToken: string;
  totalCommitments: string;
  totalCommited: string;
}
