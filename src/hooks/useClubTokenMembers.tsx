import { CLUB_TOKEN_MEMBERS } from "@/graphql/queries";
import { RootState } from "@/redux/store";
import { setClubMembers } from "@/state/clubMembers";
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
  } = useSelector((state: RootState) => state);

  const router = useRouter();
  const { clubAddress } = router.query;

  const { account, currentEthereumNetwork } = web3;

  // Retrieve syndicates that I manage
  const { loading, refetch, data } = useQuery(CLUB_TOKEN_MEMBERS, {
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

    const { symbol, totalSupply } = erc20Token;

    const clubMembers = members.map(
      ({ depositAmount, member: { memberAddress } }) => {
        const ownershipShare =
          (+getWeiAmount(depositAmount, 6, false) * 100) / +totalSupply;

        return {
          memberAddress,
          ownershipShare,
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
  ]);

  useEffect(() => {
    if (!loading) {
      processMembers(data?.syndicateDAOs?.[0]?.members);
    }
  }, [JSON.stringify(data?.syndicateDAOs?.[0]?.members), loading]);

  return { loading };
};

export default useClubTokenMembers;
