import { getWeiAmount } from "@/utils/conversions";
import { useEffect, useMemo, useState } from "react";

export const useERC20TokenBalance = (
  account: string | number,
  depositTokenContract: any,
  depositTokenDecimals: number,
): number => {
  const [erc20Balance, setErc20Balance] = useState(0);

  useEffect(() => {
    if (account && depositTokenContract._address) {
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
  }, [account, depositTokenContract.methods, depositTokenDecimals]);
  return useMemo(() => erc20Balance, [erc20Balance]);
};
