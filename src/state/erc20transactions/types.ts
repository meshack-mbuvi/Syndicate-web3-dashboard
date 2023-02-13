import {
  Maybe,
  TransactionAnnotation,
  TransactionCategory as Category
} from '@/hooks/data-fetching/backend/generated-types';

/**
 * NOTE: Had to use Pascal case since the category from generated types is using
 * this case. Been unable to merge the two enums without getting errors
 *
 */
export enum TransactionCategory {
  SELECT_CATEGORY = 'SELECT_CATEGORY',
  TOKEN = 'TOKEN',
  COLLECTIBLE = 'COLLECTIBLE',
  OFF_CHAIN_INVESTMENT = 'OFF_CHAIN_INVESTMENT',
  Deposit = 'DEPOSIT',
  DepositReturned = 'DEPOSIT_RETURNED',
  DepositToken = 'DEPOSIT_TOKEN',
  DepositWithdrawal = 'DEPOSIT_WITHDRAWAL',
  Distribution = 'DISTRIBUTION',
  DistributionWithdrawal = 'DISTRIBUTION_WITHDRAWAL',
  Expense = 'EXPENSE',
  Investment = 'INVESTMENT',
  InvestmentToken = 'INVESTMENT_TOKEN',
  MemberDistributed = 'MEMBER_DISTRIBUTED',
  MemberMinted = 'MEMBER_MINTED',
  Other = 'OTHER',
  TokenDistribution = 'TOKEN_DISTRIBUTION',
  Uncategorized = 'UNCATEGORIZED'
}

export enum RoundCategory {
  PRE_SEED,
  SEED,
  SERIES_A,
  SERIES_B,
  SERIES_C,
  SERIES_D,
  SERIES_E,
  PUBLIC,
  ICO,
  OTHER
}

export interface CurrentTransaction {
  category?: Maybe<TransactionCategory>;
  note: string;
  hash: string;
  transactionInfo: {
    transactionHash: string;
    from: string;
    to: string;
    isOutgoingTransaction: boolean;
  };
  amount: string;
  tokenSymbol?: string;
  tokenLogo?: string;
  tokenName?: string;
  readOnly: boolean;
  timestamp: string;
  transactionId?: string;
  annotation?: Partial<TransactionAnnotation> | null;
  blockTimestamp?: number;
}

interface InitialState {
  currentTransaction: CurrentTransaction;
}

export const emptyCurrentTransaction: CurrentTransaction = {
  category: TransactionCategory.Uncategorized as Category,
  note: '',
  hash: '',
  transactionInfo: {
    transactionHash: '',
    from: '',
    to: '',
    isOutgoingTransaction: false
  },
  amount: '',
  tokenSymbol: '',
  tokenLogo: '',
  tokenName: '',
  readOnly: true,
  timestamp: '',
  annotation: {
    acquisitionDate: new Date(0),
    equityStake: '',
    fromLabel: '',
    transactionId: '',
    preMoneyValuation: '',
    postMoneyValuation: '',
    roundCategory: '',
    sharesAmount: '',
    toLabel: '',
    tokenAmount: '',
    transactionCategory: TransactionCategory.Uncategorized as Category,
    memo: '',
    companyName: '',
    annotationMetadata: ''
  }
};

export const initialState: InitialState = {
  currentTransaction: emptyCurrentTransaction
};
