import { Deal, StatusType } from '../data-fetching/thegraph/generated-types';

/**
 * Note: When you get an error that type for PrecommitStatus is incompatible
 * with StatusType, cast PrecommitStatus to PrecommitStatus.
 * e.g.: status = PrecommitStatus.NONE as PrecommitStatus.
 */
export enum PrecommitStatus {
  CANCELED = 'CANCELED',
  EXECUTED = 'EXECUTED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  NONE = 'NONE'
}

export enum DealStatus {
  OPEN = 'Open to commitments',
  CLOSED = 'Commitments closed',
  DISSOLVED = 'Deal dissolved',
  EXECUTED = 'Deal executed'
}

export enum ParticipantStatus {
  PENDING = 'PENDING',
  ACTION_REQUIRED = 'ACTION_REQUIRED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CUSTOM = 'CUSTOM'
}

export type Precommit = {
  id: string;
  userAddress: string;
  amount: string;
  status: StatusType;
  createdAt: string;
  deal: Partial<Deal>;
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
