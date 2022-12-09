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

export type DealDetails = {
  id: string;
  destinationAddress: string;
  depositToken: string;
  ownerAddress: string;
  closed: boolean;
  goal: string;
  dealToken: {
    name: string;
    contractAddress: string;
    createdAt: string;
  };
  totalCommitted: string;
  numCommits: string;
};

export type Precommit = {
  id: string;
  userAddress: string;
  amount: string;
  status: string;
  createdAt: string;
  deal: {
    id: string;
  };
};

export type PrecommitsDeal = {
  id: string;
  status: 'CANCELED' | 'EXECUTED' | 'FAILED' | 'PENDING';
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
