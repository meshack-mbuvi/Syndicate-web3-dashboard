import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

export const useNativeBalance = (account: string): number => {
  const [nativeBalance, setNativeBalance] = useState(null);

  const {
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const fetchBalance = () => {
    if (router.isReady && account && !isEmpty(web3)) {
      web3.eth
        .getBalance(account)
        .then((balance) => {
          setNativeBalance(getWeiAmount(web3, balance, 18, false));
        })
        .catch(() => {
          setNativeBalance(0);
        });
    }
  };

  useEffect(() => {
    if (isEmpty(web3)) return;

    const subscription = web3.eth.subscribe('newBlockHeaders');
    subscription
      .on('connected', () => {
        fetchBalance(); // Hack for first time the page renders
      })
      .on('data', () => {
        fetchBalance();
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [web3?._provider, , account, router.isReady]);

  return useMemo(() => nativeBalance, [nativeBalance]);
};
