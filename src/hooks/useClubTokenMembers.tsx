import { CLUB_TOKEN_MEMBERS } from "@/graphql/queries";
import { AppState } from "@/state";
import { setClubMembers, setLoadingClubMembers } from "@/state/clubMembers";
import { getWeiAmount } from "@/utils/conversions";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useClubTokenMembers = () => {
  const dispatch = useDispatch();

  const {
    web3Reducer: { web3 },
    erc20TokenSliceReducer: { erc20Token },
  } = useSelector((state: AppState) => state);

  const router = useRouter();
  const { clubAddress } = router.query;

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
  });

  const processMembers = (members) => {
    if (!members || !members.length) {
      return;
    }

    const { symbol } = erc20Token;

    const clubMembers = members.map(
      ({ depositAmount, ownershipShare, member: { memberAddress } }) => {
        return {
          memberAddress,
          ownershipShare: parseInt(ownershipShare) / 10000,
          symbol,
          clubTokens: getWeiAmount(depositAmount, 6, false),
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
    } else {
      processMembers(data?.syndicateDAOs?.[0]?.members);
      dispatch(setLoadingClubMembers(false));
    }
  }, [JSON.stringify(data?.syndicateDAOs?.[0]?.members), loadingClubMembers]);
};

export default useClubTokenMembers;
