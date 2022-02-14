import { AppState } from "@/state";
import { getWeiAmount } from "@/utils/conversions";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export const useEthBalance = (account: string): number => {
  const [ethBalance, setEthBalance] = useState(null);

  const {
    web3Reducer: {
      web3: { web3 },
    },
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const fetchBalance = () => {
    if (router.isReady && account) {
      web3.eth
        .getBalance(account)
        .then((balance) => {
          setEthBalance(getWeiAmount(balance, 18, false));
        })
        .catch(() => {
          setEthBalance(0);
        });
    }
  };

  useEffect(() => {
    const subscription = web3.eth.subscribe("newBlockHeaders");
    subscription
      .on("connected", () => {
        fetchBalance(); // Hack for first time the page renders
      })
      .on("data", () => {
        fetchBalance();
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [account]);
  return useMemo(() => ethBalance, [ethBalance]);
};