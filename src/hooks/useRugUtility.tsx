import { AppState } from "@/state";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useRugUtility: any = (tokenId, refresh) => {
  const {
    web3Reducer: {
      web3: { account },
    },
    initializeContractsReducer: {
      syndicateContracts: { RugClaimModule, RugUtilityProperty },
    },
  } = useSelector((state: AppState) => state);

  const [tokenProperties, setTokenProperties] = useState({
    tokenBalance: "0",
    tokenProduction: "0",
  });
  const [loading, setLoading] = useState(true);

  const checkTokenAmount = async () => {
    if (!tokenId) return;

    const tokenBalance = await RugClaimModule.getClaimAmount(tokenId);
    const tokenProduction = await RugUtilityProperty.getProduction(tokenId);

    setTokenProperties({ tokenBalance, tokenProduction });
    setLoading(false);
  };

  useEffect(() => {
    if (!account || !tokenId) return;

    checkTokenAmount();
  }, [account, tokenId, refresh]);

  return {
    loading,
    ...tokenProperties,
  };
};

export default useRugUtility;
