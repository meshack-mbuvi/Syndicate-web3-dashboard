import { CLUB_TOKEN_MEMBERS } from "@/graphql/queries";
import { AppState } from "@/state";
import { setClubMembers, setLoadingClubMembers } from "@/state/clubMembers";
import { getWeiAmount } from "@/utils/conversions";
import { mockClubMembers } from "@/utils/mockdata";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDemoMode } from "./useDemoMode";

const useClubTokenMembers = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: { web3 },
    erc20TokenSliceReducer: { erc20Token },
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const { clubAddress } = router.query;
  const isDemoMode = useDemoMode();

  const { account, currentEthereumNetwork } = web3;

  // Retrieve syndicates that I manage
  const {
    loading: loadingClubMembers,
    refetch,
    data,
  } = useQuery(CLUB_TOKEN_MEMBERS, {
    variables: {
      where: {
        contractAddress: clubAddress?.toString().toLocaleLowerCase(),
      },
    },
    skip: !clubAddress || isDemoMode,
  });

  const processMembers = (members) => {
    if (!members || !members.length) {
      return;
    }

    const { symbol, tokenDecimals } = erc20Token;

    const clubMembers = members.map(
      ({
        depositAmount,
        ownershipShare,
        tokens,
        member: { memberAddress },
      }) => {
        return {
          memberAddress,
          ownershipShare: parseInt(ownershipShare) / 10000,
          symbol,
          clubTokens: getWeiAmount(tokens, tokenDecimals, false),
          totalSupply: erc20Token.totalSupply,
          depositAmount: getWeiAmount(depositAmount, 6, false),
        };
      },
    );

    dispatch(setClubMembers(clubMembers));
  };

  useEffect(() => {
    if (router.isReady) {
      refetch();
    }
  }, [
    router.isReady,
    account,
    currentEthereumNetwork,
    JSON.stringify(erc20Token),
    erc20Token.totalSupply,
  ]);

  useEffect(() => {
    if (loadingClubMembers) {
      dispatch(setLoadingClubMembers(true));
    } else if (isDemoMode) {
      processMembers(mockClubMembers);
    } else {
      processMembers(data?.syndicateDAOs?.[0]?.members);
      dispatch(setLoadingClubMembers(false));
    }
  }, [
    JSON.stringify(data?.syndicateDAOs?.[0]?.members),
    loadingClubMembers,
    clubAddress,
    account
  ]);
};

export default useClubTokenMembers;
