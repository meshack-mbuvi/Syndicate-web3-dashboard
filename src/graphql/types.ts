import { ActiveModule } from '@/types/modules';
export interface SyndicateDAO {
  contractAddress: string;
  ownerAddress: string;
  createdAt: string;
  totalSupply: string;
  totalDeposits: string;
  maxTotalSupply: string;
  endTime: string;
  startTime: string;
  maxMemberCount: string;
  activeModules: ActiveModule[];
}
export interface SingleClubData {
  syndicateDAOs: SyndicateDAO[];
}

export interface TokenHoldings {
  balance: number;
  token: {
    address: string;
    name?: string;
    symbol?: string;
    decimals?: number;
    logo?: string;
  };
}

export interface AccountHoldings {
  tokenHoldings: TokenHoldings[];
}
