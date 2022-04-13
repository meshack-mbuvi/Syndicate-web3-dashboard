import { useEffect, useState } from 'react';
import { getTokenPrice } from '@/utils/api';
import { useRouter } from 'next/router';
import { AppState } from '@/state';
import { useDispatch, useSelector } from 'react-redux';
import { setDepositTokenUSDPrice } from '@/state/erc20token/slice';

export const useGetDepositTokenPrice = (
  chainId: number
) => {
  const {
    erc20TokenSliceReducer: {
      depositDetails: { depositToken, loading: detailsLoading }
    }
  } = useSelector((state: AppState) => state);
  const [tokenPriceInUSDState, setTokenPriceInUSDState] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch()

  useEffect(() => {
    if (router.isReady && !detailsLoading) {
      getTokenPrice(depositToken, chainId)
      .then((res) => {
        setTokenPriceInUSDState(res.data[depositToken]['usd']);
        dispatch(setDepositTokenUSDPrice(res.data[depositToken]['usd']))
        setLoading(false);
      })
      .catch((error) => setError(error));
    }
  }, [depositToken, chainId, router.isReady, detailsLoading]);
  return [tokenPriceInUSDState, loading, error];
};