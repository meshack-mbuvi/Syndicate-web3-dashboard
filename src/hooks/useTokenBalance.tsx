import { AppState } from "@/state";
import { getWeiAmount } from "@/utils/conversions";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { isEmpty } from "lodash";

export const useERC20TokenBalance = (
  account: string | number,
  depositTokenContract: any,
  depositTokenDecimals: number,
): number => {
  const [erc20Balance, setErc20Balance] = useState(null);

  const {
    web3Reducer: {
      web3: { web3 },
    },
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const fetchBalance = () => {
    if (router.isReady && account && depositTokenContract._address) {
      depositTokenContract.methods
        .balanceOf(account.toString())
        .call({ from: account })
        .then((balance) => {
          setErc20Balance(getWeiAmount(balance, depositTokenDecimals, false));
        })
        .catch(() => {
          setErc20Balance(0);
        });
    }
  };

  useEffect(() => {
    if (isEmpty(web3)) return;

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
  }, [web3?._provider, account, depositTokenContract?._address]);
  return useMemo(() => erc20Balance, [erc20Balance]);
};
