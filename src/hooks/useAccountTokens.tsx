import { CLUB_MEMBER_QUERY } from "@/graphql/queries";
import { AppState } from "@/state";
import { getWeiAmount } from "@/utils/conversions";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDemoMode } from "./useDemoMode";

/**
 * Used to retrieve member ownership details for a given member address
 * and club address
 * @returns
 */
export function useAccountTokens(): {
  accountTokens;
  memberPercentShare;
  memberDeposits;
  memberOwnership;
  loadingMemberOwnership;
  refetchMemberData;
} {
  const {
    web3Reducer: {
      web3: { account },
    },
    erc20TokenSliceReducer: {
      erc20Token: { address, totalSupply, tokenDecimals, totalDeposits },
    },
  } = useSelector((state: AppState) => state);
  const [accountTokens, setAccountTokens] = useState<string>("0");
  const [memberDeposits, setMemberDeposits] = useState<string>("0");
  const [memberOwnership, setMemberOwnership] = useState<string>("0");

  const isDemoMode = useDemoMode();

  const { loading, data, refetch } = useQuery(CLUB_MEMBER_QUERY, {
    variables: {
      where: {
        memberAddress: account.toLocaleLowerCase(),
      },
      syndicateDaOsWhere2: {
        syndicateDAO: address.toLowerCase(),
      },
    },
    // Avoid unnecessary calls when account/clubAddress is not defined
    skip: !account || !address || isDemoMode,
  });

  useEffect(() => {
    if (isDemoMode) {
      setAccountTokens("3812");
      setMemberDeposits("3812");
      setMemberOwnership("31.6494");
      return;
    }

    if (loading || !data || !data.members.length) return;

    const {
      members: [member],
    } = data;

    if (member) {
      const {
        syndicateDAOs: [clubMemberData],
      } = member;

      if (clubMemberData) {
        const {
          depositAmount = 0,
          ownershipShare = 0,
          tokens = 0,
        } = clubMemberData;

        setAccountTokens(getWeiAmount(tokens, tokenDecimals, false));
        setMemberDeposits(getWeiAmount(depositAmount, 6, false));
        setMemberOwnership(`${+ownershipShare / 10000}`);
      }
    }
  }, [account, tokenDecimals, loading, address, totalSupply]);

  useEffect(() => {
    refetch();
  }, [totalSupply, totalDeposits]);

  return {
    loadingMemberOwnership: loading,
    accountTokens,
    memberPercentShare: memberOwnership,
    memberDeposits,
    memberOwnership,
    refetchMemberData: refetch,
  };
}
