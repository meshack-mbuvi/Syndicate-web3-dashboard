import { SINGLE_CLUB_DETAILS } from "@/graphql/queries";
import { AppState } from "@/state";
import { getWeiAmount } from "@/utils/conversions";
import { MOCK_TOTALDEPOSITS, MOCK_TOTALSUPPLY } from "@/utils/mockdata";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDemoMode } from "./useDemoMode";

/**
 * Retrieves club total deposits and total supply from the thegraph.
 * NOTE: More fields like owner address can also be retrieved if needed.
 * @param contractAddress
 * @returns
 */
export function useClubDepositsAndSupply(contractAddress: string): {
  refetch;
  totalDeposits;
  totalSupply;
  loadingClubDeposits;
} {
  const {
    erc20TokenSliceReducer: { erc20Token },
  } = useSelector((state: AppState) => state);

  const [totalDeposits, setTotalDeposits] = useState("");
  const [totalSupply, setTotalSupply] = useState("0");
  const [loadingClubDeposits, setLoadingClubDeposits] = useState(true);

  const { isReady } = useRouter();
  const isDemoMode = useDemoMode();

  // SINGLE_CLUB_DETAILS
  const { loading, data, refetch } = useQuery(SINGLE_CLUB_DETAILS, {
    variables: {
      where: {
        contractAddress: contractAddress?.toLocaleLowerCase() || "",
      },
    },
    // Avoid unnecessary calls when contractAddress is not defined or in demo mode
    skip: !contractAddress || isDemoMode,
  });

  const { tokenDecimals } = erc20Token;

  /**
   * Retrieve totalDeposits,totalSupply from the thegraph
   */
  useEffect(() => {
    if (isDemoMode) {
      setTotalSupply(MOCK_TOTALSUPPLY);
      setTotalDeposits(MOCK_TOTALDEPOSITS);
      setLoadingClubDeposits(false);
      return;
    }

    if (loading || !data || erc20Token?.loading) return;

    const {
      syndicateDAOs: [syndicateDAO],
    } = data || {};

    const { totalDeposits, totalSupply } = syndicateDAO || {};

    setTotalSupply(getWeiAmount(totalSupply, tokenDecimals || 18, false));
    setTotalDeposits(getWeiAmount(totalDeposits, 6, false));
    setLoadingClubDeposits(false);
  }, [data, loading, tokenDecimals, erc20Token.loading, isReady]);

  return {
    totalDeposits,
    totalSupply,
    loadingClubDeposits: loading || loadingClubDeposits,
    refetch,
  };
}
