enum GraphEventType {
  MEMBER_MINTED,
}

export interface GraphEvent {
  id: string;
  eventType: GraphEventType;
  transactionId: string;
}

export type TransactionCategory =
  | "INVESTMENT"
  | "INVESTMENT_TOKEN"
  | "EXPENSE"
  | "DEPOSIT"
  | "OTHER"
  | "UNCATEGORISED"
  | "SELECT_CATEGORY";

export enum RoundCategory {
  SEED,
  SERIES_A,
  SERIES_B,
  SERIES_C,
  SERIES_D,
  SERIES_E,
  PUBLIC,
  ICO,
  OTHER,
}

export interface TransactionAnnotation {
  memo: string;
  transactionCategory: TransactionCategory;
  roundCategory: RoundCategory;
  numberShares: string;
  numberTokens: string;
  fullyDilutedOwnershipStake: string;
  acquisitionDate: Date;
  preMoneyValuation: string;
  postMoneyValuation: string;
  fromLabel: string;
  toLabel: string;
  transactionId: string;
  annotationMetadata: JSON;
  createdAt: Date;
  updatedAt: Date;
  companyName: string;
}

export interface Transaction {
  syndicateAddress: string;
  blockTimestamp: number;
  contractAddress: string;
  fromAddress: string;
  toAddress: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: number;
  events: GraphEvent[];
  metadata: TransactionAnnotation;
  isOutgoingTransaction: boolean;
  hash: string;
  categoryIsReadonly?: boolean;
  tokenLogo?: string;
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
  tokenSymbol: string;
  tokenLogo: string;
  tokenName: string;
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
export type ClubTransactions = Record<number, Transaction[]>;

interface InitialState {
  myTransactions: ClubTransactions;
  currentTransaction: CurrentTransaction;
  totalTransactionsCount: number;
  loading: boolean;
}

export const emptyCurrentTransaction: CurrentTransaction = {
  category: "UNCATEGORISED",
  note: "",
  hash: "",
  transactionInfo: {
    transactionHash: "",
    from: "",
    to: "",
    isOutgoingTransaction: false,
  },
  amount: "",
  tokenSymbol: "",
  tokenLogo: "",
  tokenName: "",
  readOnly: true,
  timestamp: "",
};

export const initialState: InitialState = {
  myTransactions: {},
  currentTransaction: emptyCurrentTransaction,
  totalTransactionsCount: 0,
  loading: true,
};
