import { SUPPORTED_GRAPHS } from '@/Networks/backendLinks';
import { useQuery } from '@apollo/client';
import { TOKEN_DETAILS } from '@/graphql/queries';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '@/state';
import { useRouter } from 'next/router';
import { Status } from '@/state/wallet/types';

export type TokenDetails = {
  chainId: number;
  address?: string;
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
};

export type TokenDetailsQuery = {
  token: TokenDetails;
  loading: boolean;
  networkStatus: number;
};

const EmptyTokenDetails = {
  chainId: 1,
  name: '',
  symbol: '',
  decimals: 18,
  logo: ''
};

const useTokenDetails = (
  address: string,
  skipQuery?: boolean
): TokenDetails => {
  const {
    web3Reducer: {
      web3: {
        status,
        activeNetwork: { chainId }
      }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const [tokenDetails, setTokenDetails] =
    useState<TokenDetails>(EmptyTokenDetails);

  const { data, loading } = useQuery<TokenDetailsQuery>(TOKEN_DETAILS, {
    variables: {
      chainId,
      address
    },
    context: {
      clientName: SUPPORTED_GRAPHS.BACKEND,
      chainId
    },
    skip: !router.isReady || status !== Status.CONNECTED || skipQuery
  });

  useEffect(() => {
    if (loading || !data) return;
    setTokenDetails(data.token);
  }, [data, loading]);

  return tokenDetails;
};

export default useTokenDetails;
