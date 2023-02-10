import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { debounce, isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

export const useNativeBalance = (account: string): number => {
  const [nativeBalance, setNativeBalance] = useState<number>(0);

  const {
    web3Reducer: {
      web3: { web3 }
    }
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const fetchBalance = debounce((initial) => {
    if (router.isReady && account && !isEmpty(web3)) {
      web3.eth
        .getBalance(account)
        .then((balance: string) => {
          setNativeBalance(+getWeiAmount(balance, 18, false));
        })
        .catch(() => {
          initial ? setNativeBalance(0) : null;
        });
    }
  }, 4500);

  useEffect(() => {
    if (isEmpty(web3) || !account) return;

    web3.eth.clearSubscriptions(() => '');
    const subscription = web3.eth.subscribe('newBlockHeaders');
    subscription
      .on('connected', () => {
        fetchBalance(true); // Hack for first time the page renders;
      })
      .on('data', () => {
        fetchBalance(false);
      });

    return () => {
      void subscription.unsubscribe();
    };
  }, [web3?._provider, account, router.isReady]);

  return useMemo(() => nativeBalance, [nativeBalance]);
};
