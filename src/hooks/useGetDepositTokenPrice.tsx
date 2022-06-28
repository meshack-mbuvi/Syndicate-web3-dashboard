import { AppState } from '@/state';
import { setDepositTokenUSDPrice } from '@/state/erc20token/slice';
import { getNativeTokenPrice, getTokenPrices } from '@/utils/api/transactions';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
          : getTokenPrices(depositToken.toLowerCase(), chainId);
      pricePromise
        .then((res) => {
          const price = depositToken
            ? res[depositToken.toLowerCase()]['usd']
            : res;
          setTokenPriceInUSDState(price);
          dispatch(setDepositTokenUSDPrice(price));
          setLoading(false);
        })
        .catch((error) => setError(error));
    }
  }, [depositToken, chainId, router.isReady, detailsLoading]);
  return [tokenPriceInUSDState, loading, error];
};
