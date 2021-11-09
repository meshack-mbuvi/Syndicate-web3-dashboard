import { getWeiAmount } from "@/utils/conversions";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

export const useERC20TokenBalance = (
  account: string | number,
  depositTokenContract: any,
  depositTokenDecimals: number,
): number => {
  const [erc20Balance, setErc20Balance] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (account && depositTokenContract._address && router.isReady) {
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
  }, [
    account,
    depositTokenContract.methods,
    depositTokenDecimals,
    router.isReady,
  ]);
  return useMemo(() => erc20Balance, [erc20Balance]);
};
