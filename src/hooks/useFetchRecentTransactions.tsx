import { useQuery } from "@apollo/client";
import { RECENT_TRANSACTIONS } from "@/graphql/queries";
import { useSelector } from "react-redux";
import { AppState } from "@/state";
import * as CryptoJS from 'crypto-js';
import { useDemoMode } from "./useDemoMode";

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET_KEY;

export const useFetchRecentTransactions: any = (
  skip = 0,
  skipQuery = true,
  where = {},
) => {
  const {
    web3Reducer: {
      web3: { account },
    },
    erc20TokenSliceReducer: { erc20Token },
  } = useSelector((state: AppState) => state);
  const isDemoMode = useDemoMode();

  return useQuery(RECENT_TRANSACTIONS, {
    variables: {
      syndicateAddress: CryptoJS.AES.encrypt(erc20Token.owner.toString(), SECRET_KEY).toString(), // encrypted input
      where,
      take: 10,
      skip,
    },
    // set notification to true to receive loading state
    notifyOnNetworkStatusChange: true,
    skip: !account || skipQuery || isDemoMode,
    context: { clientName: "backend" },
  });
};
