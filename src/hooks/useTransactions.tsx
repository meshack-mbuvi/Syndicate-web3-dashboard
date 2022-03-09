import { AppState } from "@/state";
import {
  setMyTransactions,
  setLoadingTransactions,
} from "@/state/erc20transactions";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFetchRecentTransactions } from "./useFetchRecentTransactions";

const useTransactions = (skip: number = 0) => {
  const dispatch = useDispatch();

  const {
    web3Reducer: { web3 },
  } = useSelector((state: AppState) => state);

  const router = useRouter();

  const { account, activeNetwork } = web3;

  // Refresh and get latest transactions of club owner from backend
  const {
    loading: transactionsLoading,
    data: transactionsData,
    refetch: refetchTransactions,
  } = useFetchRecentTransactions();

  useEffect(() => {
    if (router.isReady) {
      refetchTransactions();
    }
  }, [router.isReady, account]);

  const processERC20Transactions = async (txns) => {
    dispatch(setLoadingTransactions(true));
    dispatch(setMyTransactions({ txns, skip }));
    dispatch(setLoadingTransactions(false));
  };

  useEffect(() => {
    dispatch(setLoadingTransactions(true));

    if (transactionsData?.Financial_recentTransactions?.edges) {
      processERC20Transactions(
        transactionsData.Financial_recentTransactions.edges,
      );
    }
  }, [
    account,
    activeNetwork,
    transactionsLoading,
    JSON.stringify(transactionsData),
  ]);

  return { transactionsLoading };
};

export default useTransactions;
