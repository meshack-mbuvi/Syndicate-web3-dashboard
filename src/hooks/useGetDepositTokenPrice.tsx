import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AppState } from '@/state';
import { useDispatch, useSelector } from 'react-redux';
import { setDepositTokenUSDPrice } from '@/state/erc20token/slice';
import { getNativeTokenPrice, getTokenPrice } from '@/utils/api/transactions';

export const useGetDepositTokenPrice = (chainId: number) => {
  const {
    erc20TokenSliceReducer: {
      depositDetails: { depositToken, loading: detailsLoading }
    },
    web3Reducer: {
      web3: { activeNetwork }
    }
  } = useSelector((state: AppState) => state);
  const [tokenPriceInUSDState, setTokenPriceInUSDState] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (router.isReady && !detailsLoading) {
      const pricePromise =
        depositToken === ''
          ? getNativeTokenPrice(activeNetwork.chainId)
          : getTokenPrice(depositToken, chainId);
      pricePromise
        .then((price) => {
          setTokenPriceInUSDState(price);
          dispatch(setDepositTokenUSDPrice(price));
          setLoading(false);
        })
        .catch((error) => setError(error));
    }
  }, [depositToken, chainId, router.isReady, detailsLoading]);
  return [tokenPriceInUSDState, loading, error];
};
