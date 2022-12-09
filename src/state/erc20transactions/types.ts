export enum TransactionCategory {
  INVESTMENT = 'INVESTMENT',
  INVESTMENT_TOKEN = 'INVESTMENT_TOKEN',
  EXPENSE = 'EXPENSE',
  DEPOSIT = 'DEPOSIT',
  OTHER = 'OTHER',
  UNCATEGORIZED = 'UNCATEGORIZED',
  SELECT_CATEGORY = 'SELECT_CATEGORY',
  TOKEN = 'TOKEN',
  COLLECTIBLE = 'COLLECTIBLE',
  OFF_CHAIN_INVESTMENT = 'OFF_CHAIN_INVESTMENT',
  DISTRIBUTION = 'DISTRIBUTION'
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

export type SyndicateDetailsAnnotation = {
  acquisitionDate: Date;
  annotationMetadata: any;
  companyName: string;
  equityStake: string;
  fromLabel: string;
  memo: string;
  postMoneyValuation: string;
  preMoneyValuation: string;
  roundCategory: string;
  sharesAmount: string;
  toLabel: string;
  tokenAmount: string;
  transactionCategory: TransactionCategory;
  transactionId: string;
};

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
  annotation: SyndicateDetailsAnnotation;
  blockTimestamp?: number;
}

interface InitialState {
  currentTransaction: CurrentTransaction;
}

export const emptyCurrentTransaction: CurrentTransaction = {
  category: TransactionCategory.UNCATEGORIZED,
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
    transactionCategory: TransactionCategory.UNCATEGORIZED,
    memo: '',
    companyName: '',
    annotationMetadata: ''
  }
};

export const initialState: InitialState = {
  currentTransaction: emptyCurrentTransaction
};
