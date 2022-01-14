import { AppState } from "@/state";
import { getWeiAmount } from "@/utils/conversions";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function useAccountTokens(): { accountTokens; memberPercentShare } {
  const {
    web3Reducer: {
      web3: { account },
    },
    erc20TokenSliceReducer: {
      erc20TokenContract,
      erc20Token: { totalSupply, tokenDecimals, totalDeposits },
    },
  } = useSelector((state: AppState) => state);
  const [accountTokens, setAccountTokens] = useState<string>("0");

  useEffect(() => {
    if (!erc20TokenContract) return;
    erc20TokenContract.balanceOf(account).then((tokensInWei) => {
      const accountTokens = getWeiAmount(tokensInWei, tokenDecimals, false);
      setAccountTokens(accountTokens);
    });
  }, [erc20TokenContract, account, tokenDecimals, totalSupply, totalDeposits]);

  const memberPercentShare = (+accountTokens * 100) / +totalSupply;

  return { accountTokens, memberPercentShare };
}
