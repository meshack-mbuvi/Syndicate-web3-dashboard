import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { TransactionCategory } from '@/state/erc20transactions/types';
import * as CryptoJS from 'crypto-js';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  GraphEventType,
  LegacyTransactionEvent,
  TransferType,
  useGetLegacyTransactionsQuery
} from './data-fetching/backend/generated-types';
import { useDemoMode } from './useDemoMode';

export type SyndicateEvents = {
  eventType: string;
  id: string;
  transactionId: string;
  distributionBatch: string | '';
};

export type SyndicateTransfers = {
  chainId: number;
  blockNumber: number;
  timestamp: number;
  hash: string;
  from: string;
  to: string;
  contractAddress: string;
  gas: number;
  tokenName?: string;
  tokenSymbol?: string;
  tokenDecimal?: number;
  tokenLogo?: string;
  value: number;
};

export type SyndicateAnnotation = {
  acquisitionDate: Date;
  annotationMetadata: string;
  chainId: number;
  companyName: string;
  createdAt: Date;
  equityStake: string;
  fromLabel: string;
  memo: string;
  postMoneyValuation: string;
  preMoneyValuation: string;
  roundCategory: string;
  sharesAmount: string;
  syndicateAddress: string;
  toLabel: string;
  tokenAmount: string;
  // TODO: tokenTransfer add in future?
  transactionCategory: TransactionCategory;
  transactionId: string;
  updatedAt: Date;
};

export type TransactionEvents = {
  length?: number;
  transactionIndex?: number;
} & Partial<LegacyTransactionEvent>;

export const EmptyTransactionEvent: TransactionEvents[] = [
  {
    length: 0,
    chainId: 1,
    ownerAddress: '',
    hash: '',
    blockNumber: 0,
    timestamp: 0,
    transactionIndex: 0,
    contractAddress: '',
    transfers: [
      {
        chainId: 1,
        hash: '',
        from: '',
        to: '',
        contractAddress: '',
        tokenName: '',
        tokenSymbol: '',
        tokenDecimal: 18,
        value: '0',
        type: TransferType.Erc20
      }
    ],
    annotation: {
      chainId: 1,
      acquisitionDate: new Date(0),
      createdAt: new Date(0),
      updatedAt: new Date(0),
      equityStake: '',
      fromLabel: '',
      transactionId: '',
      syndicateAddress: '',
      preMoneyValuation: '',
      postMoneyValuation: '',
      roundCategory: '',
      sharesAmount: '',
      toLabel: '',
      tokenAmount: '',
      transactionCategory: null,
      memo: '',
      companyName: '',
      annotationMetadata: ''
    },
    syndicateEvents: [
      {
        eventType: GraphEventType.DepositToken,
        id: '',
        transactionId: '',
        distributionBatch: ''
      }
    ]
  }
];

export type TransactionsQuery = {
  legacyTransactionEvents: {
    cursor: null;
    events: TransactionEvents[];
  };
};

export type TransactionQueryDetails = {
  transactionsLoading: boolean;
  numTransactions: number;
  transactionEvents?: TransactionEvents[];
  refetchTransactions: () => void;
};

const GRAPHQL_HEADER = process.env.NEXT_PUBLIC_GRAPHQL_HEADER;

// Get input, note this is deterministic
export const getInput = (address: string): string => {
  const wordArray = CryptoJS.enc.Utf8.parse(GRAPHQL_HEADER ?? '');
  return CryptoJS.AES.encrypt(address, wordArray, {
    mode: CryptoJS.mode.ECB
  }).toString();
};

export const useLegacyTransactions = (
  where = {},
  offset = 0,
  limit = 10,
  skipQuery = true
): TransactionQueryDetails => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    },
    erc20TokenSliceReducer: { erc20Token }
  } = useSelector((state: AppState) => state);

  const isDemoMode = useDemoMode();
  const input = getInput(`${erc20Token.address}:${account}`);

  const {
    data,
    loading: transactionsLoading,
    refetch: refetchTransactions
  } = useGetLegacyTransactionsQuery({
    variables: {
      chainId: activeNetwork.chainId,
      input,
      where,
      offset,
      limit
    },
    // set notification to true to receive loading state
    notifyOnNetworkStatusChange: true,
    skip: !account || !activeNetwork.chainId || skipQuery || isDemoMode,
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND,
      chainId: activeNetwork.chainId
    }
  });

  const [numTransactions, setNumTransactions] = useState<number>(0);
  const [transactionEvents, setTransactionEvents] = useState<
    TransactionEvents[] | undefined
  >();

  useEffect(() => {
    if (transactionsLoading || !data?.legacyTransactionEvents) return;
    const { events } = data.legacyTransactionEvents;

    setNumTransactions(events?.length ?? 0);

    if (events) {
      setTransactionEvents(events as TransactionEvents[]);
    }
  }, [data?.legacyTransactionEvents, transactionsLoading]);

  return {
    transactionsLoading,
    numTransactions,
    transactionEvents,
    refetchTransactions
  };
};
