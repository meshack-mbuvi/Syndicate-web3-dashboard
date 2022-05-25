import { useQuery } from '@apollo/client';
import { RECENT_TRANSACTIONS } from '@/graphql/queries';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import * as CryptoJS from 'crypto-js';
import { useDemoMode } from './useDemoMode';
import { ChainEnum } from '@/utils/api/ChainTypes';
import { isDev } from '@/utils/environment';

const GRAPHQL_HEADER = process.env.NEXT_PUBLIC_GRAPHQL_HEADER;

/* TODO - refactor for other chains see ENG-3310 */
const chainId = isDev ? ChainEnum.RINKEBY : ChainEnum.ETHEREUM;

// Get input, note this is deterministic
export const getInput: any = (address: string) => {
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
      web3: { account }
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
      chainId
    },
    // set notification to true to receive loading state
    notifyOnNetworkStatusChange: true,
    skip: !account || skipQuery || isDemoMode,
    context: { clientName: 'backend' }
  });
};
