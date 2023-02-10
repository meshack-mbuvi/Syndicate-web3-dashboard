import {
  Member,
  SyndicateDao
} from '@/hooks/data-fetching/thegraph/generated-types';

export type DynamicSyndicateDaoProperties = {
  depositAmount: string;
  ownershipShare?: number;
  depositERC20TokenSymbol: string;
  depositTokenLogo: string;
  membersCount: number;
  memberDeposits?: number;
  status: string;
  isOwner: boolean;
  members: {
    createdAt?: string;
    tokens: number;
    depositAmount: string;
    id?: string;
    member?: {
      id?: string;
      memberAddress: string;
    };
  }[];
};

/**
 * Re-defining 'member' field in DynamicSyndicateDaoProperties from syndicateDAO
 * since not all of its fields are needed in our queries, otherwise, the app
 * will complain of missing but required parameters in syndicateDAO type.
 */
export type CustomSyndicateDao = Omit<SyndicateDao, 'members'> &
  DynamicSyndicateDaoProperties;

export type CustomMember = Omit<Member, 'syndicateDAOs'> & {
  syndicateDAOs: CustomSyndicateDao[];
};

export interface IMemberResponse {
  syndicateDAOs: {
    depositAmount: string;
    syndicateDAO: Partial<CustomSyndicateDao>;
  }[];
}

export type clubMember = {
  depositAmount: string;
  memberAddress: string;
  clubTokens: number;
  ownershipShare: number;
  symbol: string;
  totalSupply?: number;
  ensName: string;
  avatar: string;
  createdAt: number;
};
