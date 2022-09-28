import { useState, useEffect } from 'react';
import { getTokenDetails } from '@/utils/api';
import { useRouter } from 'next/router';
import { AppState } from '@/state';
import { useSelector } from 'react-redux';

export type TokenDetails = {
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
};

export const EmptyTokenDetails = {
  contractAddress: '',
  name: '',
  symbol: '',
  decimals: 18,
  logo: ''
};

const useGetDepositTokenDetails = (chainId: number): Array<TokenDetails> => {
  const {
    erc20TokenSliceReducer: {
      depositDetails: { depositToken }
    }
  } = useSelector((state: AppState) => state);

  const [tokenDetails, setTokenDetails] =
    useState<TokenDetails>(EmptyTokenDetails);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      getTokenDetails(depositToken, chainId)
        .then((res) => {
          setTokenDetails({
            contractAddress: res.data.contractAddress,
            name: res.data.name,
            symbol: res.data.symbol,
            decimals: res.data.decimals,
            // @ts-expect-error TS(2322): Type 'string | undefined' is not assignable to type 'string'.
            logo: res.data.logo
          });
        })
        .catch((err) => setError(err));
    }
  }, [depositToken, chainId, router.isReady]);
  // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'TokenDetail... Remove this comment to see the full error message
  return [tokenDetails, error];
};

export default useGetDepositTokenDetails;
