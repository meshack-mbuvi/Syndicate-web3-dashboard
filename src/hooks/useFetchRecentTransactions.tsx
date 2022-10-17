import { RECENT_TRANSACTIONS } from '@/graphql/queries';
import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { AppState } from '@/state';
import { useQuery } from '@apollo/client';
import * as CryptoJS from 'crypto-js';
import { useSelector } from 'react-redux';

import { useDemoMode } from './useDemoMode';

const GRAPHQL_HEADER = process.env.NEXT_PUBLIC_GRAPHQL_HEADER;

// Get input, note this is deterministic
export const getInput: any = (address: string) => {
  // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
  const wordArray = CryptoJS.enc.Utf8.parse(GRAPHQL_HEADER);
  return CryptoJS.AES.encrypt(address, wordArray, {
    mode: CryptoJS.mode.ECB
  }).toString();
};

export const useFetchRecentTransactions: any = (
  skip = 0,
  skipQuery = true,
  where = {}
) => {
  const {
    web3Reducer: {
      web3: { account, activeNetwork }
    },
    erc20TokenSliceReducer: { erc20Token }
  } = useSelector((state: AppState) => state);
  const isDemoMode = useDemoMode();

  const input = getInput(`${erc20Token.address}:${account}`);
  return useQuery(RECENT_TRANSACTIONS, {
    variables: {
      input,
      where,
      take: 10,
      skip,
      chainId: activeNetwork.chainId
    },
    // set notification to true to receive loading state
    notifyOnNetworkStatusChange: true,
    skip: !account || !activeNetwork.chainId || skipQuery || isDemoMode,
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND,
      chainId: activeNetwork.chainId
    }
  });
};
