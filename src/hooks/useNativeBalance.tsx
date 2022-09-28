import { AppState } from '@/state';
import { getWeiAmount } from '@/utils/conversions';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { debounce, isEmpty } from 'lodash';

export const useNativeBalance = (account: string): number => {
  const [nativeBalance, setNativeBalance] = useState(null);

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
        .then((balance: any) => {
          setNativeBalance(getWeiAmount(web3, balance, 18, false));
        })
        .catch(() => {
          // @ts-expect-error TS(2345): Argument of type '0' is not assignable to paramete... Remove this comment to see the full error message
          initial ? setNativeBalance(0) : null;
        });
    }
  }, 4500);

  useEffect(() => {
    if (isEmpty(web3) || !account) return;

    web3.eth.clearSubscriptions();
    const subscription = web3.eth.subscribe('newBlockHeaders');
    subscription
      .on('connected', () => {
        fetchBalance(true); // Hack for first time the page renders;
      })
      .on('data', () => {
        fetchBalance(false);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [web3?._provider, account, router.isReady]);

  // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'number'.
  return useMemo(() => nativeBalance, [nativeBalance]);
};
