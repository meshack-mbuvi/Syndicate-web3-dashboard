export type TransactionCategory =
  | 'INVESTMENT'
  | 'INVESTMENT_TOKEN'
  | 'EXPENSE'
  | 'DEPOSIT'
  | 'OTHER'
  | 'UNCATEGORISED'
  | 'SELECT_CATEGORY'
  | 'TOKEN'
  | 'COLLECTIBLE'
  | 'OFF_CHAIN_INVESTMENT'
  | 'DISTRIBUTION';

export enum RoundCategory {
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
  category: TransactionCategory;
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
  metadata?: {
    acquisitionDate?: Date;
    annotationMetadata?: Record<string, any>;
    createdAt?: Date;
    fullyDilutedOwnershipStake?: string;
    fromLabel?: string;
    memo?: string;
    postMoneyValuation?: string;
    preMoneyValuation?: string;
    roundCategory?: RoundCategory;
    numberShares?: string;
    toLabel?: string;
    numberTokens?: string;
    transactionCategory?: string;
    transactionId?: string;
    updatedAt?: Date;
    companyName?: string;
  };
  blockTimestamp?: number;
}

interface InitialState {
  currentTransaction: CurrentTransaction;
}

export const emptyCurrentTransaction: CurrentTransaction = {
  category: 'UNCATEGORISED',
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
  timestamp: ''
};

export const initialState: InitialState = {
  currentTransaction: emptyCurrentTransaction
};
